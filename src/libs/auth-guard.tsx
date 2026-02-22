'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { authApi } from '@/services/auth';
import { tokenStorage } from './cookies';

type AuthGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Client-side authentication guard component
 * Redirects to login if user is not authenticated
 * Proactively refreshes tokens before they expire
 */
export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef<boolean>(false);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const currentRefreshToken = tokenStorage.getRefreshToken();
    
    if (!currentRefreshToken || tokenStorage.isRefreshTokenExpired()) {
      return false;
    }

    if (isRefreshingRef.current) {
      return false;
    }

    isRefreshingRef.current = true;

    try {
      console.log('[AuthGuard] Refreshing access token...');
      const response = await authApi.refresh(currentRefreshToken);
      
      if (response.error === '00' && response.data?.access_token) {
        const { access_token, refresh_token: newRefreshToken, expires_in, refresh_expires_in } = response.data;
        
        tokenStorage.setToken(access_token, expires_in);
        tokenStorage.setRefreshToken(newRefreshToken, refresh_expires_in);
        
        console.log('[AuthGuard] Token refreshed successfully');
        return true;
      }
      
      console.error('[AuthGuard] Token refresh failed:', response.message);
      return false;
    } catch (error) {
      console.error('[AuthGuard] Token refresh error:', error);
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const timeRemaining = tokenStorage.getTokenTimeRemaining();
    const refreshBuffer = 2 * 60 * 1000;
    const refreshIn = Math.max(0, timeRemaining - refreshBuffer);

    if (refreshIn > 0) {
      refreshTimeoutRef.current = setTimeout(() => {
        checkAuth();
      }, refreshIn);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = useCallback(async () => {
    const token = tokenStorage.getToken();
    const currentRefreshToken = tokenStorage.getRefreshToken();
    
    if (!token && !currentRefreshToken) {
      setIsAuthenticated(false);
      router.push('/auth/login');
      return;
    }

    if (token) {
      setIsAuthenticated(true);
      scheduleTokenRefresh();
      return;
    }
    
    if (currentRefreshToken && !tokenStorage.isRefreshTokenExpired()) {
      console.log('[AuthGuard] Access token expired, attempting refresh...');
      
      const refreshSuccess = await refreshToken();
      
      if (refreshSuccess) {
        setIsAuthenticated(true);
        scheduleTokenRefresh();
        return;
      }
      
      console.error('[AuthGuard] Token refresh failed, logging out user');
      tokenStorage.clearTokens();
      setIsAuthenticated(false);
      
      toast({
        title: 'Session Expired',
        description: 'Your session has expired. Please log in again.',
        variant: 'error',
      });
      
      router.push('/auth/login?error=session_expired');
      return;
    }
    
    console.log('[AuthGuard] All tokens expired, logging out user');
    tokenStorage.clearTokens();
    setIsAuthenticated(false);
    
    toast({
      title: 'Session Expired',
      description: 'Your session has expired. Please log in again.',
      variant: 'error',
    });
    
    router.push('/auth/login?error=session_expired');
  }, [router, scheduleTokenRefresh, refreshToken]);

  useEffect(() => {
    checkAuth();
    
    const interval = setInterval(checkAuth, 30 * 1000);
    
    const handleFocus = () => {
      checkAuth();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [checkAuth]);

  if (isAuthenticated === null) {
    return fallback || null;
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
};
