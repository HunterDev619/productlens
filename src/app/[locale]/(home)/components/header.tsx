'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Logo } from '@/components/logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { motion } from 'framer-motion';
import { Link } from '@/libs/I18nNavigation';
import { CaretDown, ArrowSquareOut, List } from '@phosphor-icons/react';

const solutionItems = [
  {
    icon: '✏️',
    title: 'Design & Engineering',
    subtitle: 'Validate material choices during design phase. Model alternatives instantly.',
    href: '/#use-cases-product-designers-and-engineers',
    highlighted: false,
  },
  {
    icon: '🌱',
    title: 'Sustainability & ESG',
    subtitle: 'Audit-ready documentation for CSRD, ISO 14044, procurement questionnaires.',
    href: '/#use-cases-sustainability-esg-teams',
    highlighted: false,
  },
  {
    icon: '🏭',
    title: 'Manufacturers & Suppliers',
    subtitle: 'Demonstrate credentials. Stay ahead of CBAM and extended producer responsibility.',
    href: '/#use-cases-manufacturers-and-suppliers',
    highlighted: false,
  },
  {
    icon: '📋',
    title: 'Procurement & Compliance',
    subtitle: 'Screen supplier products. Compare side-by-side across lifecycle stages.',
    href: '/#use-cases-procurement-and-compliance-officers',
    highlighted: false,
  },
];

type DropdownItem = {
  icon: string;
  title: string;
  subtitle: string;
  href: string;
  highlighted?: boolean;
};

function NavDropdown({
  label,
  items,
  gridCols = 3,
  useAnchor = false,
}: {
  label: string;
  items: DropdownItem[];
  gridCols?: 2 | 3;
  useAnchor?: boolean;
}) {
  const locale = useLocale();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gridClass = gridCols === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          type="button"
          className="header-nav-text group flex items-center gap-2 text-base font-semibold tracking-wide text-black leading-7 transition-colors duration-200 hover:text-emerald-600 focus:outline-none focus-visible:outline-none"
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          {label}
          <motion.span
            className="inline-flex origin-center"
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <CaretDown
              className="size-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180 group-hover:scale-125"
              weight="bold"
            />
          </motion.span>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={8}
        data-nav-dropdown
        className={`grid w-[calc(100vw-2rem)] max-w-[80rem] gap-4 rounded-2xl border border-gray-200 bg-gray-50/95 p-4 shadow-xl backdrop-blur-sm ${gridClass}`}
      >
        {items.map((item, index) => {
          const isSectionHash = item.href.startsWith('/#features-') || item.href.startsWith('/#how-it-works-') || item.href.startsWith('/#use-cases-');
          const anchorHref = isSectionHash && useAnchor
            ? `${locale === 'en' ? '/' : `/${locale}`}${item.href.slice(1)}`
            : item.href;
          const Child = useAnchor && isSectionHash ? 'a' : Link;
          return (
          <DropdownMenuItem key={item.title} asChild className="h-full p-0 !outline-none focus:!bg-transparent focus:!text-inherit focus-visible:!bg-transparent focus-visible:!text-inherit active:!bg-transparent active:!text-inherit data-[highlighted]:!bg-transparent data-[highlighted]:!text-inherit">
            <Child href={anchorHref} className="block h-full outline-none focus:outline-none">
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: hoveredIndex === index ? -4 : 0,
                  backgroundColor: hoveredIndex === index ? '#f0fdf4' : '#ffffff',
                  boxShadow: hoveredIndex === index
                    ? '0 12px 30px -8px rgba(16,24,40,0.06)'
                    : '0 4px 8px rgba(16,24,40,0.04)',
                }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03,
                  backgroundColor: { duration: 0.16 },
                  y: { duration: 0.16 },
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileTap={{ scale: 0.98 }}
                className="group/card flex h-full min-h-[140px] w-full cursor-pointer flex-col justify-between rounded-2xl px-4 py-4 sm:min-h-[160px] sm:px-5 sm:py-5 md:min-h-[180px] md:px-6 md:py-6"
              >
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-800 transition-colors duration-200">{item.title}</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <motion.span
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500/90"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    Learn more
                    <ArrowSquareOut
                      size={18}
                      weight="bold"
                      className="transition-transform duration-300 group-hover/card:translate-x-1 group-hover/card:-translate-y-1 group-hover/card:scale-110"
                    />
                  </motion.span>
                </div>
              </motion.div>
            </Child>
          </DropdownMenuItem>
        );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
  { label: 'Solution', value: 'solution', href: '/#how-it-works', items: [] },
  { label: 'Technology', value: 'technology', href: '/#technology', items: [] },
  { label: 'Pricing', value: 'pricing', href: '/#pricing', items: [] },
  { label: 'Use Case', value: 'usecase', items: solutionItems },
  { label: 'FAQ', value: 'faq', href: '/#faq', items: [] },
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
              className="block text-base font-semibold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Solution
            </motion.span>
          </Link>
          <Link href="/#technology">
            <motion.span
              className="block text-base font-semibold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Technology
            </motion.span>
          </Link>
          <Link href="/#pricing">
            <motion.span
              className="block text-base font-semibold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Pricing
            </motion.span>
          </Link>
          <NavDropdown label="Use Case" items={solutionItems} gridCols={2} useAnchor />
          <Link href="/#faq">
            <motion.span
              className="block text-base font-semibold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
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
              className="block text-base font-semibold tracking-wide text-black leading-7 transition-colors hover:text-emerald-600"
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
                <Accordion type="single" collapsible className="w-full">
                  {mobileNavSections.map((section) => {
                    const directHref = 'href' in section ? (section as { href?: string }).href : undefined;
                    if (directHref && section.items.length === 0) {
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
                    return (
                      <AccordionItem key={section.value} value={section.value} className="border-b border-gray-200">
                        <AccordionTrigger className="px-4 py-3 text-base font-medium text-gray-800 hover:no-underline hover:bg-emerald-50 [&[data-state=open]]:bg-emerald-50">
                          {section.label}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-2">
                          <div className="flex flex-col gap-1">
                            {section.items.map((item) => (
                              <button
                                key={item.title}
                                type="button"
                                onClick={() => scrollToSection(item.href, () => setMobileOpen(false))}
                                className="text-left rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-100 hover:text-gray-900 transition-colors"
                              >
                                {item.title}
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
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
