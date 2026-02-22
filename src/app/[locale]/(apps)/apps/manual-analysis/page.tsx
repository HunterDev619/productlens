import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';
import ManualAnalysisPageContent from './page-content';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Manual Analysis - LCA Assessment Management',
  description: 'Manage your Life Cycle Assessment (LCA) studies in compliance with ISO 14040/14044. Track environmental impacts, carbon footprint, and sustainability metrics.',
  keywords: [
    'LCA analysis',
    'life cycle assessment',
    'ISO 14040',
    'ISO 14044',
    'environmental impact',
    'carbon footprint',
    'sustainability assessment',
    'EPD',
    'product carbon footprint',
    'environmental product declaration',
  ],
  canonical: '/apps/manual-analysis',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Manual Analysis',
    'description': 'Manage LCA assessments for ISO 14040/14044 compliance.',
    'url': 'https://productlens.ai/apps/manual-analysis',
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
          'name': 'Manual Analysis',
          'item': 'https://productlens.ai/apps/manual-analysis',
        },
      ],
    },
    'mainEntity': {
      '@type': 'SoftwareApplication',
      'name': 'LCA Assessment Manager',
      'description': 'ISO-compliant life cycle assessment management system.',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'featureList': [
        'LCA assessment creation',
        'Impact assessment',
        'Goal and scope definition',
        'Inventory analysis',
        'EPD generation',
        'Export functionality',
      ],
    },
  },
});

export default function ManualAnalysisPage() {
  return <ManualAnalysisPageContent />;
}
