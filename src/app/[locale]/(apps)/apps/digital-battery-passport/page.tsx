import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/utils/seo';

import NewPassportPageContent from './page-content';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Create Battery Passport - EU Regulation 2023/1542 Compliance',
  description:
    'Capture complete EU battery passport data across identification, carbon footprint, material composition, performance, and compliance workflows. Generate Annex XIII-ready submissions for electric vehicle and industrial batteries.',
  keywords: [
    'battery passport',
    'EU regulation 2023/1542',
    'Annex XIII',
    'battery compliance',
    'carbon footprint reporting',
    'recycled material tracking',
    'battery dismantling instructions',
    'extended producer responsibility',
    'sustainability reporting',
  ],
  canonical: '/apps/new-passport',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Create Battery Passport',
    'description':
      'Collect identification, carbon, material, and compliance data to generate EU-compliant digital battery passports.',
    'url': 'https://productlens.ai/apps/new-passport',
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
          'name': 'New Passport',
          'item': 'https://productlens.ai/apps/new-passport',
        },
      ],
    },
    'mainEntity': {
      '@type': 'SoftwareApplication',
      'name': 'ProductLens Battery Passport Builder',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'featureList': [
        'Battery identification and manufacturing data capture',
        'Carbon footprint and lifecycle metrics',
        'Material composition and recycled content tracking',
        'Voltage, capacity, and efficiency performance entry',
        'Temperature, safety, and incident logging',
        'Compliance, due diligence, and EPR documentation',
      ],
    },
  },
});

export default function NewPassportPage() {
  return <NewPassportPageContent />;
}
