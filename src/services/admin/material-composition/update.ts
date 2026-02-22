import type { UpdateMaterialCompositionDTO } from '@/schemas/admin/material-composition';
import type { BaseResponse } from '@/services/base';
import type { MaterialComposition } from '@/services/types';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminUpdateMaterialCompositionBody = UpdateMaterialCompositionDTO;

export type AdminUpdateMaterialCompositionResponse = BaseResponse<MaterialComposition>;

export const adminUpdateMaterialCompositionFn = async (id: string, body: AdminUpdateMaterialCompositionBody): Promise<AdminUpdateMaterialCompositionResponse> => {
  const response = await axios.patch<AdminUpdateMaterialCompositionResponse>(API_ENDPOINTS.ADMIN.MATERIAL_COMPOSITIONS.UPDATE.replace('{id}', id), body);
  return response.data;
};

export const useAdminUpdateMaterialCompositionMutation = (id: string) => {
  const {
    error,
    isPending,
    mutateAsync: adminUpdateMaterialComposition,
  } = useMutation({
    mutationFn: (body: AdminUpdateMaterialCompositionBody) => adminUpdateMaterialCompositionFn(id, body),
  });

  return {
    error,
    loading: isPending,
    mutateAsync: adminUpdateMaterialComposition,
  };
};
