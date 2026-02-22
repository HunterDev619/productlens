import type { BaseResponse } from '../base';
import type { MaterialComponent } from '../types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type MaterialComponentsResponse = BaseResponse<MaterialComponent[]>;

const getMaterialComponentByMaterialCompositionId = async (id: string): Promise<MaterialComponentsResponse> => {
  const response = await axios.get<MaterialComponentsResponse>(API_ENDPOINTS.MATERIAL_COMPONENTS.FIND_BY_MATERIAL_COMPOSITION_ID.replace('{id}', id));
  return response.data;
};

export const useGetMaterialComponentByMaterialCompositionId = (id: string) => {
  return useQuery({
    queryKey: ['material-component-by-material-composition-id', id],
    queryFn: () => getMaterialComponentByMaterialCompositionId(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    select: data => data.data || [],
  });
};
