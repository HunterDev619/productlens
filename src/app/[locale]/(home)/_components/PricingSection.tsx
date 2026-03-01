'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from '@/libs/I18nNavigation';

const plans = [
  {
    name: 'Professional',
    badge: 'Most Popular',
    description: '',
    features: [
      '500 product analyses/month',
      'Comprehensive sustainability reports',
      'Supply-chain mapping',
      'Decarbonisation roadmaps',
      'Printable PDF download',
    ],
  },
  {
    name: 'Enterprise',
    badge: null,
    description: '',
    features: [
      'Unlimited analyses',
      'White-label solution',
      'Comprehensive sustainability reports',
      'Supply-chain mapping',
      'Decarbonisation roadmaps',
      'Printable PDF download',
      'Upload and analyse CSV files',
      'EPD-ready output',
      'Online technical support',
    ],
  },
];

export function PricingSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 py-8 sm:py-10"
    >
      <div className="mx-auto flex max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[80px] flex-1 flex-col justify-center">
          <div className="flex flex-1 basis-0 items-end" aria-hidden />
          <motion.div
            className="mx-auto max-w-3xl shrink-0 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
              Flexible Pricing Plans
            </h2>
          </motion.div>
          <div className="flex flex-1 basis-0 items-start" aria-hidden />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
          {plans.map((plan, index) => {
            const isPopular = plan.badge != null;
            return (
              <motion.div
                key={plan.name}
                className="group/pricing relative flex flex-col rounded-[1.5rem] border-2 border-emerald-400/80 bg-slate-100 p-5 shadow-[0_24px_64px_-16px_rgba(16,185,129,0.25)] ring-1 ring-emerald-200/60 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: 0.05 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -2,
                  boxShadow: isPopular ? '0 12px 28px rgba(16,185,129,0.14)' : '0 8px 24px rgba(15,23,42,0.08)',
                }}
                whileTap={{ scale: 0.99 }}
              >
                {isPopular && (
                  <div className="pointer-events-none absolute inset-x-0 -top-3 flex justify-center">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#0066ff] to-[#00d4aa] px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-white shadow">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      {plan.description}
                    </p>
                  )}
                </div>

                <ul className="mb-4 space-y-4 text-base sm:text-lg">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                        ✓
                      </span>
                      <span className="font-medium text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  <Link href="/#contact">
                    <motion.button
                      type="button"
                      className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#0066ff] to-[#00d4aa] px-5 py-3 text-base font-semibold text-white shadow transition-colors hover:from-[#0052cc] hover:to-[#00c39a] sm:text-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.14 }}
                    >
                      Contact for Pricing
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

