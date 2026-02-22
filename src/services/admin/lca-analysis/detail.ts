import type { BaseResponse } from '@/services/base';
import type { LCAAnalysis } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminLcaAnalysisDetailResponse = BaseResponse<LCAAnalysis>;

export const getAdminLcaAnalysisDetail = async (id: string): Promise<AdminLcaAnalysisDetailResponse> => {
  const response = await axios.get<AdminLcaAnalysisDetailResponse>(API_ENDPOINTS.ADMIN.LCA_ANALYSIS.DETAIL.replace('{id}', id));
  return response.data;
};

export const useAdminGetLcaAnalysisDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin-lca-analysis-detail', id],
    queryFn: () => getAdminLcaAnalysisDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};
