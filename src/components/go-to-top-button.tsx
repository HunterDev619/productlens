'use client';

import { ArrowUp } from '@phosphor-icons/react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/utils';
import { Button } from './ui';

type GoToTopButtonProps = {
  /**
   * The scroll threshold (in pixels) at which the button becomes visible
   * @default 400
   */
  threshold?: number;
  /**
   * Additional CSS classes to apply to the button
   */
  className?: string;
  /**
   * Smooth scroll behavior
   * @default true
   */
  smooth?: boolean;
};

export function GoToTopButton({
  threshold = 400,
  className,
  smooth = true,
}: GoToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const toggleVisibility = () => {
      const shouldShow = window.scrollY > threshold;
      setIsVisible(shouldShow);
    };

    // Check initial scroll position and add listener
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 right-0 left-0 z-[100] h-1 origin-left bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500"
        style={{ scaleX }}
      />

      {/* Go to Top Button */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed bottom-8 right-8 z-50',
            className,
          )}
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            variant="primary"
            className="group relative h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            aria-label="Scroll to top"
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ArrowUp
                size={24}
                weight="bold"
                className="transition-transform group-hover:scale-110"
              />
            </motion.div>

            {/* Ripple effect */}
            <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:animate-ping" />
          </Button>

          {/* Tooltip */}
          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-zinc-50 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
            Back to top
          </span>
        </motion.div>
      )}
    </>
  );
}
