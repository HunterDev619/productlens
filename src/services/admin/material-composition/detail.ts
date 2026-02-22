import type { BaseResponse } from '@/services/base';
import type { MaterialComposition } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminMaterialCompositionDetailResponse = BaseResponse<MaterialComposition>;

export const getAdminMaterialCompositionDetail = async (id: string): Promise<AdminMaterialCompositionDetailResponse> => {
  const response = await axios.get<AdminMaterialCompositionDetailResponse>(API_ENDPOINTS.ADMIN.MATERIAL_COMPOSITIONS.DETAIL.replace('{id}', id));
  return response.data;
};

export const useAdminGetMaterialCompositionDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin-material-composition-detail', id],
    queryFn: () => getAdminMaterialCompositionDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    enabled: !!id,
  });
};
