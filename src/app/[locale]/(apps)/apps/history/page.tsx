import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';
import HistoryPageContent from './page-content';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Analysis History - Track Your Product Sustainability Reports',
  description: 'Review and track your previous product sustainability analyses. Compare environmental impact assessments over time, monitor improvement trends, and access detailed historical reports for all your analyzed products.',
  keywords: [
    'analysis history',
    'product tracking',
    'sustainability reports history',
    'environmental impact tracking',
    'LCA analysis history',
    'carbon footprint tracking',
    'product comparison',
    'sustainability trends',
    'historical analysis',
    'progress monitoring',
    'environmental compliance tracking',
  ],
  canonical: '/apps/history',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Analysis History',
    'description': 'Track and review your previous product sustainability analyses and environmental impact assessments.',
    'url': 'https://productlens.ai/apps/history',
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://productlens.ai',
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Apps',
          'item': 'https://productlens.ai/apps',
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'History',
          'item': 'https://productlens.ai/apps/history',
        },
      ],
    },
    'mainEntity': {
      '@type': 'SoftwareApplication',
      'name': 'ProductLens Analysis History',
      'description': 'Track and review your previous analyses, compare results over time, and monitor improvement trends.',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'featureList': [
        'Analysis timeline tracking',
        'Historical report access',
        'Progress comparison tools',
        'Trend monitoring',
        'Export historical data',
        'Detailed analysis review',
      ],
    },
  },
});

export default function HistoryPage() {
  return <HistoryPageContent />;
}
