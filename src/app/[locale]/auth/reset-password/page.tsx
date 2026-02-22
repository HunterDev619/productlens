import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from './_components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
};

function ResetPasswordFormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl text-lg">
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          Reset Your Password
        </h1>
        <p className="text-lg text-muted-foreground">
          Verifying reset link...
        </p>
      </div>
      <div className="flex justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-b-4 border-b-blue-600"></div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<ResetPasswordFormSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
