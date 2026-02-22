import axiosInstance from '@/libs/axios';

export type CreateLcaAssessmentPayload = {
  assessment_date?: string;
  status?: string;
  goalAndScope?: {
    productName?: string;
    productCategory?: string;
    companyOrganisation?: string;
    assessorName?: string;
    geographicalScope?: string;
    goalOfStudy?: string;
    intendedApplication?: string;
    targetAudience?: string;
    comparativeStudy?: boolean;
    scopeDescription?: string;
    functionalUnit?: string;
    systemBoundary?: string;
    impactAssessmentMethod?: string;
    allocationProcedures?: string;
    assumptionsLimitations?: string;
  };
  lifeCycleInventory?: {
    materials?: any[];
    energyInputs?: any[];
    emissions?: Record<string, any>;
    transport?: any[];
    manufacturingProcesses?: any[];
    usePhaseScenarios?: any[];
    eolScenarios?: any[];
  };
  impactAssessment?: Record<string, any>;
  interpretation?: Record<string, any>;
  epdPcr?: {
    epdReferences?: any[];
    pcrReferences?: any[];
  };
  dataQuality?: Record<string, any>;
  referenceFlow?: {
    referenceProduct?: string;
    referenceFlowUnit?: string;
    referenceFlowQuantity?: number | string;
    productMassKg?: number | string;
    conversionRatio?: number | string;
    referenceFlowDescription?: string;
    includedStages?: string;
    exclusionsCutoffs?: string;
    allocationBasis?: string;
  };
};

export type CreateLcaAssessmentResponse = {
  id: string;
  message: string;
  assessment: any;
};

export const createLcaAssessment = async (
  payload: CreateLcaAssessmentPayload,
): Promise<CreateLcaAssessmentResponse> => {
  const response = await axiosInstance.post<CreateLcaAssessmentResponse>(
    '/api/v1/lca-assessments',
    payload,
  );

  return response.data;
};
