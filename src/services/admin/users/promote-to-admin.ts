import type { BaseResponse } from '@/services/base';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';
import { queryClient } from '@/libs/query-client';

export type PromoteUserToAdminReponse = BaseResponse<{
  success: boolean;
}>;

export const promoteUserToAdminFn = async (userId: string): Promise<PromoteUserToAdminReponse> => {
  const response = await axios.post<PromoteUserToAdminReponse>(API_ENDPOINTS.ADMIN.USERS.PROMOTE_TO_ADMIN.replace('{id}', userId));
  return response.data;
};

export const usePromoteUserToAdmin = () => {
  const {
    mutateAsync: promoteUserToAdmin,
    isPending,
    error,
  } = useMutation({
    mutationFn: promoteUserToAdminFn,
    onSuccess: () => {
      toast({
        title: 'User promoted to admin successfully',
        description: 'The user has been promoted to admin successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
  });
  return {
    promoteUserToAdmin,
    isPending,
    error,
  };
};
