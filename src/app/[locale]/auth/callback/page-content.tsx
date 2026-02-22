'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tokenStorage } from '@/libs/cookies';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract tokens from URL hash (Supabase sends tokens in hash fragment)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    const tokenType = params.get('token_type');

    // Get redirect path from query params or default to /apps/analysis
    // Ensure locale is included in the path
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    // Check if first part is a valid locale (en, fr) or if it's 'auth' (meaning no locale in path)
    const locale = pathParts[0] === 'auth' ? 'en' : (pathParts[0] || 'en');
    const next = searchParams.get('next') || `/${locale}/apps/analysis`;

    if (accessToken && tokenType === 'bearer') {
      // Store tokens in cookies
      const expiresInSeconds = expiresIn ? Number.parseInt(expiresIn, 10) : 3600;
      tokenStorage.setToken(accessToken, expiresInSeconds);

      if (refreshToken) {
        // Refresh tokens typically last longer (e.g., 7 days)
        tokenStorage.setRefreshToken(refreshToken);
      }

      // Clear the hash from URL for security
      window.history.replaceState(null, '', window.location.pathname + window.location.search);

      // Redirect to the intended page
      router.push(next);
    } else {
      // No tokens found, show error
      setError('Authentication failed. No valid tokens received.');
      setTimeout(() => {
        router.push('/auth/login?error=authentication_failed');
      }, 3000);
    }
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-600">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">{error}</h2>
          <p className="text-slate-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-emerald-600" />
        <h2 className="mb-2 text-xl font-semibold text-slate-900">Completing authentication...</h2>
        <p className="text-slate-500">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
