import type { BaseResponse } from '@/services/base';
import type { Category } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type CategoryDetailResponse = BaseResponse<Category>;

export const getCategoryDetail = async (id: string): Promise<CategoryDetailResponse> => {
  const response = await axios.get<CategoryDetailResponse>(API_ENDPOINTS.CATEGORIES.DETAIL.replace('{id}', id));
  return response.data;
};

export const useGetCategory = (id: string) => {
  return useQuery({
    queryKey: ['categories-detail', id],
    queryFn: () => getCategoryDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    enabled: !!id,
  });
};
