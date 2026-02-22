import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';
import AnalyzePageContent from './page-content';

export const metadata: Metadata = generateSEOMetadata({
  title: 'AI Product Analysis Tool - Sustainability & Environmental Impact Assessment',
  description: 'Upload product images for instant AI-powered sustainability analysis. Get detailed LCA analysis, raw material composition, carbon footprint assessment, and IPCC synthesis reports for comprehensive environmental impact evaluation.',
  keywords: [
    'product analysis tool',
    'AI sustainability analysis',
    'environmental impact assessment',
    'LCA analysis',
    'carbon footprint calculator',
    'raw material composition',
    'cradle-to-grave analysis',
    'IPCC synthesis report',
    'supply chain mapping',
    'sustainability metrics',
    'product upload analysis',
    'environmental compliance',
  ],
  canonical: '/apps/analysis',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'AI Product Analysis Tool',
    'description': 'Upload product images for instant AI-powered sustainability analysis and environmental impact assessment.',
    'url': 'https://productlens.ai/apps/analysis',
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
          'name': 'Analyse',
          'item': 'https://productlens.ai/apps/analysis',
        },
      ],
    },
    'mainEntity': {
      '@type': 'SoftwareApplication',
      'name': 'ProductLens AI Analysis Tool',
      'description': 'AI-powered product analysis for sustainability insights and environmental impact assessment.',
      'applicationCategory': 'AnalysisApplication',
      'operatingSystem': 'Web Browser',
      'featureList': [
        'Product image upload and analysis',
        'AI-powered sustainability assessment',
        'LCA (Life Cycle Assessment) analysis',
        'Raw material composition analysis',
        'Carbon footprint calculation',
        'Cradle-to-grave lifecycle analysis',
        'IPCC synthesis reporting',
        'Supply chain mapping',
        'Environmental compliance checking',
      ],
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock',
      },
    },
  },
});

export default function AnalyzePage() {
  return <AnalyzePageContent />;
}
