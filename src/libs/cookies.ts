import Cookies from 'js-cookie';

// Token storage utilities for client-side
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const REFRESH_TOKEN_EXPIRY_KEY = 'refresh_token_expiry';

// Cookie options for security
const cookieOptions = {
  secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
  sameSite: 'strict' as const, // CSRF protection
  path: '/', // Available across the entire site
};

// Buffer time before token expiry to trigger proactive refresh (2 minutes)
const TOKEN_EXPIRY_BUFFER_MS = 2 * 60 * 1000;

export const tokenStorage = {
  /**
   * Get access token from client-side cookies
   * Returns null if token doesn't exist or is expired
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      return null;
    }
    
    // Check if token is expired (without buffer - for actual requests)
    const expiryStr = Cookies.get(TOKEN_EXPIRY_KEY);
    if (expiryStr) {
      const expiryTime = Number.parseInt(expiryStr, 10);
      if (Date.now() >= expiryTime) {
        // Token is actually expired, return null to trigger refresh
        return null;
      }
    }
    
    return token;
  },

  /**
   * Get access token without expiry check (for refresh flow)
   */
  getTokenRaw: (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return Cookies.get(TOKEN_KEY) || null;
  },

  /**
   * Set access token in client-side cookies with expiration from API
   */
  setToken: (token: string, expiresIn?: number): void => {
    if (typeof window !== 'undefined') {
      const expirationSeconds = expiresIn || 15 * 60; // Default 15 minutes
      const expiryTime = Date.now() + expirationSeconds * 1000;
      
      Cookies.set(TOKEN_KEY, token, {
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
        expires: new Date(expiryTime),
      });
      
      // Store expiry time for checking
      Cookies.set(TOKEN_EXPIRY_KEY, expiryTime.toString(), {
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
        expires: new Date(expiryTime),
      });
    }
  },

  /**
   * Get refresh token from client-side cookies
   */
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    const token = Cookies.get(REFRESH_TOKEN_KEY);
    if (!token) {
      return null;
    }
    
    // Check if refresh token is expired
    const expiryStr = Cookies.get(REFRESH_TOKEN_EXPIRY_KEY);
    if (expiryStr) {
      const expiryTime = Number.parseInt(expiryStr, 10);
      if (Date.now() >= expiryTime) {
        return null;
      }
    }
    
    return token;
  },

  /**
   * Set refresh token in client-side cookies with expiration from API
   */
  setRefreshToken: (token: string, expiresIn?: number): void => {
    if (typeof window !== 'undefined') {
      const expirationSeconds = expiresIn || 7 * 24 * 60 * 60; // Default 7 days
      const expiryTime = Date.now() + expirationSeconds * 1000;
      
      Cookies.set(REFRESH_TOKEN_KEY, token, {
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
        expires: new Date(expiryTime),
      });
      
      // Store expiry time for checking
      Cookies.set(REFRESH_TOKEN_EXPIRY_KEY, expiryTime.toString(), {
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
        expires: new Date(expiryTime),
      });
    }
  },

  /**
   * Check if access token needs refresh (expired or expiring soon)
   * Uses buffer time to proactively refresh before actual expiry
   */
  shouldRefreshToken: (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const expiryStr = Cookies.get(TOKEN_EXPIRY_KEY);
    if (!expiryStr) {
      return true;
    }
    
    const expiryTime = Number.parseInt(expiryStr, 10);
    
    return Date.now() >= (expiryTime - TOKEN_EXPIRY_BUFFER_MS);
  },

  /**
   * Check if access token is expired or will expire soon (within buffer time)
   * @deprecated Use shouldRefreshToken() instead
   */
  isTokenExpired: (): boolean => {
    if (typeof window === 'undefined') {
      return true;
    }
    
    const expiryStr = Cookies.get(TOKEN_EXPIRY_KEY);
    if (!expiryStr) {
      return true;
    }
    
    const expiryTime = Number.parseInt(expiryStr, 10);
    
    return Date.now() >= (expiryTime - TOKEN_EXPIRY_BUFFER_MS);
  },

  /**
   * Check if refresh token is expired
   */
  isRefreshTokenExpired: (): boolean => {
    if (typeof window === 'undefined') {
      return true;
    }
    
    const expiryStr = Cookies.get(REFRESH_TOKEN_EXPIRY_KEY);
    if (!expiryStr) {
      return true;
    }
    
    const expiryTime = Number.parseInt(expiryStr, 10);
    
    return Date.now() >= expiryTime;
  },

  /**
   * Get time until token expires in milliseconds
   */
  getTokenTimeRemaining: (): number => {
    if (typeof window === 'undefined') {
      return 0;
    }
    
    const expiryStr = Cookies.get(TOKEN_EXPIRY_KEY);
    if (!expiryStr) {
      return 0;
    }
    
    const expiryTime = Number.parseInt(expiryStr, 10);
    const remaining = expiryTime - Date.now();
    
    return Math.max(0, remaining);
  },

  /**
   * Clear all tokens from client-side cookies
   */
  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      Cookies.remove(TOKEN_KEY, { path: '/' });
      Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
      Cookies.remove(TOKEN_EXPIRY_KEY, { path: '/' });
      Cookies.remove(REFRESH_TOKEN_EXPIRY_KEY, { path: '/' });
    }
  },
};
