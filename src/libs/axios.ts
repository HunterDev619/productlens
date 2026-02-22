import type { ApiResponse, RefreshResponse } from '@services/types';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, REQUEST_TIMEOUT } from '@constants/api';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from '@/hooks/use-toast';
import { tokenStorage } from './cookies';

// Re-export tokenStorage for backward compatibility
export { tokenStorage } from './cookies';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh state management
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Redirect to login page (debounced to prevent multiple redirects)
 */
let isRedirecting = false;
const redirectToLogin = () => {
  if (isRedirecting) return;
  isRedirecting = true;
  
  tokenStorage.clearTokens();
  
  if (typeof window !== 'undefined') {
    // Add session expired message to URL
    const currentPath = window.location.pathname;
    // Don't redirect if already on login page
    if (!currentPath.includes('/auth/login')) {
      window.location.href = '/auth/login?error=session_expired';
    }
  }
  
  // Reset after a delay to allow for page navigation
  setTimeout(() => {
    isRedirecting = false;
  }, 3000);
};

/**
 * Proactively refresh the access token
 * Returns the new token or null if refresh failed
 */
const refreshAccessToken = async (): Promise<string | null> => {
  // Get refresh token - use raw getter to avoid expiry check since we need the token for the refresh call
  const refreshToken = Cookies.get('refresh_token');
  
  if (!refreshToken) {
    console.warn('[Axios] No refresh token available in cookies');
    return null;
  }

  try {
    console.log('[Axios] Attempting to refresh access token...');
    console.log('[Axios] Calling refresh endpoint:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`);
    
    const response = await axios.post<ApiResponse<RefreshResponse>>(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      { refresh_token: refreshToken },
      { 
        timeout: REQUEST_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('[Axios] Refresh response:', response.data.error, response.data.message);

    if (response.data.error === '00' && response.data.data?.access_token) {
      const { access_token, expires_in, refresh_token: newRefreshToken, refresh_expires_in } = response.data.data;
      
      console.log('[Axios] Received new tokens, expires_in:', expires_in, 'refresh_expires_in:', refresh_expires_in);
      
      // Store new tokens (backend always returns both)
      tokenStorage.setToken(access_token, expires_in);
      tokenStorage.setRefreshToken(newRefreshToken, refresh_expires_in);
      
      console.log('[Axios] Token refreshed successfully and stored');
      return access_token;
    }
    
    console.error('[Axios] Token refresh failed - invalid response:', response.data.message);
    return null;
  } catch (error: any) {
    console.error('[Axios] Token refresh error:', error.message || error);
    if (error.response) {
      console.error('[Axios] Refresh error response:', error.response.status, error.response.data);
    }
    return null;
  }
};

/**
 * Ensures we have a valid token before making a request
 * Handles proactive refresh and request queuing
 */
const ensureValidToken = async (): Promise<string | null> => {
  const currentToken = tokenStorage.getToken();
  
  // If token exists and isn't expiring soon, use it
  if (currentToken && !tokenStorage.shouldRefreshToken()) {
    console.log('[Axios] Using existing valid token');
    return currentToken;
  }

  // Token is expired or expiring soon - need to refresh
  console.log('[Axios] Token expired or expiring soon, attempting refresh...');

  // Check if refresh token is available (not expired)
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    console.warn('[Axios] No valid refresh token available for refresh');
    return null;
  }

  // If already refreshing, wait for the existing refresh to complete
  if (isRefreshing && refreshPromise) {
    console.log('[Axios] Refresh already in progress, waiting...');
    try {
      return await refreshPromise;
    } catch {
      return null;
    }
  }

  // Start refresh process
  console.log('[Axios] Starting token refresh process');
  isRefreshing = true;
  refreshPromise = refreshAccessToken()
    .then((token) => {
      processQueue(null, token);
      return token;
    })
    .catch((error) => {
      processQueue(error, null);
      return null;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

// Request interceptor - proactively refresh token before requests
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token handling for public auth endpoints only
    // Note: /auth/reset-password requires Bearer token (authenticated user changing password)
    const isPublicAuthEndpoint = config.url?.includes('/auth/login') 
      || config.url?.includes('/auth/register')
      || config.url?.includes('/auth/refresh')
      || config.url?.includes('/auth/forgot-password')
      || config.url?.includes('/auth/confirm-reset-password');
    
    if (isPublicAuthEndpoint) {
      return config;
    }

    console.log(`[Axios] Request to ${config.url} - checking authentication...`);

    // Check if refresh token exists and is not expired
    const refreshToken = tokenStorage.getRefreshToken();
    const isRefreshExpired = tokenStorage.isRefreshTokenExpired();
    
    console.log(`[Axios] Refresh token exists: ${!!refreshToken}, expired: ${isRefreshExpired}`);
    
    if (!refreshToken || isRefreshExpired) {
      // Refresh token is missing or expired, redirect to login
      console.warn('[Axios] No valid refresh token, redirecting to login');
      redirectToLogin();
      // Cancel this request
      const controller = new AbortController();
      controller.abort();
      config.signal = controller.signal;
      return config;
    }

    // Get valid token (proactively refreshes if needed)
    const token = await ensureValidToken();
    
    if (token) {
      console.log('[Axios] Got valid token, proceeding with request');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Token refresh failed even though refresh token exists
      console.error('[Axios] Token refresh failed, redirecting to login');
      redirectToLogin();
      // Cancel this request
      const controller = new AbortController();
      controller.abort();
      config.signal = controller.signal;
    }
    
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    const axiosError = error as any;
    const originalRequest = axiosError.config;
    const status = axiosError.response?.status;

    // Handle aborted requests silently
    if (axiosError.code === 'ERR_CANCELED' || axiosError.name === 'CanceledError') {
      return Promise.reject(error);
    }

    // Handle network errors / CORS issues (status is null or undefined)
    if (!status && axiosError.message === 'Network Error') {
      // This could be a CORS error due to invalid token
      // Check if we have valid tokens
      const token = tokenStorage.getToken();
      const refreshToken = tokenStorage.getRefreshToken();
      
      if (!token && !refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }
      
      // Try to refresh and retry once
      if (!originalRequest._networkRetry && refreshToken) {
        originalRequest._networkRetry = true;
        
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      }
      
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to server. Please check your connection.',
        variant: 'error',
      });
      return Promise.reject(error);
    }

    // Skip handling for auth endpoints
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Handle 400 Bad Request - could be invalid token format
    if (status === 400 && !originalRequest._retry400) {
      originalRequest._retry400 = true;
      
      // Try refreshing token and retrying
      const newToken = await ensureValidToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }

    // Handle 401 Unauthorized - token might have been invalidated server-side
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing && refreshPromise) {
        return refreshPromise
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            }
            throw new Error('Token refresh failed');
          })
          .catch(() => {
            redirectToLogin();
            return Promise.reject(error);
          });
      }

      // Attempt to refresh
      isRefreshing = true;
      
      try {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
        
        // Refresh failed - clear tokens and redirect
        processQueue(new Error('Token refresh failed'), null);
        redirectToLogin();
        
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError, null);
        redirectToLogin();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Handle 403 Forbidden - token valid but no permission
    if (status === 403) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
        variant: 'error',
      });
      return Promise.reject(error);
    }

    // Show error toast for other errors (not auth-related)
    if (status && status !== 401) {
      toast({
        title: 'Request Failed',
        description: axiosError.response?.data?.message || 'An error occurred. Please try again.',
        variant: 'error',
      });
    }
    
    return Promise.reject(error);
  },
);

export default axiosInstance;
export { axiosInstance as axios };
