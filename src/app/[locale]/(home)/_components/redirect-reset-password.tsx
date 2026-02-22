'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RecoverPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hash = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(hash);
    const params = Object.fromEntries(urlParams.entries());

    const requiredKeys = [
      'access_token',
      'expires_at',
      'expires_in',
      'refresh_token',
      'token_type',
      'type',
    ];

    const hasAllParams = requiredKeys.every(key => params[key]);

    if (hasAllParams) {
      const newHash = new URLSearchParams(params).toString();
      router.replace(`/auth/reset-password#${newHash}`);
    } else {
      // Optional: fallback nếu thiếu param
      router.replace('/');
    }
  }, [router]);

  // Không render gì cả
  return null;
}
