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
    .replace(/–/g, '-')
    .replace(/,/g, '');
}

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

const useCases = [
  {
    icon: '✏️',
    title: 'Product Designers & Engineers',
    description:
      'Validate material choices during the design phase — before manufacturing begins. Identify high-emission components early and model alternatives instantly.',
  },
  {
    icon: '🌱',
    title: 'Sustainability & ESG Teams',
    description:
      'Generate audit-ready documentation for CSRD, ISO 14044, and procurement questionnaires without weeks of consultant engagement.',
  },
  {
    icon: '🏭',
    title: 'Manufacturers & Suppliers',
    description:
      'Demonstrate environmental credentials to customers and regulatory bodies. Stay ahead of carbon border adjustment mechanisms and extended producer responsibility legislation.',
  },
  {
    icon: '📋',
    title: 'Procurement & Compliance Officers',
    description:
      'Screen supplier products for environmental risk and compliance alignment. Compare products side-by-side across lifecycle stages.',
  },
];

const ANGLE = 30;

/** Header nav titles (Solution/UseCase) -> use case index */
const SLUG_TO_INDEX: Record<string, number> = {
  'product-designers-and-engineers': 0,
  'design-and-engineering': 0,
  'sustainability-and-esg-teams': 1,
  'sustainability-and-esg': 1,
  'manufacturers-and-suppliers': 2,
  'procurement-and-compliance-officers': 3,
  'procurement-and-compliance': 3,
};

export function UseCasesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const n = useCases.length;

  useEffect(() => {
    const scrollToSection = () => {
      const el = document.getElementById('use-cases');
      if (!el) return;
      const viewport = document.querySelector('[data-scroll-viewport]');
      if (viewport instanceof HTMLElement) {
        const elTop = el.getBoundingClientRect().top + viewport.scrollTop - 80;
        viewport.scrollTo({ top: Math.max(0, elTop), behavior: 'smooth' });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    const readHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (hash === '#use-cases' || hash.startsWith('#use-cases-')) {
        const slug = hash === '#use-cases' ? null : hash.replace('#use-cases-', '');
        const idx = slug
          ? (SLUG_TO_INDEX[slug] ?? useCases.findIndex((u) => titleToSlug(u.title) === slug))
          : 0;
        if (idx >= 0) {
          setActiveIndex(idx);
          requestAnimationFrame(() => {
            setTimeout(scrollToSection, 100);
            setTimeout(scrollToSection, 300);
            setTimeout(scrollToSection, 600);
          });
        }
      }
    };
    readHash();
    const t1 = setTimeout(readHash, 100);
    const t2 = setTimeout(readHash, 400);
    const t3 = setTimeout(readHash, 800);
    window.addEventListener('hashchange', readHash);
    window.addEventListener('popstate', readHash);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
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
      id="use-cases"
      className={`relative overflow-hidden bg-sky-50/60 py-20 sm:py-24 scroll-mt-24 ${outfit.className}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3rem]">
            Built for Teams That Take Sustainability Seriously
          </h2>
        </div>

        <div className="relative flex min-h-[min(50vh,28rem)] items-center justify-center md:min-h-[min(60vh,30rem)] lg:min-h-[min(70vh,32rem)]">
          <div
            className="relative flex w-full max-w-6xl items-center justify-center md:justify-between"
            style={{ perspective: 2000 }}
          >
            {/* Left card - hidden on mobile/tablet */}
            <motion.div
              key={`left-${leftIndex}`}
              className="absolute left-[5%] top-1/2 hidden w-[min(300px,26vw)] -translate-y-1/2 lg:block"
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
              <UseCaseCard item={useCases[leftIndex]!} isCenter={false} />
            </motion.div>

            {/* Left arrow */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous use case"
              className="absolute left-1 top-1/2 z-20 -translate-y-1/2 sm:left-2 md:left-4 lg:left-[calc(50%-12rem)] lg:-translate-x-1/2"
            >
              <motion.div
                className="flex size-10 items-center justify-center rounded-full border border-sky-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:border-sky-200/80 hover:bg-sky-50/80 sm:size-12"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <CaretLeft size={20} weight="bold" className="text-foreground sm:w-6 sm:h-6" />
              </motion.div>
            </button>

            {/* Center card */}
            <motion.div
              key={`center-${centerIndex}`}
              className="relative z-10 w-full max-w-[calc(100%-5rem)] shrink-0 sm:max-w-[min(420px,90vw)] md:max-w-[min(420px,45vw)] lg:w-[min(360px,32vw)]"
              initial={{ opacity: 0, scale: 0.92, x: direction === 1 ? 100 : -100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <UseCaseCard item={useCases[centerIndex]!} isCenter />
            </motion.div>

            {/* Right arrow */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Next use case"
              className="absolute right-1 top-1/2 z-20 -translate-y-1/2 sm:right-2 md:right-4 lg:right-[calc(50%-12rem)] lg:translate-x-1/2"
            >
              <motion.div
                className="flex size-10 items-center justify-center rounded-full border border-sky-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:border-sky-200/80 hover:bg-sky-50/80 sm:size-12"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <CaretRight size={20} weight="bold" className="text-foreground sm:w-6 sm:h-6" />
              </motion.div>
            </button>

            {/* Right card - hidden on mobile/tablet */}
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
              <UseCaseCard item={useCases[rightIndex]!} isCenter={false} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCaseCard({
  item,
  isCenter,
}: {
  item: (typeof useCases)[0];
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
      <div className="flex h-full min-h-[280px] flex-col p-5 sm:min-h-[320px] sm:p-6 md:p-8">
        <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-2xl sm:mb-5 sm:h-16 sm:w-16 sm:text-3xl">
          {item.icon}
        </div>
        <h3 className="mb-2 text-lg font-light tracking-[-0.02em] text-foreground sm:text-xl md:text-2xl lg:text-3xl">{item.title}</h3>
        <p className="text-base font-light leading-[1.6] tracking-[0.02em] text-muted-foreground sm:text-lg md:text-xl">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
