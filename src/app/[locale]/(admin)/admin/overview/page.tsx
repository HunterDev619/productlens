import type { Metadata } from 'next';
import OverviewPageContent from './page-content';

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Overview',
};

export default function OverviewPage() {
  return (
    <div>
      <OverviewPageContent />
    </div>
  );
}
