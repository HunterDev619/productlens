import type { BaseResponse } from '../base';
import type { MaterialComposition } from '../types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type MaterialCompositionDetailResponse = BaseResponse<MaterialComposition>;

export const getMaterialCompositionDetail = async (id: string): Promise<MaterialCompositionDetailResponse> => {
  const response = await axios.get(API_ENDPOINTS.MATERIAL_COMPOSITIONS.DETAIL.replace('{id}', id));
  return response.data;
};

export const useGetMaterialCompositionDetail = (id: string) => {
  return useQuery({
    queryKey: ['material-composition-detail', id],
    queryFn: () => getMaterialCompositionDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    enabled: !!id,
  });
};
