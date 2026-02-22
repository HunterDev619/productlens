import type { BaseResponse } from '../base';
import type { LCAAnalysis } from '../types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type LcaAnalysisDetailResponse = BaseResponse<LCAAnalysis>;

export const getLcaAnalysisDetail = async (id: string): Promise<LcaAnalysisDetailResponse> => {
  const response = await axios.get<LcaAnalysisDetailResponse>(API_ENDPOINTS.LCA_ANALYSIS.DETAIL.replace('{id}', id));
  return response.data;
};

export const useGetLcaAnalysisDetail = (id: string) => {
  return useQuery({
    queryKey: ['lca-analysis-detail', id],
    queryFn: () => getLcaAnalysisDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    enabled: !!id,
  });
};
