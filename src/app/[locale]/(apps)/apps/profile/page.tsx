import type { Metadata } from 'next';
import ProfilePageContent from './page-content';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile',
};

export default function ProfilePage() {
  return (
    <div className="relative h-screen w-full">
      <ProfilePageContent />
    </div>
  );
}
