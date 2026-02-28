'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

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

function UseCaseGridCard({ item }: { item: (typeof useCases)[0] }) {
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
      setRotateDir(enterFromLeft ? 1 : -1); // left → clockwise (1), right → counterclockwise (-1)
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
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
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
          rotateY: { duration: 1.6, ease: [0.19, 0.7, 0.25, 1] },
          filter: isHovered
            ? { duration: 0.35, delay: 1.6 }
            : { duration: 0.3, delay: 0 },
        }}
      >
        <Image
          src={useCaseImageSrc(item.imageIndex)}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          unoptimized
        />
      </motion.div>

      {/* Content overlay - appears on hover */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end bg-black/50 p-5 sm:p-6 md:p-8"
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? 'auto' : 'none',
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
            {item.title}
          </h3>
          <p className="text-base font-medium leading-relaxed text-white/95 sm:text-lg md:text-xl">
            {item.description}
          </p>
        </div>
      </motion.div>

      {/* Subtle icon badge in corner - visible before hover */}
      {!isHovered && (
        <div className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/90 text-xl shadow-sm backdrop-blur-sm">
          {item.icon}
        </div>
      )}
    </div>
  );
}

export function UseCasesSection() {
  return (
    <section
      id="use-cases"
      className="relative overflow-hidden bg-sky-50/60 py-10 sm:py-12 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-14">
          <h2 className="text-3xl font-bold tracking-[-0.03em] leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-[2.5rem]">
            Built for Teams That Take Sustainability Seriously
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {useCases.map((item) => (
            <UseCaseGridCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
