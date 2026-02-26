'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';

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

export function TechnologySection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const comboRef = useRef<HTMLDivElement>(null);

  const selected = TECHNOLOGY_ITEMS[selectedIndex]!;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <section
      id="technology"
      className="relative overflow-hidden bg-sky-50/60 py-20 sm:py-24 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.03em] leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3rem]">
            ProductLens Patent-Pending Technology
          </h2>
          <p className="mt-4 text-xl font-medium text-muted-foreground sm:text-2xl">
            See a Product. Understand Its Full Impact.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12">
          {/* Left: combobox + description */}
          <div className="flex flex-col gap-6">
            <div className="relative" ref={comboRef}>
              <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Select technology topic"
                className="flex w-full items-center justify-between rounded-xl border border-sky-200 bg-white px-4 py-3.5 text-left shadow-sm transition-colors hover:border-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <span className="font-medium text-foreground">{selected.label}</span>
                <CaretDown
                  size={20}
                  weight="bold"
                  className={`shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.ul
                    role="listbox"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-auto rounded-xl border border-sky-200 bg-white py-2 shadow-lg"
                  >
                    {TECHNOLOGY_ITEMS.map((item, i) => (
                      <li key={item.label} role="option" aria-selected={i === selectedIndex}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIndex(i);
                            setIsOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-sky-50 ${
                            i === selectedIndex ? 'bg-sky-50 font-medium text-sky-700' : 'text-foreground'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-sky-100 bg-white/90 p-6 shadow-sm sm:p-8"
            >
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {selected.description}
              </p>
            </motion.div>
          </div>

          {/* Right: image according to selected content */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute inset-0"
              >
                <img
                  src={technologyImageSrc(selected.image)}
                  alt={selected.label}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
