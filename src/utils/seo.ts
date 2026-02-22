import type { Metadata } from 'next';

export type SEOConfig = {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: Record<string, any>;
  locale?: string;
  alternates?: {
    languages?: Record<string, string>;
  };
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    locale = 'en',
    alternates,
  } = config;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://productlens.ai';
  const fullTitle = title.includes('ProductLens') ? title : `${title} | ProductLens AI`;
  const defaultOgImage = `${baseUrl}/og-image.png`;

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),
    authors: [{ name: 'ProductLens AI Team' }],
    creator: 'ProductLens AI',
    publisher: 'ProductLens AI',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonical || baseUrl,
      languages: alternates?.languages || {
        'en-US': '/en',
        'vi-VN': '/vi',
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || baseUrl,
      siteName: 'ProductLens AI',
      images: [
        {
          url: ogImage || defaultOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: ogType,
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [ogImage || defaultOgImage],
      creator: '@productlensai',
      site: '@productlensai',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'index': true,
        'follow': true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
  };
}

export function generateStructuredData(type: string, data: Record<string, any>) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return baseStructuredData;
}

// Common structured data templates
export const organizationStructuredData = generateStructuredData('Organization', {
  name: 'ProductLens AI',
  url: 'https://productlens.ai',
  logo: 'https://productlens.ai/logo.png',
  description: 'AI-powered product sustainability analysis and environmental impact assessment platform',
  sameAs: [
    'https://twitter.com/productlensai',
    'https://linkedin.com/company/productlens-ai',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    'telephone': '+1-555-0123',
    'contactType': 'customer service',
    'availableLanguage': ['English', 'Vietnamese'],
  },
});

export const websiteStructuredData = generateStructuredData('WebSite', {
  name: 'ProductLens AI',
  url: 'https://productlens.ai',
  description: 'AI-powered product sustainability analysis and environmental impact assessment',
  potentialAction: {
    '@type': 'SearchAction',
    'target': {
      '@type': 'EntryPoint',
      'urlTemplate': 'https://productlens.ai/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbStructuredData = (items: Array<{ name: string; url: string }>) =>
  generateStructuredData('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  });

export const faqStructuredData = (faqs: Array<{ question: string; answer: string }>) =>
  generateStructuredData('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  });

export const softwareApplicationStructuredData = generateStructuredData('SoftwareApplication', {
  name: 'ProductLens AI',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Sustainability Analysis',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
    'priceValidUntil': '2025-12-31',
    'availability': 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    'ratingValue': '4.8',
    'ratingCount': '1250',
    'bestRating': '5',
    'worstRating': '1',
  },
  featureList: [
    'AI-powered product analysis',
    'Environmental impact assessment',
    'Sustainability reporting',
    'Supply chain mapping',
    'Compliance verification',
    'LCA analysis',
  ],
});
