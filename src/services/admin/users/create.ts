import type { BaseResponse } from '@/services/base';
import type { User } from '@/services/types';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import axios from '@/libs/axios';
import { queryClient } from '@/libs/query-client';

export type CreateUserPayload = {
  email: string;
  password: string;
  fullname: string;
  picture?: string;
  userAddress?: string;
  locale?: string;
  provider?: string;
  status?: number;
  twoFactorEnabled?: boolean;
  email_confirm?: boolean;
  role?: string;
};

export type CreateUserResponse = BaseResponse<{
  user: User;
}>;

export const createUserFn = async (payload: CreateUserPayload): Promise<CreateUserResponse> => {
  const response = await axios.post<CreateUserResponse>(API_ENDPOINTS.ADMIN.USERS.CREATE, payload);
  return response.data;
};

export const useAdminCreateUser = () => {
  const {
    mutateAsync: createUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: createUserFn,
    onSuccess: () => {
      toast({
        title: 'User created successfully',
        description: 'The user has been created successfully',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to create user',
        variant: 'error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
  });
  return {
    createUser,
    isPending,
    error,
  };
};
