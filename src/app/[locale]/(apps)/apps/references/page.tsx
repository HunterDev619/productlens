import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';
import ReferencesPageContent from './page-content';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Industry Standards & References - Sustainability Compliance Database',
  description: 'Access comprehensive databases of industry standards, regulatory frameworks, and best practices for product sustainability. Find IPCC guidelines, ISO standards, environmental regulations, and compliance requirements.',
  keywords: [
    'industry standards',
    'sustainability compliance',
    'regulatory frameworks',
    'environmental regulations',
    'ISO standards',
    'IPCC guidelines',
    'compliance database',
    'best practices',
    'sustainability documentation',
    'environmental standards',
    'regulatory compliance',
    'industry guidelines',
  ],
  canonical: '/apps/references',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Industry Standards & References',
    'description': 'Comprehensive databases of industry standards, regulatory frameworks, and best practices for product sustainability.',
    'url': 'https://productlens.ai/apps/references',
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
          'name': 'References',
          'item': 'https://productlens.ai/apps/references',
        },
      ],
    },
    'mainEntity': {
      '@type': 'Dataset',
      'name': 'Sustainability Standards Database',
      'description': 'Comprehensive collection of industry standards, regulatory frameworks, and best practices for product sustainability.',
      'keywords': [
        'industry standards',
        'sustainability compliance',
        'environmental regulations',
        'ISO standards',
        'IPCC guidelines',
      ],
      'creator': {
        '@type': 'Organization',
        'name': 'ProductLens AI',
      },
      'license': 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
});

export default function ReferencesPage() {
  return <ReferencesPageContent />;
}
