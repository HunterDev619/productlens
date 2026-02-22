import type {
  ApiResponse,
  ForgotPasswordRequest,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  RegisterCredentials,
  RegisterResponse,
  ResetPasswordRequest,
  AuthenticatedResetPasswordRequest,
} from '@services/types';
import { API_ENDPOINTS } from '@constants/api';
import { axios } from '@/libs/axios';

/**
 * Authentication API functions
 * These are the raw API calls without React Query wrapper
 */

export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await axios.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
      );
      return response.data;
    } catch (error: any) {
      // If it's an API error response, return the structured error
      if (error.response?.data) {
        return error.response.data;
      }
      // Otherwise, throw the original error
      throw error;
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refresh: async (refreshToken: string): Promise<ApiResponse<RefreshResponse>> => {
    try {
      const response = await axios.post<ApiResponse<RefreshResponse>>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken },
      );
      return response.data;
    } catch (error: any) {
      // If it's an API error response, return the structured error
      if (error.response?.data) {
        return error.response.data;
      }
      // Return a structured error for network failures
      return {
        error: '01',
        message: error.message || 'Failed to refresh token',
        data: {} as any,
      };
    }
  },

  /**
   * Register new user account
   */
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<RegisterResponse>> => {
    try {
      const response = await axios.post<ApiResponse<RegisterResponse>>(
        API_ENDPOINTS.AUTH.REGISTER,
        credentials,
      );
      return response.data;
    } catch (error: any) {
      // If it's an API error response, return the structured error
      if (error.response?.data) {
        return error.response.data;
      }
      // Otherwise, throw the original error
      throw error;
    }
  },

  /**
   * Request password reset email via API endpoint
   */
  forgotPassword: async (request: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    try {
      const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'https://productlens.ai';
      
      const response = await axios.post<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        {
          email: request.email,
          redirect_url: `${baseUrl}/auth/reset-password`,
        },
      );
      return response.data;
    } catch (error: any) {
      // If it's an API error response, return the structured error
      if (error.response?.data) {
        return error.response.data;
      }
      // Otherwise, return a generic error
      return {
        error: '01',
        message: error.message || 'Failed to send password reset email',
        data: { message: error.message || 'Failed to send password reset email' },
      };
    }
  },

  /**
   * Reset password using token (confirm-reset-password)
   */
  resetPassword: async (request: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await axios.post<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.AUTH.CONFIRM_RESET_PASSWORD,
        request,
      );
      return response.data;
    } catch (error: any) {
      // If it's an API error response, return the structured error
      if (error.response?.data) {
        return error.response.data;
      }
      // Otherwise, return a generic error
      return {
        error: '01',
        message: error.message || 'Failed to reset password',
        data: { message: error.message || 'Failed to reset password' },
      };
    }
  },

  /**
   * Reset password for authenticated users (requires old password)
   */
  authenticatedResetPassword: async (request: AuthenticatedResetPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await axios.post<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        request,
      );
      return response.data;
    } catch (error: any) {
      // If it's an API error response, return the structured error
      if (error.response?.data) {
        return error.response.data;
      }
      // Otherwise, return a generic error
      return {
        error: '01',
        message: error.message || 'Failed to update password',
        data: { message: error.message || 'Failed to update password' },
      };
    }
  },

  /**
   * Logout user (if backend requires logout call)
   */
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await axios.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.LOGOUT,
    );
    return response.data;
  },
};
