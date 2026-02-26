import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { Toaster } from '@/components/toaster';
import { routing } from '@/libs/I18nRouting';
import { QueryProvider } from '@/providers/QueryProvider';
import { organizationStructuredData, softwareApplicationStructuredData, websiteStructuredData } from '@/utils/seo';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: {
    default: 'ProductLens AI - AI-Powered Product Sustainability Analysis',
    template: '%s | ProductLens AI',
  },
  description: 'Transform your product strategy with AI-powered sustainability analysis, environmental impact assessment, and compliance verification. Get instant insights into LCA, carbon footprint, and supply chain mapping.',
  keywords: [
    'product sustainability',
    'AI analysis',
    'environmental impact',
    'LCA analysis',
    'carbon footprint',
    'supply chain mapping',
    'compliance verification',
    'sustainability reporting',
    'product intelligence',
    'environmental assessment',
  ],
  authors: [{ name: 'ProductLens AI Team' }],
  creator: 'ProductLens AI',
  publisher: 'ProductLens AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://productlens.ai'),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://productlens.ai',
    languages: {
      'en-US': '/en',
      'vi-VN': '/vi',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://productlens.ai',
    siteName: 'ProductLens AI',
    title: 'ProductLens AI - AI-Powered Product Sustainability Analysis',
    description: 'Transform your product strategy with AI-powered sustainability analysis, environmental impact assessment, and compliance verification.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProductLens AI - Product Sustainability Analysis Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProductLens AI - AI-Powered Product Sustainability Analysis',
    description: 'Transform your product strategy with AI-powered sustainability analysis, environmental impact assessment, and compliance verification.',
    images: ['/og-image.png'],
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
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationStructuredData) }}
        />
      </head>
      <body className="overflow-x-hidden bg-background text-foreground antialiased print:m-0 print:bg-white">
        <div className="flex min-h-screen min-w-0 flex-col">
          <NextIntlClientProvider>
            <QueryProvider>
              <PostHogProvider>
                <div className="flex-1">
                  {props.children}
                </div>
                <Toaster />
              </PostHogProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
