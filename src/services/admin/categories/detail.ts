import type { BaseResponse } from '@/services/base';
import type { Category } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import axios from '@/libs/axios';

export type AdminCategoryDetailResponse = BaseResponse<Category>;

export const getCategoryDetail = async (id: string): Promise<AdminCategoryDetailResponse> => {
  const response = await axios.get<AdminCategoryDetailResponse>(API_ENDPOINTS.ADMIN.CATEGORIES.DETAIL.replace('{id}', id));
  return response.data;
};

export const useGetCategory = (id: string) => {
  return useQuery({
    queryKey: ['admin-categories-detail', id],
    queryFn: () => getCategoryDetail(id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    enabled: !!id,
  });
};
