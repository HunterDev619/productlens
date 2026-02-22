'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Outfit } from 'next/font/google';

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/&/g, 'and')
    .replace(/–/g, '-');
}

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

const features = [
  {
    icon: '📊',
    title: 'AI Product Analysis',
    subtitle: 'AI-Powered Computer Vision - Patent Pending',
    bullets: [
      'Component Weight Breakdown',
      'Material Identification',
      'Carbon Emission Factors',
      'Risk & Supply Chain Insights',
    ],
  },
  {
    icon: '🌱',
    title: 'Lifecycle Assessment (LCA)',
    subtitle: 'Cradle-to-Grave CO₂ Analysis',
    bullets: [
      'Full Lifecycle Emissions',
      'Stage-by-Stage Breakdown',
      'Hotspot Identification',
    ],
  },
  {
    icon: '🔬',
    title: 'Environmental Indicators',
    subtitle: 'IPCC AR6-Aligned Metrics',
    bullets: [
      'Global Warming Potential',
      'Water & Land Use Impact',
      'Biodiversity Risk Score',
    ],
  },
  {
    icon: '🗺️',
    title: 'Supply-Chain Traceability',
    subtitle: 'Global Material Mapping',
    bullets: [
      'Origin & Transport Routes',
      'Supply Chain Risks',
      'Interactive World Map',
    ],
  },
  {
    icon: '📋',
    title: 'Decarbonisation Strategy',
    subtitle: 'Carbon Reduction Roadmap',
    bullets: [
      'CO₂ Savings Potential',
      'Actionable Solutions',
      'Timeline & Cost Analysis',
    ],
  },
  {
    icon: '📈',
    title: 'Product Analysis History',
    subtitle: 'Track Progress Over Time',
    bullets: [
      'Trend Tracking',
      'Version Comparisons',
      'Report Exports',
    ],
  },
  {
    icon: '📚',
    title: 'References & Regulatory Library',
    subtitle: 'Built on Trusted Standards',
    bullets: ['50+ Databases & Global Standards'],
  },
];

const ANGLE = 30;

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const n = features.length;

  useEffect(() => {
    const readHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const match = hash.match(/^#features-(.+)$/);
      if (match) {
        const slug = match[1];
        const idx = features.findIndex((f) => titleToSlug(f.title) === slug);
        if (idx >= 0) {
          setActiveIndex(idx);
          const scrollToSection = () => {
            const el = document.getElementById('features');
            if (!el) return;
            const viewport = document.querySelector('[data-scroll-viewport]');
            if (viewport instanceof HTMLElement) {
              const elTop = el.getBoundingClientRect().top + viewport.scrollTop - 80;
              viewport.scrollTo({ top: Math.max(0, elTop), behavior: 'smooth' });
            } else {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          };
          setTimeout(scrollToSection, 50);
          setTimeout(scrollToSection, 200);
          setTimeout(scrollToSection, 500);
        }
      }
    };
    readHash();
    const t1 = setTimeout(readHash, 100);
    const t2 = setTimeout(readHash, 300);
    window.addEventListener('hashchange', readHash);
    window.addEventListener('popstate', readHash);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('hashchange', readHash);
      window.removeEventListener('popstate', readHash);
    };
  }, []);

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + n) % n);
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % n);
  };

  const leftIndex = (activeIndex - 1 + n) % n;
  const centerIndex = activeIndex;
  const rightIndex = (activeIndex + 1) % n;

  return (
    <section
      id="features"
      className={`relative overflow-hidden bg-sky-50/60 py-20 sm:py-24 scroll-mt-24 ${outfit.className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] leading-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3rem]">
            Everything You Need to Measure, Report, and Reduce
          </h2>
        </div>

        <div className="relative flex min-h-[min(70vh,32rem)] items-center justify-center">
          <div
            className="relative flex w-full max-w-6xl items-center justify-between gap-4"
            style={{ perspective: 2000 }}
          >
            {/* Left card - 30° angle */}
            <motion.div
              key={`left-${leftIndex}`}
              className="absolute left-[5%] top-1/2 w-[min(300px,26vw)] -translate-y-1/2"
              style={{ zIndex: 1 }}
              initial={{ opacity: 0, rotate: -ANGLE, x: direction === 1 ? -60 : 60 }}
              animate={{
                opacity: 0.9,
                rotate: -ANGLE,
                x: 0,
                scale: 0.92,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <FeatureCard feature={features[leftIndex]!} isCenter={false} />
            </motion.div>

            {/* Left arrow */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous feature"
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 md:left-4 lg:left-[calc(50%-12rem)] lg:-translate-x-1/2"
            >
              <motion.div
                className="flex size-12 items-center justify-center rounded-full border border-sky-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:border-sky-200/80 hover:bg-sky-50/80"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <CaretLeft size={24} weight="bold" className="text-foreground" />
              </motion.div>
            </button>

            {/* Center card */}
            <motion.div
              key={`center-${centerIndex}`}
              className="relative z-10 w-[min(340px,95vw)] shrink-0 sm:w-[min(360px,85vw)] md:w-[min(360px,45vw)] lg:w-[min(360px,32vw)]"
              initial={{ opacity: 0, scale: 0.92, x: direction === 1 ? 100 : -100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <FeatureCard feature={features[centerIndex]!} isCenter />
            </motion.div>

            {/* Right arrow - between center and right */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Next feature"
              className="absolute right-[calc(50%-12rem)] top-1/2 z-20 translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                className="flex size-12 items-center justify-center rounded-full border border-sky-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:border-sky-200/80 hover:bg-sky-50/80"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <CaretRight size={24} weight="bold" className="text-foreground" />
              </motion.div>
            </button>

            {/* Right card - 30° angle (hidden on mobile/tablet) */}
            <motion.div
              key={`right-${rightIndex}`}
              className="absolute right-[5%] top-1/2 hidden w-[min(300px,26vw)] -translate-y-1/2 lg:block"
              style={{ zIndex: 1 }}
              initial={{ opacity: 0, rotate: ANGLE, x: direction === 1 ? 60 : -60 }}
              animate={{
                opacity: 0.9,
                rotate: ANGLE,
                x: 0,
                scale: 0.92,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <FeatureCard feature={features[rightIndex]!} isCenter={false} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  isCenter,
}: {
  feature: (typeof features)[0];
  isCenter: boolean;
}) {
  return (
    <motion.div
      className={`overflow-hidden rounded-2xl border-0 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] ${
        isCenter ? 'bg-white/98' : 'bg-white/80 backdrop-blur-sm'
      }`}
      whileHover={isCenter ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' } : {}}
      transition={{ duration: 0.2 }}
    >
      <FeatureCardContent feature={feature} />
    </motion.div>
  );
}

function FeatureCardContent({ feature }: { feature: (typeof features)[0] }) {
  return (
    <div className="flex h-full min-h-[260px] flex-col p-4 sm:min-h-[300px] sm:p-6 md:min-h-[320px] md:p-8">
      <div className="mb-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-3xl">
        {feature.icon}
      </div>
      <h3 className="mb-2 text-xl font-light tracking-[-0.02em] text-foreground sm:text-2xl md:text-3xl">{feature.title}</h3>
      <p className="mb-5 text-lg font-light leading-[1.6] tracking-[0.02em] text-muted-foreground sm:text-xl">{feature.subtitle}</p>
      <ul className="mt-auto space-y-3">
        {feature.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-base font-light leading-relaxed sm:text-lg">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 tracking-[0.01em]">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
