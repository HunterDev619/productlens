import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';
import PassportsPageContent from './page-content';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Battery Passports - Digital Battery Passport Management',
  description: 'Manage your digital battery passports in compliance with EU Regulation 2023/1542. Track battery lifecycle, carbon footprint, materials composition, and regulatory compliance.',
  keywords: [
    'battery passport',
    'digital battery passport',
    'EU battery regulation',
    'battery lifecycle',
    'carbon footprint',
    'battery compliance',
    'battery traceability',
    'EV battery',
    'industrial battery',
    'battery materials',
    'recycled content',
  ],
  canonical: '/apps/passports',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Battery Passports',
    'description': 'Manage digital battery passports for EU regulatory compliance.',
    'url': 'https://productlens.ai/apps/passports',
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
          'name': 'Passports',
          'item': 'https://productlens.ai/apps/passports',
        },
      ],
    },
    'mainEntity': {
      '@type': 'SoftwareApplication',
      'name': 'Battery Passport Manager',
      'description': 'EU-compliant digital battery passport management system.',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'featureList': [
        'Battery passport creation',
        'Carbon footprint tracking',
        'Materials composition',
        'Compliance monitoring',
        'QR code generation',
        'Export functionality',
      ],
    },
  },
});

export default function PassportsPage() {
  return <PassportsPageContent />;
}
