'use client';

import { useRef } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { motion, useInView } from 'framer-motion';
import { Minus, Plus } from '@phosphor-icons/react';

const faqItems = [
  {
    question: 'What types of products can Product Lens analyze?',
    answer:
      'Product Lens can analyze a wide range of consumer and industrial products including electronics, textiles, packaging, automotive parts, food products, and more. Our AI is continuously trained on new product categories to expand coverage.',
  },
  {
    question: 'How accurate is the carbon footprint calculation?',
    answer:
      'Our carbon calculations use verified emission factors from reputable databases including IPCC, EPA, and industry-specific LCA databases. Accuracy typically ranges from 85-95% depending on product complexity and data availability. All sources are cited in reports.',
  },
  {
    question: 'Is the platform compliant with international standards?',
    answer:
      'Yes, Product Lens reports comply with ISO 14040 (Life Cycle Assessment), ISO 14067 (Carbon Footprint), and align with IPCC AR6 Synthesis Report methodologies. Our reports are audit-ready for ESG and sustainability disclosures.',
  },
  {
    question: 'Can I integrate Product Lens with my existing systems?',
    answer:
      'Professional and Enterprise plans include API access for seamless integration with your ERP, PLM, or sustainability management systems. We also offer custom integrations and webhooks for automated workflows.',
  },
  {
    question: 'How does the EDG grant work for Singapore SMEs?',
    answer:
      'The Enterprise Development Grant (EDG) can support up to 50% of qualifying costs for digital transformation projects. Product Lens qualifies as an eligible solution. Our team can assist with grant application documentation and requirements.',
  },
  {
    question: 'What kind of support do you provide?',
    answer:
      'We offer tiered support based on your plan: email support for Starter, priority support for Professional, and dedicated account management for Enterprise customers. All plans include comprehensive documentation and training resources.',
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
