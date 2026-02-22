import type { Metadata } from 'next';
import ResetPasswordPageContent from './page-content';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
};

export default function ResetPasswordPage() {
  return (
    <div>
      <ResetPasswordPageContent />
    </div>
  );
}
