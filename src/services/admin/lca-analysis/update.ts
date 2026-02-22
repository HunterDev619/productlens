import type { UpdateLcaAnalysisDTO } from '@/schemas/admin/lca-analysis';
import type { BaseResponse } from '@/services/base';
import type { LCAAnalysis } from '@/services/types';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminUpdateLcaAnalysisBody = UpdateLcaAnalysisDTO;

export type AdminUpdateLcaAnalysisResponse = BaseResponse<LCAAnalysis>;

export const adminUpdateLcaAnalysisFn = async (id: string, body: AdminUpdateLcaAnalysisBody): Promise<AdminUpdateLcaAnalysisResponse> => {
  const response = await axios.patch<AdminUpdateLcaAnalysisResponse>(API_ENDPOINTS.ADMIN.LCA_ANALYSIS.UPDATE.replace('{id}', id), body);
  return response.data;
};

export const useAdminUpdateLcaAnalysisMutation = (id: string) => {
  const {
    error,
    isPending,
    mutateAsync: adminUpdateLcaAnalysis,
  } = useMutation({
    mutationFn: (body: AdminUpdateLcaAnalysisBody) => adminUpdateLcaAnalysisFn(id, body),
  });

  return {
    error,
    loading: isPending,
    mutateAsync: adminUpdateLcaAnalysis,
  };
};
