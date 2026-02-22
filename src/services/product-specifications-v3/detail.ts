import type { BaseResponse } from '../base';
import type { ProductSpecification } from '../types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type ProductSpecificationV3DetailResponse = BaseResponse<ProductSpecification>;

export const getProductSpecificationV3Detail = async (id: string): Promise<ProductSpecificationV3DetailResponse> => {
  const response = await axios.get<ProductSpecificationV3DetailResponse>(API_ENDPOINTS.PRODUCT_SPECIFICATIONS_V3.DETAIL.replace('{id}', id));
  return response.data;
};

export const useGetProductSpecificationV3Detail = (id: string) => {
  return useQuery({
    queryKey: ['product-specification-v3-detail', id],
    queryFn: () => getProductSpecificationV3Detail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
};
