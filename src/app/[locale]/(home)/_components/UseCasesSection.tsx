'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/&/g, 'and')
    .replace(/–/g, '-')
    .replace(/,/g, '');
}

const USECASE_IMAGE_FILES = [
  'Product Designers & Engineers.png',
  'Sustainability & ESG Teams.png',
  'Manufacturers & Suppliers.png',
  'Procurement & Compliance Officers.png',
] as const;

function useCaseImageSrc(index: number): string {
  const file = USECASE_IMAGE_FILES[index] ?? USECASE_IMAGE_FILES[0];
  return `/usecase/${encodeURIComponent(file)}`;
}

const useCases = [
  {
    icon: '✏️',
    title: 'Product Designers & Engineers',
    description:
      'Validate material choices during the design phase — before manufacturing begins. Identify high-emission components early and model alternatives instantly.',
    imageIndex: 0,
  },
  {
    icon: '🌱',
    title: 'Sustainability & ESG Teams',
    description:
      'Generate audit-ready documentation for CSRD, ISO 14044, and procurement questionnaires without weeks of consultant engagement.',
    imageIndex: 1,
  },
  {
    icon: '🏭',
    title: 'Manufacturers & Suppliers',
    description:
      'Demonstrate environmental credentials to customers and regulatory bodies. Stay ahead of carbon border adjustment mechanisms and extended producer responsibility legislation.',
    imageIndex: 2,
  },
  {
    icon: '📋',
    title: 'Procurement & Compliance Officers',
    description:
      'Screen supplier products for environmental risk and compliance alignment. Compare products side-by-side across lifecycle stages.',
    imageIndex: 3,
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

  return (
    <section
      id="use-cases"
      className="relative overflow-hidden bg-sky-50/60 py-20 sm:py-24 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.03em] leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3rem]">
            Built for Teams That Take Sustainability Seriously
          </h2>
        </div>

        <div className="relative flex min-h-[min(50vh,28rem)] flex-col items-center justify-center gap-8 md:min-h-[min(60vh,30rem)] lg:flex-row lg:gap-0 lg:min-h-[min(70vh,32rem)]">
          <div
            className="relative flex w-full max-w-6xl items-center justify-center md:justify-between"
            style={{ perspective: 2000 }}
          >
            {/* Left card - hidden on mobile/tablet */}
            <motion.div
              key={`left-${leftIndex}`}
              className="absolute left-[4%] top-1/2 hidden w-[min(340px,28vw)] -translate-y-1/2 lg:block"
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

            {/* Center card (left part main – larger) */}
            <motion.div
              key={`center-${centerIndex}`}
              className="relative z-10 w-full max-w-[calc(100%-5rem)] shrink-0 sm:max-w-[min(540px,90vw)] md:max-w-[min(560px,50vw)] lg:w-[min(480px,42vw)]"
              initial={{ opacity: 0, scale: 0.92, x: direction === 1 ? 100 : -100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <UseCaseCard item={useCases[centerIndex]!} isCenter />
            </motion.div>

            {/* Left and right arrows – centered */}
            <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous use case"
              >
                <motion.div
                  className="flex size-10 items-center justify-center rounded-full border border-sky-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:border-sky-200/80 hover:bg-sky-50/80 sm:size-12"
                  whileHover={{ scale: 1.12, boxShadow: '0 8px 24px rgba(14,165,233,0.2)' }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <CaretLeft size={20} weight="bold" className="text-foreground sm:w-6 sm:h-6" />
                </motion.div>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next use case"
              >
                <motion.div
                  className="flex size-10 items-center justify-center rounded-full border border-sky-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:border-sky-200/80 hover:bg-sky-50/80 sm:size-12"
                  whileHover={{ scale: 1.12, boxShadow: '0 8px 24px rgba(14,165,233,0.2)' }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <CaretRight size={20} weight="bold" className="text-foreground sm:w-6 sm:h-6" />
                </motion.div>
              </button>
            </div>

            {/* Right part: all 4 images stacked at once, (+15,+15) offset per layer, active in front */}
            <div className="absolute right-[2%] top-1/2 hidden w-[min(520px,46vw)] -translate-y-1/2 lg:block" style={{ zIndex: 1 }}>
              <div className="relative aspect-[4/3] w-full overflow-visible pr-[45px] pb-[45px]">
                {[0, 1, 2, 3].map((i) => {
                  const imgIdx = (centerIndex + i) % 4;
                  const offset = i * 15;
                  const isFront = i === 0;
                  return (
                    <motion.div
                      key={`layer-${i}`}
                      className="absolute overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                      style={{
                        zIndex: 3 - i,
                        inset: 0,
                        transform: `translate(${offset}px, ${offset}px)`,
                      }}
                      initial={false}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={imgIdx}
                          initial={{ opacity: 0, x: -direction * 60, scale: 0.96 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: direction * 60, scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                          className="relative h-full w-full"
                        >
                          <Image
                            src={useCaseImageSrc(imgIdx)}
                            alt={isFront ? useCases[imgIdx]!.title : ''}
                            fill
                            sizes="(max-width: 1024px) 0px, 46vw"
                            className="object-cover"
                            priority={imgIdx < 2}
                            unoptimized
                            aria-hidden={!isFront}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile/tablet: same stacked display, all 4 at once, (+15,+15) per layer */}
          <div className="w-full max-w-2xl px-4 lg:hidden">
            <div className="relative aspect-[4/3] w-full overflow-visible pr-[45px] pb-[45px]">
              {[0, 1, 2, 3].map((i) => {
                const imgIdx = (centerIndex + i) % 4;
                const offset = i * 15;
                const isFront = i === 0;
                return (
                  <motion.div
                    key={`mob-layer-${i}`}
                    className="absolute overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                    style={{
                      zIndex: 3 - i,
                      inset: 0,
                      transform: `translate(${offset}px, ${offset}px)`,
                    }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={imgIdx}
                        initial={{ opacity: 0, x: -direction * 60, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: direction * 60, scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={useCaseImageSrc(imgIdx)}
                          alt={isFront ? useCases[imgIdx]!.title : ''}
                          fill
                          sizes="(max-width: 1024px) 100vw, 0px"
                          className="object-cover"
                          priority={imgIdx < 2}
                          unoptimized
                          aria-hidden={!isFront}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
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
      <div className="flex h-full min-h-[300px] flex-col p-6 sm:min-h-[360px] sm:p-8 md:min-h-[380px] md:p-10">
        <h3 className="mb-3 text-xl font-semibold tracking-[-0.03em] leading-tight text-foreground sm:text-2xl md:text-3xl lg:text-[1.75rem]">
          {item.title}
        </h3>
        <p className="text-base font-medium leading-[1.7] tracking-[0.01em] text-muted-foreground sm:text-lg md:text-xl">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
