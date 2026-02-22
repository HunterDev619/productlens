import type { BaseResponse } from '@/services/base';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';

export type DeleteReferenceResponse = BaseResponse<{ success: boolean }>;

const deleteReferenceFn = async (referenceId: string): Promise<DeleteReferenceResponse> => {
  const response = await axios.delete<DeleteReferenceResponse>(
    API_ENDPOINTS.ADMIN.REFERENCES.DELETE.replace('{id}', referenceId),
  );
  return response.data;
};

export const useAdminDeleteReference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReferenceFn,
    onSuccess: (data) => {
      if (data.error === '00') {
        toast({
          title: 'Success',
          description: 'Reference deleted successfully',
          variant: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['admin-references-list'] });
      } else {
        throw new Error(data.message || 'Failed to delete reference');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to delete reference',
        variant: 'error',
      });
    },
  });
};
