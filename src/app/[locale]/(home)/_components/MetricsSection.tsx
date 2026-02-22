'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const metrics = [
  {
    value: 24,
    suffix: ' kg',
    label: 'Example total lifecycle emissions (CO₂e) calculated for a VIHALS chair',
    detail: 'Steel + polypropylene, 10-year lifespan',
  },
  {
    value: 62.5,
    suffix: '%',
    label: 'of emissions traced to manufacturing',
    detail: 'Identified as hotspot in minutes',
  },
  {
    value: 50,
    suffix: '%',
    label: 'reduction potential identified through AI-generated decarbonisation strategy',
    detail: null,
  },
  {
    value: 12,
    suffix: ' kg',
    label: 'savings per unit (CO₂e) achievable through priority actions',
    detail: null,
  },
];

function AnimatedCounter({
  value,
  suffix,
  trigger,
  delay = 0,
}: {
  value: number;
  suffix: string;
  trigger: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (trigger <= 0) return;
    setCount(0);

    let cancelled = false;
    let rafId = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeoutId: any;

    const runAnimation = () => {
      const duration = 1800;
      const startTime = performance.now();

      const animate = (now: number) => {
        if (cancelled) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (progress === 1 ? 1 : Math.pow(2, -10 * progress));
        const current = value * eased;

        if (progress >= 1) {
          setCount(value);
        } else {
          setCount(isDecimal ? Math.round(current * 10) / 10 : Math.round(current));
          rafId = requestAnimationFrame(animate);
        }
      };

      rafId = requestAnimationFrame(animate);
    };

    timeoutId = window.setTimeout(runAnimation, delay);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [trigger, value, isDecimal, delay]);

  const display = isDecimal ? count.toFixed(1) : Math.round(count).toString();
  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export function MetricsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [clickTriggers, setClickTriggers] = useState<Record<number, number>>({});

  return (
    <section
      id="metrics"
      ref={ref}
      className="py-20 sm:py-24 bg-gradient-to-br from-[#0066ff]/5 via-white to-[#00d4aa]/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-heading-xl font-bold text-foreground">
            The Numbers Behind Every Report
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              onMouseEnter={() => setClickTriggers((prev) => ({ ...prev, [index]: (prev[index] ?? 0) + 1 }))}
              onClick={() => setClickTriggers((prev) => ({ ...prev, [index]: (prev[index] ?? 0) + 1 }))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setClickTriggers((prev) => ({ ...prev, [index]: (prev[index] ?? 0) + 1 }))}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff]/5 to-[#00d4aa]/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <p className="text-2xl font-bold text-[#0066ff] sm:text-3xl md:text-4xl">
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    trigger={isInView ? (clickTriggers[index] ?? 0) + 1 : 0}
                    delay={clickTriggers[index] ? 0 : index * 120}
                  />
                </p>
                <p className="mt-2 text-body font-medium text-foreground leading-snug">
                  {metric.label}
                </p>
                {metric.detail && (
                  <p className="mt-1 text-sm text-muted-foreground">{metric.detail}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-10 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Results are product-specific. Upload your product to generate your analysis.
        </motion.p>
      </div>
    </section>
  );
}
