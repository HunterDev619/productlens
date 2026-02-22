import type { Metadata } from 'next';
import UsersPageContent from './page-content';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Users',
};

export default function UsersPage() {
  return (
    <div>
      <UsersPageContent />
    </div>
  );
}
