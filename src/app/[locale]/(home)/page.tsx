import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';
import { FeaturesSection } from './_components/FeaturesSection';
import { HowItWorksSection } from './_components/HowItWorksSection';
import { MetricsSection } from './_components/MetricsSection';
import { UseCasesSection } from './_components/UseCasesSection';
import { getAnalyseImages } from './_lib/getAnalyseImages';
import { getFlowImages } from './_lib/getFlowImages';
import { VideoBackground } from './_components/VideoBackground';
import { LogoMarquee } from './_components/LogoMarquee';
import { HeroButtons } from './_components/HeroButtons';
import { ProblemSection } from './_components/ProblemSection';
import RedirectResetPassword from './_components/redirect-reset-password';
import { Header } from './components/header';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Product Lens - AI Product Intelligence & Sustainability Platform',
  description: 'Transform product analysis with instant AI image recognition. Get comprehensive market intelligence, sustainability reports, and carbon tracking in seconds.',
  keywords: [
    'product intelligence',
    'AI image recognition',
    'sustainability analysis',
    'carbon footprint',
    'LCA analysis',
    'supply chain traceability',
    'ISO 14040',
    'IPCC AR6',
    'decarbonisation roadmap',
    'market intelligence',
  ],
  canonical: '/',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Product Lens - AI Product Intelligence & Sustainability Platform',
    'description': 'Transform product analysis with instant AI image recognition. Get comprehensive market intelligence, sustainability reports, and carbon tracking in seconds.',
    'url': 'https://productlens.ai',
    'mainEntity': {
      '@type': 'SoftwareApplication',
      'name': 'Product Lens',
      'applicationCategory': 'ProductivityApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
    },
  },
});

export default async function Home() {
  const analyseImages = getAnalyseImages();
  const flowImages = getFlowImages();
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-background max-w-[100vw]">
      <RedirectResetPassword />
      <Header />
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden py-20 sm:py-32">
        {/* Video Background - video 1 only */}
        <VideoBackground />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-0 sm:px-4 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            {/* Hero Content - buttons first */}
            <div className="z-10 flex-1 text-center lg:text-left">
              <h1 className="mb-4 text-2xl font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                Transform Your Product Images into Compliance - In Minutes
              </h1>
              <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] sm:mb-8 sm:text-lg md:text-xl lg:mx-0 lg:text-2xl">
                Generate sustainability intelligence reports and decarbonisation strategies with 3 simple steps
              </p>
              <HeroButtons />
            </div>
          </div>
        </div>
      </section>

      {/* Logo marquee under video */}
      <LogoMarquee images={flowImages} />

      {/* Problem Section */}
      <ProblemSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection images={analyseImages} />

      {/* Metrics / Social Proof Section */}
      <MetricsSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-br from-emerald-50 to-emerald-100/80 py-16 text-foreground sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-heading-xl font-bold text-foreground">
              Get In Touch
            </h2>
            <p className="mx-auto max-w-xl text-body-lg text-muted-foreground">
              Have questions or want to schedule a demo? Our team is here to help you get started with Product Lens.
            </p>
          </div>

          <div className="flex flex-col flex-wrap items-center justify-center gap-12 sm:flex-row">
            <div className="flex flex-col items-center gap-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#0066ff] to-[#00d4aa] text-2xl">
                📧
              </div>
              <strong className="text-heading">Email</strong>
              <a href="mailto:info@productlens.ai" className="text-[#00d4aa] hover:underline">
                contact@eco-solutise.com
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">
                📞
              </div>
              <strong className="text-heading">Phone</strong>
              <a href="tel:+6512345678" className="text-emerald-700 hover:text-emerald-600/90 hover:underline">
                +65 9028 9450
              </a>
            </div>
            {/* <div className="flex flex-col items-center gap-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#0066ff] to-[#00d4aa] text-2xl">
                💬
              </div>
              <strong className="text-lg">Live Chat</strong>
              <span className="text-[#00d4aa]">Available 9 AM - 6 PM SGT</span>
            </div> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-black py-8 text-center text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm">
            &copy; 2025 Product Lens. All rights reserved. | ISO 14040 Compliant | IPCC AR6 Aligned
          </p>
        </div>
      </footer> */}
    </div>
  );
}
