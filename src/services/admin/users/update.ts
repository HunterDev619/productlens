import type { BaseResponse } from '@/services/base';
import type { User } from '@/services/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';

export type AdminUpdateUserPayload = {
  fullname?: string;
  locale?: string;
  phone?: string;
  userAddress?: string;
  picture?: string;
};

export type AdminUpdateUserResponse = BaseResponse<{
  user: User;
}>;

const updateUserFn = async (userId: string, payload: AdminUpdateUserPayload): Promise<AdminUpdateUserResponse> => {
  const response = await axios.patch<AdminUpdateUserResponse>(
    API_ENDPOINTS.ADMIN.USERS.UPDATE.replace('{id}', userId),
    payload,
  );
  return response.data;
};

export const useAdminUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: AdminUpdateUserPayload }) =>
      updateUserFn(userId, payload),
    onSuccess: (data) => {
      if (data.error === '00') {
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      } else {
        throw new Error(data.message || 'Failed to update user');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update user',
        variant: 'error',
      });
    },
  });
};
