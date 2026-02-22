import type { ApiError } from '@services/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/libs/cookies';
import { authApi } from './api';

/**
 * React Query hooks for authentication
 */

/**
 * Login mutation hook
 */
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Check if response has error code
      if (data.error !== '00' && data.error !== undefined) {
        // Throw error with the exact API message
        throw new Error(data.message || 'Login failed');
      }

      const { access_token, refresh_token, user, expires_in, refresh_expires_in } = data.data;

      // Store tokens in cookies with expiration times from API
      tokenStorage.setToken(access_token, expires_in);
      tokenStorage.setRefreshToken(refresh_token, refresh_expires_in);

      // Store user data in query cache
      queryClient.setQueryData(['user'], user);

      // Redirect to dashboard/apps
      router.push('/apps');
    },
    onError: (error: any) => {
      // Let the error propagate to the mutation state
      // Don't return anything here, let React Query handle the error
      console.error('Login error:', error);
    },
  });
};

/**
 * Register mutation hook
 */
export const useRegister = () => {
  // const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.error === '00') {
        const { access_token, refresh_token, user, expires_in, refresh_expires_in } = data.data;

        // Store tokens in cookies with expiration times from API
        tokenStorage.setToken(access_token, expires_in);
        tokenStorage.setRefreshToken(refresh_token, refresh_expires_in);

        // Store user data in query cache
        queryClient.setQueryData(['user'], user);

        // Redirect to dashboard/apps
        // router.push('/apps');
        // router.refresh();
      } else {
        // Throw error with the exact API message
        throw new Error(data.message || 'Registration failed');
      }
    },
    onError: (error: any) => {
      console.error('Registration error:', error);

      // If it's an axios error with response data, extract the message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    },
  });
};

/**
 * Forgot password mutation hook
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onError: (error: ApiError) => {
      console.error('Forgot password error:', error);
    },
  });
};

/**
 * Reset password mutation hook
 */
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      if (data.error === '00') {
        // Redirect to login page after successful password reset
        router.push('/auth/login?message=password-reset-success');
      } else {
        throw new Error(data.message || 'Password reset failed');
      }
    },
    onError: (error: ApiError) => {
      console.error('Reset password error:', error);
    },
  });
};

/**
 * Authenticated reset password mutation hook (for logged-in users changing password)
 */
export const useAuthenticatedResetPassword = () => {
  return useMutation({
    mutationFn: authApi.authenticatedResetPassword,
    onError: (error: ApiError) => {
      console.error('Authenticated reset password error:', error);
    },
  });
};

/**
 * Logout mutation hook
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear tokens
      tokenStorage.clearTokens();

      // Clear all cached data
      queryClient.clear();

      // Redirect to login
      router.push('/auth/login');
    },
    onError: (error: ApiError) => {
      console.error('Logout error:', error);

      // Even if logout API fails, clear local data
      tokenStorage.clearTokens();
      queryClient.clear();
      router.push('/auth/login');
    },
  });
};

/**
 * Custom function to check authentication status
 */
export const getAuth = () => {
  const token = tokenStorage.getToken();
  const isAuthenticated = !!token;

  return {
    isAuthenticated,
    token,
  };
};
