import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';
import { useQuery } from '@tanstack/react-query';
import type { BaseResponse } from '../base';
import type { Analysis } from '../types';

export type AnalysisV2FindProductSpecificationsIdResponse = BaseResponse<Analysis>;

export const getAnalysisV2FindProductSpecificationsId = async (id: string): Promise<AnalysisV2FindProductSpecificationsIdResponse> => {
  const response = await axios.get(API_ENDPOINTS.ANALYSIS_V2.FIND_BY_PRODUCT_SPECIFICATION_ID.replace('{productSpecificationId}', id));
  return response.data;
};

export const useGetAnalysisV2FindProductSpecificationsId = (id: string) => {
  return useQuery({
    queryKey: ['analysis-v2-find-product-specifications-id', id],
    queryFn: () => getAnalysisV2FindProductSpecificationsId(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};
