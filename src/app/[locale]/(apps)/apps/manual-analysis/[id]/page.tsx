import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';
import AssessmentDetailPageContent from './page-content';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Edit Assessment - Manual Analysis',
  description: 'Edit and manage your Life Cycle Assessment study.',
  keywords: ['LCA', 'assessment', 'edit', 'ISO 14040', 'ISO 14044'],
  canonical: '/apps/manual-analysis',
});

export default function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <AssessmentDetailPageContent params={params} />;
}
