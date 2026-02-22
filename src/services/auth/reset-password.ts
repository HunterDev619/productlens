import type { ApiError, ApiResponse } from '../types';
import type { ConfirmResetPasswordBody, ResetPasswordBody } from '@/schemas/auth';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import { axios } from '@/libs/axios';

export const resetPassword = async (body: ConfirmResetPasswordBody) => {
  const response = await axios.post<ApiResponse<{ message: string }>>(
    API_ENDPOINTS.AUTH.CONFIRM_RESET_PASSWORD,
    body,
  );
  return response.data;
};

export const authenticatedResetPassword = async (body: ResetPasswordBody) => {
  const response = await axios.post<ApiResponse<{ message: string }>>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    body,
  );
  return response.data;
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        title: 'Password reset successfully',
        description: 'Your password has been reset successfully',
        variant: 'success',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'error',
      });
      throw new Error(error.message || 'Failed to reset password');
    },
  });
};

export const useAuthenticatedResetPassword = () => {
  return useMutation({
    mutationFn: authenticatedResetPassword,
    onSuccess: () => {
      toast({
        title: 'Password updated successfully',
        description: 'Your password has been updated successfully',
        variant: 'success',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'error',
      });
      throw new Error(error.message || 'Failed to update password');
    },
  });
};
