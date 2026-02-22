import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Product Intelligence Suite - AI-Powered Analysis Tools',
  description: 'Comprehensive AI-powered tools for product sustainability analysis, compliance verification, and environmental impact assessment. Access analyze, history, and reference tools in one integrated platform.',
  keywords: [
    'product intelligence suite',
    'AI analysis tools',
    'sustainability analysis',
    'environmental impact assessment',
    'compliance verification',
    'LCA analysis tools',
    'product history tracking',
    'industry standards database',
    'regulatory frameworks',
    'carbon footprint analysis',
  ],
  canonical: '/apps',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Product Intelligence Suite',
    'description': 'Comprehensive AI-powered tools for product sustainability analysis and environmental impact assessment.',
    'url': 'https://productlens.ai/apps',
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
      ],
    },
    'mainEntity': {
      '@type': 'ItemList',
      'name': 'ProductLens AI Tools',
      'itemListElement': [
        {
          '@type': 'SoftwareApplication',
          'position': 1,
          'name': 'Analyse Tool',
          'description': 'AI-powered product analysis for sustainability insights and environmental impact assessment.',
          'url': 'https://productlens.ai/apps/analysis',
          'applicationCategory': 'AnalysisApplication',
        },
        {
          '@type': 'SoftwareApplication',
          'position': 2,
          'name': 'History Tool',
          'description': 'Track and review previous analyses, compare results over time.',
          'url': 'https://productlens.ai/apps/history',
          'applicationCategory': 'ProductivityApplication',
        },
        {
          '@type': 'SoftwareApplication',
          'position': 3,
          'name': 'References Tool',
          'description': 'Access comprehensive databases and industry standards.',
          'url': 'https://productlens.ai/apps/references',
          'applicationCategory': 'ReferenceApplication',
        },
      ],
    },
  },
});
