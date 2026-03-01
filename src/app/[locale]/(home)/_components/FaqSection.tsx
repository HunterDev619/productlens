'use client';

import { useRef } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { motion, useInView } from 'framer-motion';
import { Minus, Plus } from '@phosphor-icons/react';

const faqItems = [
  {
    question: 'What types of products can ProductLens analyze?',
    answer:
      'ProductLens can analyze a wide range of consumer and industrial products including electronics, textiles, packaging, automotive parts, food products, and more. Our AI is continuously trained on new product categories to expand coverage.',
  },
  {
    question: 'How accurate are the analyses, calculations and reports?',
    answer:
      'ProductLens analyses product images using AI computer vision, advanced deep learning models and LLM with >90% recognition accuracy, and extracts structured product data with up to 70% accuracy.',
  },
  {
    question: 'Is the platform compliant with international standards?',
    answer:
      'Yes, ProductLens reports comply with ISO 14040 (Life Cycle Assessment), ISO 14067 (Carbon Footprint), and align with IPCC AR6 Synthesis Report methodologies. Our reports are audit-ready for ESG and sustainability disclosures.',
  },
  {
    question: 'Can ProductLens.ai be used for regulatory or critical decisions?',
    answer:
      'While highly useful, AI outputs should be considered advisory. Always apply professional judgement and confirm with trusted sources for critical or regulated decisions.',
  },
  {
    question: 'Is my information secure?',
    answer:
      'Yes — we implement industry-standard security measures including encryption, secure hosting and access controls to protect your data.',
  },
 
];

export function FaqSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="faq"
      ref={ref}
      className="relative overflow-hidden bg-slate-50 py-8 sm:py-10"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="mb-10 text-center text-4xl font-bold tracking-tight text-black sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          Frequently Asked Questions
        </motion.h2>

        <AccordionPrimitive.Root
          type="single"
          collapsible
          defaultValue="faq-5"
          className="space-y-5 sm:space-y-6"
        >
          {faqItems.map((item, index) => (
            <AccordionPrimitive.Item
              key={index}
              value={`faq-${index}`}
              className="group/faq overflow-hidden rounded-[1.5rem] border-2 border-emerald-400/80 bg-slate-100 shadow-[0_24px_64px_-16px_rgba(16,185,129,0.25)] ring-1 ring-emerald-200/60"
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-xl sm:text-2xl font-semibold leading-snug text-black outline-none transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:bg-slate-200/60 focus-visible:ring-2 focus-visible:ring-[#007bff]/30 data-[state=open]:bg-slate-200/50">
                  <span className="pr-2">{item.question}</span>
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#007bff]/15 to-[#007bff]/5 text-[#007bff] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110 group-hover:from-[#007bff]/20 group-hover:to-[#007bff]/10 group-data-[state=open]:rotate-90 group-data-[state=open]:from-[#007bff]/20">
                    <Plus
                      size={28}
                      weight="bold"
                      className="block transition-transform duration-300 group-data-[state=open]:hidden"
                      aria-hidden
                    />
                    <Minus
                      size={28}
                      weight="bold"
                      className="hidden transition-transform duration-300 group-data-[state=open]:block"
                      aria-hidden
                    />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="border-t border-slate-200 px-5 py-5 text-lg sm:text-xl font-normal leading-relaxed text-black">
                  {item.answer}
                </p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}
