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
      'Cradle to Grave',
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
    title: 'Supply-Chain Visualisation',
    subtitle: 'Global  Mapping',
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
      'Export PDF Reports ',
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

const ANGLE = 60;
const SPRING = { type: 'spring' as const, stiffness: 180, damping: 26 };
const FLOW_EASE = [0.25, 0.46, 0.45, 0.94] as const; // Soft ease-out
const FLOW_DURATION = 0.6;
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
    if (offset > DRAG_THRESHOLD) goNext();
    else if (offset < -DRAG_THRESHOLD) goPrev();
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
      className="relative overflow-x-hidden overflow-y-visible bg-slate-100/80 py-10 sm:py-12 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h3 className="text-2xl font-bold tracking-[-0.02em] leading-tight text-black sm:text-3xl md:text-3xl lg:text-4xl xl:text-[2.1rem]">
          Simplify Product Compliance & Sustainability Intelligence
          </h3>
        </div>

        {/* Active feature title above the cards (matches section style) */}
        <div className="mx-auto mb-8 max-w-4xl text-center">
          {/* <h4 className="text-xl font-semibold tracking-[-0.02em] leading-tight text-foreground sm:text-2xl md:text-2xl lg:text-3xl">
            {features[activeIndex]?.title}
          </h4> */}
        </div>

        <div className="relative left-1/2 flex min-h-[min(80vh,44rem)] w-screen min-w-0 -translate-x-1/2 touch-none select-none items-center justify-center">
          <div
            className="relative flex w-full cursor-grab active:cursor-grabbing items-center justify-center"
            style={{ perspective: 1500, transformStyle: 'preserve-3d' }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onTouchStart={(e) => handleDragStart(e.touches[0]!.clientX)}
          >
            <div
              className="relative flex w-full min-w-0 items-center justify-between gap-0"
              style={{
                transform: `translateX(${dragOffset}px)`,
                transition: isDragging ? 'none' : 'transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Left card - pushed further left, gap from center, flowing animation */}
              <motion.div
                key={`left-${leftIndex}`}
                className="hidden w-fit max-w-[26rem] shrink-0 lg:block"
                style={{ zIndex: 1, transformOrigin: 'center center' }}
                initial={false}
                animate={{
                  x: -(dragOffset > 0 ? Math.min(dragOffset * 0.3, 40) : 0) + (dragOffset < 0 ? Math.max(dragOffset * 0.3, -40) : 0),
                  opacity: 0.9,
                  rotateY: ANGLE,
                  scale: 1,
                }}
                transition={SPRING}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`left-content-${leftIndex}`}
                    className="relative w-full"
                    initial={{ opacity: 0, x: direction === 1 ? 180 : -180 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: direction === 1 ? -180 : 180,
                      transition: { duration: FLOW_DURATION * 0.6, ease: FLOW_EASE },
                    }}
                    transition={{ duration: FLOW_DURATION, ease: FLOW_EASE }}
                  >
                    <FeatureCard feature={features[leftIndex]!} isCenter />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Left button | Center card | Right button - edges align: center left = left btn right, center right = right btn left */}
              <div className="relative z-10 mx-4 flex shrink-0 items-center gap-0 sm:mx-6 md:mx-8">
                {/* Left arrow - center's left edge matches this button's right edge, hidden on mobile */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next feature"
                  className="relative z-20 hidden shrink-0 lg:block"
                >
                  <motion.div
                    className="flex size-12 items-center justify-center rounded-full border border-slate-300 bg-slate-100 shadow-lg backdrop-blur-sm transition-colors hover:border-slate-400/80 hover:bg-slate-200/80"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    transition={SPRING}
                  >
                    <CaretLeft size={24} weight="bold" className="text-foreground" />
                  </motion.div>
                </button>

                {/* Center card - left edge touches left button's right, right edge touches right button's left */}
                <div className="w-fit max-w-[26rem] shrink-0 overflow-visible">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`center-${centerIndex}`}
                    className="relative w-full"
                    style={{ transformOrigin: 'center center' }}
                    initial={{
                      opacity: 0,
                      x: direction === 1 ? 200 : -200,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      x: dragOffset * 0.5,
                      scale: 1.08,
                    }}
                    exit={{
                      opacity: 0,
                      x: direction === 1 ? -200 : 200,
                      scale: 0.97,
                      transition: { duration: FLOW_DURATION * 0.65, ease: FLOW_EASE },
                    }}
                    transition={{
                      duration: FLOW_DURATION,
                      ease: FLOW_EASE,
                      opacity: { duration: FLOW_DURATION * 0.7 },
                    }}
                  >
                    <FeatureCard feature={features[centerIndex]!} isCenter />
                  </motion.div>
                </AnimatePresence>
                </div>

                {/* Right arrow - center's right edge matches this button's left edge, hidden on mobile */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous feature"
                  className="relative z-20 hidden shrink-0 lg:block"
                >
                  <motion.div
                    className="flex size-12 items-center justify-center rounded-full border border-slate-300 bg-slate-100 shadow-lg backdrop-blur-sm transition-colors hover:border-slate-400/80 hover:bg-slate-200/80"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    transition={SPRING}
                  >
                    <CaretRight size={24} weight="bold" className="text-foreground" />
                  </motion.div>
                </button>
              </div>

              {/* Right card - pushed right, gap from center, flowing animation */}
              <motion.div
                key={`right-${rightIndex}`}
                className="hidden w-fit max-w-[26rem] shrink-0 lg:block"
                style={{ zIndex: 1, transformOrigin: 'center center' }}
                initial={false}
                animate={{
                  x: (dragOffset < 0 ? Math.max(dragOffset * 0.3, -40) : 0) - (dragOffset > 0 ? Math.min(dragOffset * 0.3, 40) : 0),
                  opacity: 0.9,
                  rotateY: -ANGLE,
                  scale: 1,
                }}
                transition={SPRING}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`right-content-${rightIndex}`}
                    className="relative w-full"
                    initial={{ opacity: 0, x: direction === 1 ? 180 : -180 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: direction === 1 ? -180 : 180,
                      transition: { duration: FLOW_DURATION * 0.6, ease: FLOW_EASE },
                    }}
                    transition={{ duration: FLOW_DURATION, ease: FLOW_EASE }}
                  >
                    <FeatureCard feature={features[rightIndex]!} isCenter />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
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
      className={`group/feature overflow-hidden rounded-[1.5rem] border-2 border-emerald-400/80 shadow-[0_24px_64px_-16px_rgba(16,185,129,0.25)] ring-1 ring-emerald-200/60 ${
        isCenter ? 'bg-slate-100' : 'bg-slate-100/95 backdrop-blur-sm'
      }`}
      whileHover={
        isCenter ? { y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' } : {}
      }
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
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
      className={`flex flex-col p-4 sm:p-6 md:p-8 ${
        isCenter ? 'min-h-[260px]' : 'min-h-[220px]'
      }`}
    >
      <div
        className={`mb-4 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 ${
          isCenter
            ? 'flex h-20 w-20 text-4xl'
            : 'flex h-14 w-14 text-2xl sm:h-16 sm:w-16 sm:text-3xl'
        }`}
      >
        <FeatureIcon emoji={feature.icon} title={feature.title} imageFile={feature.imageFile} />
      </div>
      <h3
        className={`mb-2 font-semibold tracking-[-0.02em] text-black ${
          isCenter
            ? 'text-2xl sm:text-3xl md:text-4xl'
            : 'text-lg sm:text-xl md:text-2xl'
        }`}
      >
        {feature.title}
      </h3>
      <p
        className={`mb-4 font-medium leading-[1.6] tracking-[0.02em] text-gray-800 ${
          isCenter ? 'text-lg sm:text-xl md:text-xl' : 'text-base sm:text-lg'
        }`}
      >
        {feature.subtitle}
      </p>
      <ul className={`space-y-2 sm:space-y-3 ${feature.bullets.length === 1 ? 'mt-4' : 'mt-auto'}`}>
        {feature.bullets.map((bullet) => (
          <li
            key={bullet}
            className={`flex items-start gap-3 font-medium leading-relaxed ${
              isCenter ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="text-black tracking-[0.01em]">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
