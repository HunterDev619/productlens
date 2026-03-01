'use client';

import Image from 'next/image';

const TECHNOLOGY_ITEM = {
  label: 'Computer Vision & LLMs',
  description: [
    'ProductLens is powered by a patent-pending AI system that transforms a simple product image into sustainability intelligence and for industry compliance - in minutes.',
    'ProductLens automates expert-level analysis by combining: Computer Vision and Large Language Models (LLMs) into a single integrated sustainability intelligence and compliance engine for almost all types of consumer and industrial products.',
    'ProductLens analyses product images using AI computer vision, advanced deep learning models and LLM with >90% recognition accuracy, and extracts structured product data with up to 70% accuracy.*',
  ],
  image: '2.png',
} as const;

function technologyImageSrc(filename: string): string {
  return `/technology/${encodeURIComponent(filename)}`;
}

export function TechnologySection() {
  return (
    <section
      id="technology"
      className="relative overflow-hidden bg-sky-50/60 py-10 sm:py-12 scroll-mt-24"
    >
      <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-14">
          <h2 className="text-3xl font-bold tracking-[-0.03em] leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-[2.5rem]">
            Patent-Pending AI Technology
          </h2>
          <p className="mt-3 text-lg font-medium text-foreground/90 sm:text-xl md:text-[1.25rem]">
            AI-Deep Tech That Deliver Product Sustainability Intelligence & Compliance Reports
          </p>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left - content */}
          <div className="flex flex-1 flex-col justify-center rounded-[1.25rem] border border-gray-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-8 lg:min-w-[45%]">
            <h3 className="text-xl font-bold leading-tight text-foreground sm:text-2xl md:text-3xl">
              {TECHNOLOGY_ITEM.label}
            </h3>
            <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5">
              {TECHNOLOGY_ITEM.description.map((para, i) => (
                <p
                  key={i}
                  className="text-base font-medium leading-relaxed text-zinc-700 sm:text-lg md:text-xl"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Right - image: position matches left content (top-align), 20px from right edge */}
          <div className="relative flex flex-1 items-start justify-end pr-5 lg:min-w-[55%]">
            <div className="relative inline-block max-w-full rounded-[1.25rem] border-2 border-gray-300 bg-white p-[30px] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
              <Image
                src={technologyImageSrc(TECHNOLOGY_ITEM.image)}
                alt={TECHNOLOGY_ITEM.label}
                width={1200}
                height={800}
                className="block max-w-full h-auto object-contain"
                sizes="(max-width: 1024px) 100vw, 55vw"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
