import type { Metadata } from 'next';
import ReferencesPageContent from './page-content';

export const metadata: Metadata = {
  title: 'References',
  description: 'References',
};

export default function ReferencesPage() {
  return (
    <ReferencesPageContent />
  );
}
