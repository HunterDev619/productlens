import type { BaseResponse } from '@/services/base';
import type { Category } from '@/services/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';

export type UpdateCategoryPayload = {
  title?: string;
  icon?: string;
  color?: string;
};

export type UpdateCategoryResponse = BaseResponse<{
  category: Category;
}>;

const updateCategoryFn = async (categoryId: string, payload: UpdateCategoryPayload): Promise<UpdateCategoryResponse> => {
  const response = await axios.patch<UpdateCategoryResponse>(
    API_ENDPOINTS.ADMIN.CATEGORIES.UPDATE.replace('{id}', categoryId),
    payload,
  );
  return response.data;
};

export const useAdminUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: string; payload: UpdateCategoryPayload }) =>
      updateCategoryFn(categoryId, payload),
    onSuccess: (data) => {
      if (data.error === '00') {
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['admin-categories-list'] });
        queryClient.invalidateQueries({ queryKey: ['admin-categories-detail'] });
      } else {
        throw new Error(data.message || 'Failed to update category');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to update category',
        variant: 'error',
      });
    },
  });
};
