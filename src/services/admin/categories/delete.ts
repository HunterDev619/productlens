import type { BaseResponse } from '@/services/base';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';

export type DeleteCategoryResponse = BaseResponse<{ success: boolean }>;

const deleteCategoryFn = async (categoryId: string): Promise<DeleteCategoryResponse> => {
  const response = await axios.delete<DeleteCategoryResponse>(
    API_ENDPOINTS.ADMIN.CATEGORIES.DELETE.replace('{id}', categoryId),
  );
  return response.data;
};

export const useAdminDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryFn,
    onSuccess: (data) => {
      if (data.error === '00') {
        toast({
          title: 'Success',
          description: 'Category deleted successfully',
          variant: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['admin-categories-list'] });
      } else {
        throw new Error(data.message || 'Failed to delete category');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to delete category',
        variant: 'error',
      });
    },
  });
};
