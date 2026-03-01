'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

const TECHNOLOGY_ITEMS = [
  {
    label: 'Multi-Modal AI System',
    description:
      'ProductLens is powered by a patent-pending multi-modal AI system that transforms a simple product image into sustainability intelligence and for industry compliance - in minutes.',
    image: '1.png',
  },
  {
    label: 'Computer Vision & LLMs',
    description:
      'Unlike traditional tools that rely on manual data collection, ProductLens automates expert-level analysis by combining: Computer Vision and Large Language Models (LLMs) into a single integrated sustainability intelligence and compliance engine for almost all types of consumer and industrial products.',
    image: '2.png',
  },
  {
    label: 'Deep Learning Accuracy',
    description:
      'ProductLens analyses product images using advanced deep learning models with >90% recognition accuracy, and automatically extracts structured product data with up to 70% sustainability intelligence accuracy.',
    image: '3.png',
  },
] as const;

function technologyImageSrc(filename: string): string {
  return `/technology/${encodeURIComponent(filename)}`;
}

function TechnologyGridCard({
  item,
  index,
}: {
  item: (typeof TECHNOLOGY_ITEMS)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotateDir, setRotateDir] = useState<1 | -1>(1);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const enterFromLeft = e.clientX < centerX;
      setRotateDir(enterFromLeft ? 1 : -1);
      setIsHovered(true);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative aspect-[4/3] min-h-[280px] overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:min-h-[320px] lg:min-h-[380px] ${isHovered ? 'z-20' : 'z-0'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image layer - rotates 180° on hover, then blur after rotation */}
      <motion.div
        className="absolute inset-0 origin-center bg-white"
        animate={{
          rotateY: isHovered ? rotateDir * 180 : 0,
          filter: isHovered ? 'blur(6px)' : 'blur(0px)',
        }}
        transition={{
          rotateY: { duration: 0.85, ease: [0.19, 0.7, 0.25, 1] },
          filter: isHovered
            ? { duration: 0.2, delay: 0.85 }
            : { duration: 0.2, delay: 0 },
        }}
      >
        <Image
          src={technologyImageSrc(item.image)}
          alt={item.label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          unoptimized
        />
      </motion.div>

      {/* Content overlay - appears after rotation and blur */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end bg-black/50 p-5 sm:p-6 md:p-8"
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? 'auto' : 'none',
        }}
        transition={{
          opacity: isHovered
            ? { duration: 0.25, delay: 1.05, ease: 'easeOut' }
            : { duration: 0.2, delay: 0 },
        }}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
            {item.label}
          </h3>
          <p className="text-base font-medium leading-relaxed text-white/95 sm:text-lg md:text-xl">
            {item.description}
          </p>
        </div>
      </motion.div>

      {/* Subtle badge in corner - visible before hover */}
      {!isHovered && (
        <div className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/90 text-lg font-bold text-sky-800 shadow-sm backdrop-blur-sm">
          {index + 1}
        </div>
      )}
    </div>
  );
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
            ProductLens Patent-Pending Technology
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
          {TECHNOLOGY_ITEMS.map((item, index) => (
            <TechnologyGridCard key={item.label} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
