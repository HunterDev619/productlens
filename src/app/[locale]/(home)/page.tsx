import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/utils/seo';
import { FeaturesSection } from './_components/FeaturesSection';
import { HowItWorksSection } from './_components/HowItWorksSection';
import { MetricsSection } from './_components/MetricsSection';
import { FaqSection } from './_components/FaqSection';
import { PricingSection } from './_components/PricingSection';
import { UseCasesSection } from './_components/UseCasesSection';
import { TechnologySection } from './_components/TechnologySection';
import { getAnalyseImages } from './_lib/getAnalyseImages';
import { getFlowImages } from './_lib/getFlowImages';
import { VideoBackground } from './_components/VideoBackground';
import { LogoMarquee } from './_components/LogoMarquee';
import { HeroButtons } from './_components/HeroButtons';
import { ProblemSection } from './_components/ProblemSection';
import RedirectResetPassword from './_components/redirect-reset-password';
import { Header } from './components/header';
import { Footer } from './_components/Footer';
import { ContactForm } from './_components/ContactForm';

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

      {/* Technology Section */}
      <TechnologySection />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-br from-emerald-50 to-emerald-100/80 py-10 text-foreground sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            {/* Left: CTA buttons + extra WhatsApp link (first & third images) */}
            <div className="flex flex-col items-stretch gap-4 max-w-sm md:self-center">
              <div className="mb-2">
                <h2 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
                  Get In Touch
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the form or reach us directly via WhatsApp and we’ll get back to you very soon.
                </p>
              </div>

              <a
                href="mailto:contact@eco-solutise.com?subject=Book%20a%20demo%20with%20ProductLens"
                className="inline-flex items-center justify-center rounded-lg bg-[#065f46] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#064e3b]"
              >
                Book A Demo
              </a>

              <a
                href="https://wa.me/6590289450"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-lg border border-[#16a34a] bg-white px-6 py-3 text-sm font-semibold text-[#16a34a] shadow-sm transition-colors hover:bg-[#ecfdf3]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-base text-white">
                  W
                </span>
                <span>WhatsApp</span>
              </a>

              {/* Extra contact link (third image position) */}
              <a
                href="mailto:productlens.ai@eco-solutise.com"
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] text-white">
                  @
                </span>
                <span>productlens.ai@eco-solutise.com</span>
              </a>
            </div>

            {/* Right: Contact form (second image) */}
            <div className="w-full rounded-2xl border border-emerald-700/40 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">
                Fill out the form below and we will be in touch soon.
              </h3>
              <ContactForm />

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
