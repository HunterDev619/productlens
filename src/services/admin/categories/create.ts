import type { BaseResponse } from '@/services/base';
import type { Category } from '@/services/types';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';
import { queryClient } from '@/libs/query-client';

export type CreateCategoryPayload = {
  title: string;
  icon?: string;
  color?: string;
};

export type CreateCategoryResponse = BaseResponse<{
  category: Category;
}>;

export const createCategoryFn = async (payload: CreateCategoryPayload): Promise<CreateCategoryResponse> => {
  const response = await axios.post<CreateCategoryResponse>(API_ENDPOINTS.ADMIN.CATEGORIES.CREATE, payload);
  return response.data;
};

export const useAdminCreateCategory = () => {
  const {
    mutateAsync: createCategory,
    isPending,
    error,
  } = useMutation({
    mutationFn: createCategoryFn,
    onSuccess: () => {
      toast({
        title: 'Category created successfully',
        description: 'The category has been created successfully',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to create category',
        variant: 'error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories-list'] });
    },
  });
  return {
    createCategory,
    isPending,
    error,
  };
};
