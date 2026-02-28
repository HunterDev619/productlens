'use client';

import { useState } from 'react';
import { Logo } from '@/components/logo';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { motion } from 'framer-motion';
import { Link } from '@/libs/I18nNavigation';
import { List } from '@phosphor-icons/react';

// Helper function to scroll to section or navigate
const scrollToSection = (href: string, onClose: () => void) => {
  if (typeof window === 'undefined') return;
  
  // If it's a regular page link (not a hash), navigate normally
  if (href.startsWith('/') && !href.startsWith('/#')) {
    window.location.href = href;
    return;
  }
  
  // Extract hash from href - handle different formats
  let cleanHash = href;
  if (href.startsWith('/#')) {
    cleanHash = href.slice(1); // Remove leading slash: /#features -> #features
  } else if (!href.startsWith('#')) {
    cleanHash = `#${href}`; // Add # if missing: features -> #features
  }
  
  // Update URL hash without navigating (preserve pathname for locale)
  const newUrl = window.location.pathname + cleanHash;
  window.history.pushState(null, '', newUrl);

  // Find the target element
  const targetId = cleanHash.slice(1); // Remove the #: #features -> features
  const element = document.getElementById(targetId);

  if (element) {
    const viewport = document.querySelector('[data-scroll-viewport]');
    if (viewport instanceof HTMLElement) {
      const elTop = element.getBoundingClientRect().top + viewport.scrollTop - 80;
      viewport.scrollTo({ top: Math.max(0, elTop), behavior: 'smooth' });
    } else {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  // Trigger hash change event for sections that listen to it
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  
  // Close mobile menu
  onClose();
};

const mobileNavSections = [
  { label: 'Solution', value: 'solution', href: '/#how-it-works' },
  { label: 'Technology', value: 'technology', href: '/#technology' },
  { label: 'Pricing', value: 'pricing', href: '/#pricing' },
  { label: 'Use Case', value: 'usecase', href: '/#use-cases' },
  { label: 'FAQ', value: 'faq', href: '/#faq' },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
  <motion.header
    className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
  >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-14 sm:h-16 w-full items-center justify-between md:h-[4.5rem]">
        {/* Logo - left corner */}
        <div className="shrink-0 header-logo">
          <Logo size="md" showText={true} href="/" className="transition-opacity hover:opacity-95" />
        </div>

        {/* Navigation - center (desktop) */}
        <nav className="hidden flex-1 items-center justify-center gap-6 xl:gap-8 lg:flex">
          <Link href="/#how-it-works">
            <motion.span
              className="block text-base font-bold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Solution
            </motion.span>
          </Link>
          <Link href="/#technology">
            <motion.span
              className="block text-base font-bold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Technology
            </motion.span>
          </Link>
          <Link href="/#pricing">
            <motion.span
              className="block text-base font-bold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Pricing
            </motion.span>
          </Link>
          <Link href="/#use-cases">
            <motion.span
              className="block text-base font-bold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Use Case
            </motion.span>
          </Link>
          <Link href="/#faq">
            <motion.span
              className="block text-base font-bold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              FAQ
            </motion.span>
          </Link>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('/#contact', () => {});
            }}
            className="cursor-pointer"
          >
            <motion.span
              className="block text-base font-bold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Contact US
            </motion.span>
          </a>
        </nav>

        {/* Mobile menu button */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <Link href="/auth/login">
            <motion.span
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white sm:px-6 sm:py-2.5 sm:text-base shadow-md"
              whileHover={{ scale: 1.04, boxShadow: '0 10px 32px rgba(16,185,129,0.14)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              Login
            </motion.span>
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="flex size-10 items-center justify-center rounded-lg text-gray-900 hover:bg-gray-100"
              >
                <List size={24} weight="bold" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(320px,85vw)] border-gray-200 bg-gray-50">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav className="mt-8 flex flex-col">
                {mobileNavSections.map((section) => {
                  const directHref = 'href' in section ? (section as { href?: string }).href : undefined;
                  if (directHref) {
                    return (
                      <button
                        key={section.value}
                        type="button"
                        onClick={() => scrollToSection(directHref, () => setMobileOpen(false))}
                        className="flex w-full items-center justify-between border-b border-gray-200 px-4 py-3 text-base font-medium text-gray-800 hover:bg-emerald-50"
                      >
                        {section.label}
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  type="button"
                  onClick={() => scrollToSection('/#contact', () => setMobileOpen(false))}
                  className="block w-full text-left rounded-lg px-4 py-3 text-base font-semibold text-gray-900 hover:bg-emerald-50 mt-1"
                >
                  Contact US
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Login - right corner (desktop) */}
        <div className="hidden shrink-0 items-center lg:flex">
          <motion.div>
            <Link href="/auth/login">
              <motion.span
                className="inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white sm:px-7 sm:py-3 sm:text-base shadow-md"
                initial={false}
                whileHover={{
                  scale: 1.06,
                  boxShadow: '0 12px 40px rgba(16,185,129,0.18)',
                  transition: { duration: 0.25 },
                }}
                whileTap={{
                  scale: 0.96,
                  boxShadow: '0 6px 20px rgba(16,185,129,0.12)',
                  transition: { duration: 0.12 },
                }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              >
                Login
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.header>
  );
};
