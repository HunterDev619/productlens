import type { BaseResponse } from '@/services/base';
import type { Reference } from '@/services/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';

export type UpdateReferencePayload = {
  categoryId?: string;
  name?: string;
  description?: string;
  url?: string | null;
  access?: string;
  isPublic?: boolean;
};

export type UpdateReferenceResponse = BaseResponse<{
  reference: Reference;
}>;

const updateReferenceFn = async (referenceId: string, payload: UpdateReferencePayload): Promise<UpdateReferenceResponse> => {
  const response = await axios.patch<UpdateReferenceResponse>(
    API_ENDPOINTS.ADMIN.REFERENCES.UPDATE.replace('{id}', referenceId),
    payload,
  );
  return response.data;
};

export const useAdminUpdateReference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ referenceId, payload }: { referenceId: string; payload: UpdateReferencePayload }) =>
      updateReferenceFn(referenceId, payload),
    onSuccess: (data) => {
      if (data.error === '00') {
        toast({
          title: 'Success',
          description: 'Reference updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['admin-references-list'] });
        queryClient.invalidateQueries({ queryKey: ['admin-references-detail'] });
      } else {
        throw new Error(data.message || 'Failed to update reference');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to update reference',
        variant: 'error',
      });
    },
  });
};
