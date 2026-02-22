import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthCallbackContent from './page-content';

export const metadata: Metadata = {
  title: 'Authenticating...',
};

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
