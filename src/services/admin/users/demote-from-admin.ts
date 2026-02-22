import type { BaseResponse } from '@/services/base';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';
import { queryClient } from '@/libs/query-client';

export type DemoteUserFromAdminReponse = BaseResponse<{
  success: boolean;
}>;

export const demoteUserFromAdminFn = async (userId: string): Promise<DemoteUserFromAdminReponse> => {
  const response = await axios.post<DemoteUserFromAdminReponse>(API_ENDPOINTS.ADMIN.USERS.DEMOTE_FROM_ADMIN.replace('{id}', userId));
  return response.data;
};

export const useDemoteUserFromAdmin = () => {
  const {
    mutateAsync: demoteUserFromAdmin,
    isPending,
    error,
  } = useMutation({
    mutationFn: demoteUserFromAdminFn,
    onSuccess: () => {
      toast({
        title: 'User demoted from admin successfully',
        description: 'The user has been demoted from admin successfully',
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
    demoteUserFromAdmin,
    isPending,
    error,
  };
};
