'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/&/g, 'and')
    .replace(/–/g, '-');
}

function FeatureIcon({ emoji, title, imageFile }: { emoji: string; title: string; imageFile?: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const slug = titleToSlug(title);

  useEffect(() => {
    if (error) {
      setImageSrc(null);
      return;
    }

    // Paths to try, in order
    const pathsToTry: string[] = [];

    // 1. If explicit imageFile is provided, try it first
    if (imageFile) {
      pathsToTry.push(`/assets/feature/${imageFile}`);
    }

    // 2. Try slug-based paths (SVG, then PNG)
    pathsToTry.push(`/assets/feature/${slug}.svg`);
    pathsToTry.push(`/assets/feature/${slug}.png`);

    // 3. Try title-based paths (case-preserved)
    pathsToTry.push(`/assets/feature/${title}.svg`);
    pathsToTry.push(`/assets/feature/${title}.png`);

    let currentIndex = 0;

    const tryNext = () => {
      if (currentIndex >= pathsToTry.length) {
        setError(true);
        return;
      }

      const path = pathsToTry[currentIndex];
      if (!path) {
        currentIndex++;
        tryNext();
        return;
      }
      currentIndex++;

      const img = new Image();
      img.onload = () => {
        setImageSrc(path);
        setError(false);
      };
      img.onerror = tryNext;
      img.src = path;
    };

    tryNext();
  }, [slug, error, imageFile, title]);

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={title}
        className="h-full w-full object-contain"
      />
    );
  }

  // Fallback to emoji
  return <span className="text-center">{emoji}</span>;
}

const features = [
  {
    icon: '📊',
    title: 'Product Analysis',
    subtitle: 'AI-Powered Computer Vision - Patent Pending',
    imageFile: 'Product Analysis.png',
    bullets: [
      'Component Weight Breakdown',
      'Material Identification',
      'Carbon Emission Factors',
      'Risk & Supply Chain Insights',
    ],
  },
  {
    icon: '🌱',
    title: 'ISO 14040 / 14044 ',
    subtitle: 'Cradle-to-Grave CO₂ Analysis',
    imageFile: 'ISO 14040 .PNG',
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
    imageFile: 'Environmental Indicators.png',
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
    imageFile: 'Supply-Chain Traceability.png',
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
    imageFile: 'Decarbonisation Strategy.png',
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
    imageFile: 'Product Analysis History.png',
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
    imageFile: 'References & Regulatory Library.png',
    bullets: ['50+ Databases & Global Standards'],
  },
  {
    icon: '♻️',
    title: 'Circularity (ISO 59020)',
    subtitle: 'Circular Economy Metrics',
    imageFile: 'Circularity and ISO 59020 concept.png',
    bullets: [
      'Circularity Analysis & Scorecard',
      'Materiality Circularity Indicator',
      'Linear Flow Index',
    ],
  },
];

