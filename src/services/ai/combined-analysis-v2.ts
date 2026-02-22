import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type CombinedAnalysisStartPayload =
  | { image_file: File; image_url?: never }
  | { image_url: string; image_file?: never };

export type CombinedAnalysisStatus = 'queued' | 'running' | 'complete' | 'failed';

export type CombinedAnalysisStartResponse = {
  workflowInstanceId: string;
};

export type CombinedAnalysisResult = {
  product_specifications: unknown;
  analysis_reports: unknown;
  timestamp?: string | null;
};

const canProceedPollIntervalMs = 1500;
const statusPollIntervalMs = 5000;

export async function startCombinedAnalysis(payload: CombinedAnalysisStartPayload): Promise<CombinedAnalysisStartResponse> {
  // Support multipart for file, json otherwise
  const hasFile = 'image_file' in payload && payload.image_file instanceof File;

  const parseStart = (data: any): CombinedAnalysisStartResponse => {
    const workflowInstanceId = data?.workflowInstanceId;
    if (!workflowInstanceId) {
      throw new Error('Missing workflowInstanceId from start response');
    }
    return { workflowInstanceId };
  };

  if (hasFile) {
    const formData = new FormData();
    formData.append('image_file', payload.image_file as File);

    const res = await axios.post<{ data: { workflowInstanceId: string } }>(
      API_ENDPOINTS.AI.COMBINED_ANALYSIS_V2_START,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return parseStart(res.data?.data);
  }

  const res = await axios.post<{ data: { workflowInstanceId: string } }>(
    API_ENDPOINTS.AI.COMBINED_ANALYSIS_V2_START,
    { image_url: (payload as { image_url: string }).image_url },
  );

  return parseStart(res.data?.data);
}

export async function waitForCombinedAnalysisCanProceed(workflowInstanceId: string): Promise<{
  workflowInstanceId: string;
  product_specifications: unknown;
}> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const status = await getCombinedAnalysisStatus(workflowInstanceId);

    // When product specs are ready but reports still running, backend returns:
    // data.canProceed: true and includes the product specs payload in data.
    if (status?.canProceed) {
      const productSpecs = extractProductSpecificationsFromStatus(status);
      if (!productSpecs) {
        throw new Error('canProceed is true but product specifications are missing');
      }
      return { workflowInstanceId, product_specifications: productSpecs };
    }

    // Some backends may omit canProceed but still include product specs early.
    const maybeProductSpecs = extractProductSpecificationsFromStatus(status);
    if (maybeProductSpecs) {
      return { workflowInstanceId, product_specifications: maybeProductSpecs };
    }

    if (status?.status === 'failed') {
      throw new Error(status.error || 'Combined analysis workflow failed');
    }

    await new Promise(resolve => setTimeout(resolve, canProceedPollIntervalMs));
  }
}

export async function getCombinedAnalysisStatus(workflowInstanceId: string): Promise<{
  workflowInstanceId: string;
  status: CombinedAnalysisStatus;
  canProceed?: boolean | null;
  isComplete?: boolean | null;
  reportWorkflowInstanceId?: string | null;
  reportWorkflowStatus?: string | null;
  error?: string | null;
  product_specifications?: CombinedAnalysisResult['product_specifications'];
  analysis_reports?: CombinedAnalysisResult['analysis_reports'];
  timestamp?: string | null;
  // Some backend responses “spread” product specs fields directly into data.
  [key: string]: any;
}> {
  const statusUrl = API_ENDPOINTS.AI.COMBINED_ANALYSIS_V2_STATUS.replace(
    '{workflowInstanceId}',
    workflowInstanceId,
  );

  const res = await axios.get<{
    data: {
      workflowInstanceId: string;
      status: CombinedAnalysisStatus;
      canProceed?: boolean | null;
      isComplete?: boolean | null;
      reportWorkflowInstanceId?: string | null;
      reportWorkflowStatus?: string | null;
      error?: string | null;
      product_specifications?: CombinedAnalysisResult['product_specifications'];
      analysis_reports?: CombinedAnalysisResult['analysis_reports'];
      timestamp?: string | null;
      [key: string]: any;
    };
  }>(statusUrl);

  return res.data?.data;
}

function hasSpreadProductSpecsShape(data: any): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }
  return (
    'product_data' in data
    || 'product_specification_id' in data
    || 'raw_material_composition_id' in data
    || 'analysis_id' in data
    || 'image_id' in data
  );
}

function extractProductSpecificationsFromStatus(data: any): unknown | null {
  if (!data) {
    return null;
  }
  if (data.product_specifications) {
    return data.product_specifications;
  }
  if (hasSpreadProductSpecsShape(data)) {
    return data;
  }
  return null;
}

function isCombinedComplete(data: any): boolean {
  if (!data) {
    return false;
  }
  if (typeof data.isComplete === 'boolean') {
    return data.isComplete;
  }
  if (data.status === 'complete') {
    return true;
  }
  if (data.analysis_reports) {
    return true;
  }
  return false;
}

export async function waitForCombinedAnalysis(workflowInstanceId: string): Promise<CombinedAnalysisResult> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const current = await getCombinedAnalysisStatus(workflowInstanceId) ?? {};

    if (current.status === 'failed') {
      throw new Error(current.error || 'Combined analysis workflow failed');
    }

    if (isCombinedComplete(current)) {
      const productSpecs = extractProductSpecificationsFromStatus(current);
      const reports = current.analysis_reports;
      if (!productSpecs || !reports) {
        throw new Error('Workflow completed without result payload');
      }
      return {
        product_specifications: productSpecs,
        analysis_reports: reports,
        timestamp: current.timestamp ?? null,
      };
    }

    await new Promise(resolve => setTimeout(resolve, statusPollIntervalMs));
  }
}

export async function runCombinedAnalysis(payload: CombinedAnalysisStartPayload): Promise<CombinedAnalysisResult> {
  const start = await startCombinedAnalysis(payload);
  return waitForCombinedAnalysis(start.workflowInstanceId);
}
