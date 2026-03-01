'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const steps = [
  {
    id: 'upload',
    title: 'Upload',
    description:
      'Simply drag and drop a product image (JPG, JPEG, or PNG). No technical data sheets required.',
  },
  {
    id: 'analyse',
    title: 'Analyse',
    description:
      'With patent-pending AI vision analysis, ProductLens decodes product images into its full technical and sustainability profile, including specifications, material breakdown, carbon emissions, environmental impact, circularity potential with supply-chain mapping',
  },
  {
    id: 'report',
    title: 'Report',
    description:
      'Receive a comprehensive, ISO & IPCC-compliant report covering lifecycle emissions, environmental impact analyses, supply-chain traceability, decarbonisation priorities, and regulatory indicators — ready to share with stakeholders, regulators, or procurement teams.',
  },
];

// Fallback image arrays when images prop is empty or doesn't match
const STEP_IMAGES_FALLBACK: Record<string, string[]> = {
  upload: ['/assets/analyse/upload1.jpg', '/assets/analyse/upload2.jpg', '/assets/analyse/upload.png'],
  analyse: ['/assets/analyse/analyse1.jpg', '/assets/analyse/analyse2.jpg', '/assets/analyse/analyse.png'],
  report: ['/assets/analyse/report1.jpg', '/assets/analyse/report2.jpg', '/assets/analyse/report.png'],
};

const DEFAULT_IMAGES = [
  '/assets/analyse/upload.png',
  '/assets/analyse/analyse.png',
  '/assets/analyse/report.png',
];

const STEP_IDS = ['upload', 'analyse', 'report'] as const;

const defaultImages: string[] = [];

function buildStepImages(images: string[]): Record<string, string[]> {
  const result: { upload: string[]; analyse: string[]; report: string[] } = {
    upload: [],
    analyse: [],
    report: [],
  };
  for (const img of images) {
    const name = img.toLowerCase().replace(/^.*\//, '');
    if (name.includes('upload')) result.upload.push(img);
    else if (name.includes('analyse') || name.includes('analyze')) result.analyse.push(img);
    else if (name.includes('report')) result.report.push(img);
  }
  for (const stepId of STEP_IDS) {
    if (result[stepId]!.length === 0) result[stepId] = STEP_IMAGES_FALLBACK[stepId] ?? [];
  }
  return result;
}

export function HowItWorksSection({ images = defaultImages }: { images?: string[] }) {
  const stepImages = useMemo(() => buildStepImages(images ?? []), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleStepChange = (newIndex: number) => {
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const readHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const match = hash.match(/^#how-it-works-(.+)$/);
      if (match) {
        const slug = match[1];
        const idx = STEP_IDS.indexOf(slug as (typeof STEP_IDS)[number]);
        if (idx >= 0 && idx !== activeIndex) {
          setActiveIndex(idx);
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

  // Single image per step (no flow/cycling)
  const getCurrentImage = () => {
    const currentStepId = steps[activeIndex]?.id;
    if (!currentStepId) {
      return DEFAULT_IMAGES[activeIndex] ?? DEFAULT_IMAGES[0] ?? '/assets/analyse/upload1.jpg';
    }
    const imageArray = stepImages[currentStepId];
    if (imageArray && imageArray.length > 0) {
      return imageArray[0] ?? '';
    }
    if (activeIndex >= 0 && activeIndex < DEFAULT_IMAGES.length) {
      return DEFAULT_IMAGES[activeIndex] ?? '';
    }
    return DEFAULT_IMAGES[0] ?? '/assets/analyse/upload1.jpg';
  };

  const currentImage = getCurrentImage();
  const currentStep = steps[activeIndex];

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-slate-50/80 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
          <h2 className="text-3xl font-bold tracking-[-0.03em] leading-[1.2] text-foreground  sm:text-1xl md:text-1.5xl lg:text-[2.7rem]">
            Our three solutions
          </h2>
        </div>

        {/* 3 buttons - hover shows active/clicked style, increased spacing */}
        <div className="mb-8 flex flex-wrap justify-center gap-6 sm:mb-10 sm:gap-8">
          {steps.map((step, index) => (
            <motion.button
              key={step.id}
              type="button"
              onClick={() => handleStepChange(index)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 sm:px-6 sm:py-3 sm:text-base ${
                activeIndex === index
                  ? 'bg-[#1E6F40] text-white'
                  : 'bg-[#F0F0F0] text-[#6B7280] hover:bg-[#1E6F40] hover:text-white'
              }`}
            >
              {step.title}
            </motion.button>
          ))}
        </div>

        {/* Left: description | Right: image */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-16">
          {/* Left - bordered box with subtle border/shadow */}
          <div className="relative flex aspect-video flex-1 overflow-hidden rounded-[1.25rem] border border-gray-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-8 lg:min-w-[45%]">
            <div className="relative flex h-full flex-col justify-center space-y-6 sm:space-y-8">
              <h3 className="text-3xl font-semibold tracking-[-0.03em] leading-[1.2] text-left text-foreground sm:text-1xl md:text-1.5xl lg:text-[1.8rem]">
                {currentStep?.title ?? steps[activeIndex]?.title ?? ''}
              </h3>
              <p className="text-lg font-semibold leading-[1.75] tracking-[0.01em] text-zinc-600 sm:text-xl">
                {currentStep?.description ?? steps[activeIndex]?.description ?? ''}
              </p>
            </div>
          </div>

          {/* Right - image box sizes to original image, 30px padding, border */}
          <div className="relative flex flex-1 items-start justify-center lg:min-w-[55%]">
            <div className="relative inline-block max-w-full rounded-[1.25rem] border-2 border-gray-300 bg-white p-[30px] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
              {currentImage && (
                <Image
                  src={currentImage}
                  alt={`${currentStep?.title ?? steps[activeIndex]?.title ?? 'Step'} - ProductLens`}
                  width={1200}
                  height={800}
                  className="block max-w-full h-auto object-contain"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority={activeIndex === 0}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
