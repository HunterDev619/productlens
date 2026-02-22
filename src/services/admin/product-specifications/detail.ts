import type { ProductSpecification } from './list';
import type { BaseResponse } from '@/services/base';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminProductSpecificationDetailResponse = BaseResponse<ProductSpecification>;

export const getAdminProductSpecificationDetail = async (id: string): Promise<AdminProductSpecificationDetailResponse> => {
  const response = await axios.get<AdminProductSpecificationDetailResponse>(API_ENDPOINTS.ADMIN.PRODUCT_SPECIFICATIONS.DETAIL.replace('{id}', id));
  return response.data;
};

export const useAdminGetProductSpecificationDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin-product-specification-detail', id],
    queryFn: () => getAdminProductSpecificationDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};
