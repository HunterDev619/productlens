'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Outfit } from 'next/font/google';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

const steps = [
  {
    id: 'upload',
    title: 'Upload',
    description:
      'Simply drag and drop a product image (JPG, JPEG, or PNG). No technical data sheets required. Our computer vision engine does the rest.',
  },
  {
    id: 'analyse',
    title: 'Analyse',
    description:
      'ProductLens identifies materials, components, and weight distribution using patent-pending AI vision analysis. It cross-references trusted open-source environmental databases globally to generate accurate carbon emission factors.',
  },
  {
    id: 'report',
    title: 'Report',
    description:
      'Receive a comprehensive, ISO & IPCC-compliant report covering lifecycle emissions, environmental impact analyses, supply-chain traceability, decarbonisation priorities, and regulatory indicators — ready to share with stakeholders, regulators, or procurement teams.',
  },
];

// Image arrays for each step - these will cycle every 4 seconds
const STEP_IMAGES = {
  upload: ['/assets/analyse/upload1.jpg', '/assets/analyse/upload2.jpg'],
  analyse: ['/assets/analyse/analyse1.jpg', '/assets/analyse/analyse2.jpg'],
  report: ['/assets/analyse/report1.jpg', '/assets/analyse/report2.jpg'],
};

const DEFAULT_IMAGES = [
  '/assets/analyse/upload.png',
  '/assets/analyse/analyse.png',
  '/assets/analyse/report.png',
];

const STEP_IDS = ['upload', 'analyse', 'report'] as const;

const defaultImages: string[] = [];

export function HowItWorksSection({ images = defaultImages }: { images?: string[] }) {
  // images prop is kept for API compatibility but we use STEP_IMAGES instead
  void images;
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const handleStepChange = (newIndex: number) => {
    // Always flow from right to left
    setActiveIndex(newIndex);
    setImageIndex(0); // Reset image index when changing steps
  };

  // Cycle through images every 4 seconds for the active step
  useEffect(() => {
    const currentStepId = steps[activeIndex]?.id;
    if (!currentStepId) {
      return undefined;
    }

    const imageArray = STEP_IMAGES[currentStepId as keyof typeof STEP_IMAGES];
    if (!imageArray || imageArray.length === 0) {
      return undefined;
    }

    // Reset to first image when step changes
    setImageIndex(0);

    // Only set up interval if there are multiple images to cycle through
    if (imageArray.length > 1) {
      const interval = setInterval(() => {
        setImageIndex((prev) => {
          return (prev + 1) % imageArray.length;
        });
      }, 4000); // 4 seconds

      return () => {
        clearInterval(interval);
      };
    }

    return undefined;
  }, [activeIndex]);

  useEffect(() => {
    const readHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const match = hash.match(/^#how-it-works-(.+)$/);
      if (match) {
        const slug = match[1];
        const idx = STEP_IDS.indexOf(slug as (typeof STEP_IDS)[number]);
        if (idx >= 0 && idx !== activeIndex) {
          setActiveIndex(idx);
          setImageIndex(0); // Reset image index when changing steps
          const scrollToSection = () => {
            const el = document.getElementById('how-it-works');
            if (!el) {
              return;
            }
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
  }, [activeIndex]);

  // Get the current image based on active step and image index
  const getCurrentImage = () => {
    // Get the current step ID based on activeIndex
    const currentStepId = steps[activeIndex]?.id;

    // If no step ID, return default for index 0
    if (!currentStepId) {
      return DEFAULT_IMAGES[activeIndex] ?? DEFAULT_IMAGES[0] ?? '/assets/analyse/upload1.jpg';
    }

    // Get the image array for this specific step
    const imageArray = STEP_IMAGES[currentStepId as keyof typeof STEP_IMAGES];

    // If we have images for this step, use them
    if (imageArray && imageArray.length > 0) {
      const safeIndex = imageIndex % imageArray.length;
      return imageArray[safeIndex] ?? imageArray[0] ?? '';
    }

    // Fallback to default images based on active index
    if (activeIndex >= 0 && activeIndex < DEFAULT_IMAGES.length) {
      return DEFAULT_IMAGES[activeIndex] ?? '';
    }

    // Final fallback
    return DEFAULT_IMAGES[0] ?? '/assets/analyse/upload1.jpg';
  };

  const currentImage = getCurrentImage();
  const currentStep = steps[activeIndex];

  return (
    <section id="how-it-works" className={`scroll-mt-24 bg-slate-50/80 py-20 sm:py-24 ${outfit.className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-foreground sm:text-3xl md:text-4xl lg:text-[2.5rem]">
            Three Steps to a Complete Sustainability Report
          </h2>
        </div>

        {/* 3 buttons */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10 sm:gap-3">
          {steps.map((step, index) => (
            <motion.button
              key={step.id}
              type="button"
              onClick={() => handleStepChange(index)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 sm:px-6 sm:py-3 sm:text-base ${
                activeIndex === index
                  ? 'bg-[#003328] text-white shadow-lg'
                  : 'bg-white text-foreground shadow-sm ring-1 ring-gray-200 hover:ring-emerald-400/25'
              }`}
            >
              {step.title}
            </motion.button>
          ))}
        </div>

        {/* Left: description | Right: image */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left - content with animation */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-light tracking-[-0.02em] text-foreground sm:text-3xl md:text-4xl">
                  {currentStep?.title ?? steps[activeIndex]?.title ?? ''}
                </h3>
                <p className="text-lg leading-[1.7] font-light tracking-[0.02em] text-muted-foreground sm:text-xl md:text-2xl">
                  {currentStep?.description ?? steps[activeIndex]?.description ?? ''}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right - image (full fit, no cropping) */}
          <div className="relative flex-1 overflow-hidden lg:min-w-[55%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${imageIndex}`}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                }}
                className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-white bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.08)]"
              >
                {currentImage && (
                  <Image
                    src={currentImage}
                    alt={`${currentStep?.title ?? steps[activeIndex]?.title ?? 'Step'} ${imageIndex + 1} - ProductLens`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority={activeIndex === 0}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
