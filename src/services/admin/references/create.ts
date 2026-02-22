import type { BaseResponse } from '@/services/base';
import type { Reference } from '@/services/types';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';
import { queryClient } from '@/libs/query-client';

export type CreateReferencePayload = {
  categoryId: string;
  name: string;
  description?: string;
  url?: string | null;
  access?: string;
  isPublic?: boolean;
};

export type CreateReferenceResponse = BaseResponse<{
  reference: Reference;
}>;

export const createReferenceFn = async (payload: CreateReferencePayload): Promise<CreateReferenceResponse> => {
  const response = await axios.post<CreateReferenceResponse>(API_ENDPOINTS.ADMIN.REFERENCES.CREATE, payload);
  return response.data;
};

export const useAdminCreateReference = () => {
  const {
    mutateAsync: createReference,
    isPending,
    error,
  } = useMutation({
    mutationFn: createReferenceFn,
    onSuccess: () => {
      toast({
        title: 'Reference created successfully',
        description: 'The reference has been created successfully',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to create reference',
        variant: 'error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-references-list'] });
    },
  });
  return {
    createReference,
    isPending,
    error,
  };
};