const ANGLE = 30;
const SPRING = { type: 'spring' as const, stiffness: 220, damping: 28 };
const DRAG_THRESHOLD = 60;

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = next (right-to-left), -1 = prev (left-to-right)
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragOffsetRef = useRef(0);
  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);
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

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % n);
  }, [n]);

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    setDragOffset(0);
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - dragStartX.current;
    setDragOffset(diff);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    const offset = dragOffsetRef.current;
    if (offset > DRAG_THRESHOLD) goPrev();
    else if (offset < -DRAG_THRESHOLD) goNext();
    setDragOffset(0);
    setIsDragging(false);
  }, [isDragging, goPrev, goNext]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) =>
      handleDragMove('touches' in e ? e.touches[0]!.clientX : e.clientX);
    const onEnd = () => handleDragEnd();
    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const leftIndex = (activeIndex - 1 + n) % n;
  const centerIndex = activeIndex;
  const rightIndex = (activeIndex + 1) % n;

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-sky-50/60 py-20 sm:py-24 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h3 className="text-2xl font-semibold tracking-[-0.02em] leading-tight text-foreground sm:text-3xl md:text-3xl lg:text-4xl xl:text-[2.4rem]">
            Everything You Need to Measure, Report, and Reduce
          </h3>
        </div>

        {/* Active feature title above the cards (matches section style) */}
        <div className="mx-auto mb-8 max-w-4xl text-center">
          <h4 className="text-xl font-semibold tracking-[-0.02em] leading-tight text-foreground sm:text-2xl md:text-2xl lg:text-3xl">
            {features[activeIndex]?.title}
          </h4>
        </div>

        <div className="relative flex min-h-[min(70vh,36rem)] items-center justify-center touch-none select-none">
          <div
            className="relative flex w-full max-w-6xl cursor-grab active:cursor-grabbing items-center justify-center"
            style={{ perspective: 2000, transformStyle: 'preserve-3d' }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onTouchStart={(e) => handleDragStart(e.touches[0]!.clientX)}
          >
            <div
              className="relative flex w-full items-center justify-center gap-0"
              style={{
                transform: `translateX(${dragOffset}px)`,
                transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Left card - 30° angle (hidden on mobile) */}
              <motion.div
                key={`left-${leftIndex}`}
                className="absolute left-[2%] top-1/2 hidden w-[min(260px,22vw)] -translate-y-1/2 sm:left-[4%] sm:w-[min(280px,24vw)] lg:left-[6%] lg:block lg:w-[min(300px,26vw)]"
                style={{
                  zIndex: 1,
                  transformOrigin: 'center center',
                }}
                initial={false}
                animate={{
                  opacity: 0.9,
                  rotateY: -ANGLE,
                  x: -20 - (dragOffset > 0 ? Math.min(dragOffset * 0.3, 40) : 0) + (dragOffset < 0 ? Math.max(dragOffset * 0.3, -40) : 0),
                  scale: 0.88,
                }}
                transition={SPRING}
              >
                <FeatureCard feature={features[leftIndex]!} isCenter={false} />
              </motion.div>

              {/* Center card - main, larger - flow right-to-left animation */}
              <div className="relative z-10 w-[min(320px,90vw)] shrink-0 overflow-visible sm:w-[min(380px,85vw)] md:w-[min(400px,50vw)] lg:w-[min(420px,38vw)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`center-${centerIndex}`}
                    className="relative w-full"
                    style={{ transformOrigin: 'center center' }}
                    initial={{
                      opacity: 0,
                      x: direction === 1 ? 120 : -120,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      x: dragOffset * 0.5,
                      scale: 1.08,
                    }}
                    exit={{
                      opacity: 0,
                      x: direction === 1 ? -120 : 120,
                      scale: 0.96,
                      transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
                    }}
                    transition={{
                      ...SPRING,
                      opacity: { duration: 0.3 },
                    }}
                  >
                    <FeatureCard feature={features[centerIndex]!} isCenter />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right card - 30° angle (hidden on mobile) */}
              <motion.div
                key={`right-${rightIndex}`}
                className="absolute right-[2%] top-1/2 hidden w-[min(260px,22vw)] -translate-y-1/2 sm:right-[4%] sm:w-[min(280px,24vw)] lg:right-[6%] lg:block lg:w-[min(300px,26vw)]"
                style={{
                  zIndex: 1,
                  transformOrigin: 'center center',
                }}
                initial={false}
                animate={{
                  opacity: 0.9,
                  rotateY: ANGLE,
                  x: 20 - (dragOffset < 0 ? Math.max(dragOffset * 0.3, -40) : 0) + (dragOffset > 0 ? Math.min(dragOffset * 0.3, 40) : 0),
                  scale: 0.88,
                }}
                transition={SPRING}
              >
                <FeatureCard feature={features[rightIndex]!} isCenter={false} />
              </motion.div>
            </div>

            {/* Left arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous feature"
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 md:left-4 lg:left-[calc(50%-14rem)]"
            >
              <motion.div
                className="flex size-12 items-center justify-center rounded-full border border-sky-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:border-sky-200/80 hover:bg-sky-50/80"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                transition={SPRING}
              >
                <CaretLeft size={24} weight="bold" className="text-foreground" />
              </motion.div>
            </button>

            {/* Right arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next feature"
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 md:right-4 lg:right-[calc(50%-14rem)]"
            >
              <motion.div
                className="flex size-12 items-center justify-center rounded-full border border-sky-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:border-sky-200/80 hover:bg-sky-50/80"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                transition={SPRING}
              >
                <CaretRight size={24} weight="bold" className="text-foreground" />
              </motion.div>
            </button>
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
      whileHover={
        isCenter ? { y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' } : {}
      }
      transition={{ type: 'spring', stiffness: 240, damping: 28 }}
    >
      <FeatureCardContent feature={feature} isCenter={isCenter} />
    </motion.div>
  );
}

function FeatureCardContent({
  feature,
  isCenter,
}: {
  feature: (typeof features)[0];
  isCenter: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col p-4 sm:p-6 md:p-8 ${
        isCenter
          ? 'min-h-[280px] sm:min-h-[340px] md:min-h-[380px]'
          : 'min-h-[240px] sm:min-h-[280px] md:min-h-[300px]'
      }`}
    >
      <div
        className={`mb-4 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 ${
          isCenter
            ? 'flex h-20 w-20 text-4xl'
            : 'flex h-14 w-14 text-2xl sm:h-16 sm:w-16 sm:text-3xl'
        }`}
      >
        <FeatureIcon emoji={feature.icon} title={feature.title} imageFile={feature.imageFile} />
      </div>
      <h3
        className={`mb-2 font-light tracking-[-0.02em] text-foreground ${
          isCenter
            ? 'text-2xl sm:text-3xl md:text-4xl'
            : 'text-lg sm:text-xl md:text-2xl'
        }`}
      >
        {feature.title}
      </h3>
      <p
        className={`mb-4 font-light leading-[1.6] tracking-[0.02em] text-muted-foreground ${
          isCenter ? 'text-lg sm:text-xl md:text-xl' : 'text-base sm:text-lg'
        }`}
      >
        {feature.subtitle}
      </p>
      <ul className={`space-y-2 sm:space-y-3 ${feature.bullets.length === 1 ? 'mt-4' : 'mt-auto'}`}>
        {feature.bullets.map((bullet) => (
          <li
            key={bullet}
            className={`flex items-start gap-3 font-light leading-relaxed ${
              isCenter ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 tracking-[0.01em]">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
