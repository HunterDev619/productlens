'use client';

import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { Link } from '@/libs/I18nNavigation';
import { ArrowSquareOut } from '@phosphor-icons/react';

const buttonStyle =
  'group inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl border-0 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 sm:min-h-[52px] sm:w-auto sm:px-8 sm:py-3.5 sm:text-base lg:min-h-[56px] lg:px-10 lg:py-4';

function scrollToContact() {
  if (typeof window === 'undefined') return;
  const el = document.getElementById('contact');
  if (el) {
    const viewport = document.querySelector('[data-scroll-viewport]');
    if (viewport instanceof HTMLElement) {
      const elTop = el.getBoundingClientRect().top + viewport.scrollTop - 80;
      viewport.scrollTo({ top: Math.max(0, elTop), behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  window.history.pushState(null, '', window.location.pathname + '#contact');
}

export function HeroButtons() {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-start">
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          size="lg"
          className={`${buttonStyle} bg-emerald-600 hover:bg-emerald-500/90 hover:shadow-xl`}
          asChild
        >
          <Link href="/#features">
            Solution
            <ArrowSquareOut
              size={20}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          size="lg"
          className={`${buttonStyle} bg-emerald-600 hover:bg-emerald-500/90 hover:shadow-xl`}
          asChild
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToContact();
            }}
          >
             Contact Us
            <ArrowSquareOut
              size={20}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
