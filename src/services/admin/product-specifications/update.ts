import type { ProductSpecification } from './list';
import type { UpdateProductSpecificationDTO } from '@/schemas/admin/product-specification';
import type { BaseResponse } from '@/services/base';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminUpdateProductSpecificationBody = UpdateProductSpecificationDTO;

export type AdminUpdateProductSpecificationResponse = BaseResponse<ProductSpecification>;

export const adminUpdateProductSpecificationFn = async (id: string, body: AdminUpdateProductSpecificationBody): Promise<AdminUpdateProductSpecificationResponse> => {
  const response = await axios.patch<AdminUpdateProductSpecificationResponse>(API_ENDPOINTS.ADMIN.PRODUCT_SPECIFICATIONS.UPDATE.replace('{id}', id), body);
  return response.data;
};

export const useAdminUpdateProductSpecificationMutation = (id: string) => {
  const {
    error,
    isPending,
    mutateAsync: adminUpdateProductSpecification,
  } = useMutation({
    mutationFn: (body: AdminUpdateProductSpecificationBody) => adminUpdateProductSpecificationFn(id, body),
  });

  return {
    error,
    loading: isPending,
    mutateAsync: adminUpdateProductSpecification,
  };
};
