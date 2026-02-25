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

const platformItems = [
  {
    icon: '⏱️',
    title: 'LCA Compliance',
    subtitle: 'LCA Compliance Used to Take Months. Now It Takes Minutes. Traditional lifecycle assessments are expensive, slow, and require specialised consultants.',
    href: '#problem',
    highlighted: true,
  },
  {
    icon: '📊',
    title: 'Product Analysis',
    subtitle: 'Transform product images into lifecycle carbon assessment with AI-powered computer vision.',
    href: '/apps/analysis',
    highlighted: false,
  },
  {
    icon: '🌍',
    title: 'Supply Chain Mapping',
    subtitle: 'Visualise full supply chain pathways and environmental risks on an interactive map.',
    href: '#features',
    highlighted: false,
  },
  {
    icon: '📋',
    title: 'Compliance Reports',
    subtitle: 'Generate audit-ready documentation for ISO, CSRD, and procurement requirements.',
    href: '#features',
    highlighted: false,
  },
];

const howItWorksItems = [
  {
    icon: '📤',
    title: 'Upload',
    subtitle: 'Drag and drop a product image (JPG, PNG). No technical data sheets or BOM required.',
    href: '/#how-it-works-upload',
    highlighted: false,
  },
  {
    icon: '🔬',
    title: 'Analyse',
    subtitle: 'AI identifies materials, components, and weight distribution. Cross-references environmental databases.',
    href: '/#how-it-works-analyse',
    highlighted: false,
  },
  {
    icon: '📄',
    title: 'Report',
    subtitle: 'Receive ISO & IPCC-compliant report with lifecycle emissions, decarbonisation priorities, and regulatory indicators.',
    href: '/#how-it-works-report',
    highlighted: false,
  },
];

const featuresItems = [
  {
    icon: '📊',
    title: 'Product Analysis',
    subtitle: 'Component breakdown, material identification, carbon emission factors from Ecoinvent v3.9.',
    href: '/#features-ai-product-analysis',
    highlighted: false,
  },
  {
    icon: '🌱',
    title: 'ISO 14040 / 14044 ',
    subtitle: 'Cradle-to-grave CO₂e analysis. ISO 14040/14044 and IPCC AR6 aligned.',
    href: '/#features-lifecycle-assessment-lca',
    highlighted: false,
  },
  {
    icon: '🔬',
    title: 'Environmental Indicators',
    subtitle: 'GWP100, water consumption, land use, biodiversity impact.',
    href: '/#features-environmental-indicators',
    highlighted: false,
  },
  {
    icon: '🗺️',
    title: 'Supply-Chain Traceability',
    subtitle: 'Geographic mapping, transport emissions, CBAM-ready reporting.',
    href: '/#features-supply-chain-traceability',
    highlighted: false,
  },
  {
    icon: '📉',
    title: 'Decarbonisation Strategy',
    subtitle: 'Prioritised roadmap with CO₂e savings potential and implementation feasibility.',
    href: '/#features-decarbonisation-strategy',
    highlighted: false,
  },
  {
    icon: '📚',
    title: 'References & Regulatory Library',
    subtitle: 'Built on Trusted Standards. More than 50 databases linked with ProductLens.ai firmly grounded in globally recognised databases and regulatory frameworks.',
    href: '/#features-references-regulatory-library',
    highlighted: false,
  },
];

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
          className="header-nav-text group flex items-center gap-2 text-base font-bold tracking-tight text-white transition-colors duration-200 hover:text-[#bbf7d0] focus:outline-none focus-visible:outline-none focus:text-white active:text-white"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
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
                  y: hoveredIndex === index ? -6 : 0,
                  backgroundColor: hoveredIndex === index ? '#ecfdf5' : '#ffffff',
                  boxShadow: hoveredIndex === index
                    ? '0 20px 40px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(167,243,208,0.5)'
                    : '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.05,
                  backgroundColor: { duration: 0.2 },
                  y: { duration: 0.2 },
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileTap={{ scale: 0.98 }}
                className="group/card flex h-full min-h-[140px] w-full cursor-pointer flex-col justify-between rounded-2xl px-4 py-4 sm:min-h-[160px] sm:px-5 sm:py-5 md:min-h-[180px] md:px-6 md:py-6"
              >
                <div className="flex-1">
                  <p className="text-lg font-bold !text-gray-900 transition-colors duration-200">{item.title}</p>
                  <p className={`mt-3 text-base leading-relaxed transition-colors duration-200 ${hoveredIndex === index ? '!text-gray-800' : '!text-gray-600'}`}>{item.subtitle}</p>
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
  
  // Update URL hash without navigating
  window.history.pushState(null, '', cleanHash);
  
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
  { 
    label: 'Platform', 
    value: 'platform',
    items: platformItems 
  },
  { 
    label: 'Technology', 
    value: 'how-it-works',
    items: howItWorksItems 
  },
  { 
    label: 'Features', 
    value: 'features',
    items: featuresItems 
  },
  { 
    label: 'Solution', 
    value: 'solution',
    items: solutionItems 
  },
  { 
    label: 'UseCase', 
    value: 'usecase',
    items: solutionItems 
  },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
  <motion.header
    className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#003328]"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
  >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-14 sm:h-16 w-full items-center justify-between md:h-[4.5rem]">
        {/* Logo - left corner */}
        <div className="shrink-0 [&_img]:brightness-0 [&_img]:invert [&_img]:!max-w-none [&_img]:!h-8 [&_img]:!w-8 [&_img]:sm:!h-9 [&_img]:sm:!w-9 [&_span]:!text-white [&_span]:!font-bold header-logo [&_span]:!bg-none [&_span]:!bg-transparent [&_span]:!text-base [&_span]:sm:!text-lg [&_span]:sm:!text-xl">
          <Logo size="md" showText={true} href="/" className="transition-opacity hover:opacity-90" />
        </div>

        {/* Navigation - center (desktop) */}
        <nav className="hidden flex-1 items-center justify-center gap-6 xl:gap-8 lg:flex">
          <NavDropdown label="Platform" items={platformItems} gridCols={2} />
          <NavDropdown label="How it works" items={howItWorksItems} useAnchor />
          <NavDropdown label="Features" items={featuresItems} useAnchor />
          <NavDropdown label="Solution" items={solutionItems} gridCols={2} useAnchor />
          <NavDropdown label="UseCase" items={solutionItems} gridCols={2} useAnchor />
          <Link href="/#contact">
            <motion.span
              className="block text-base font-bold tracking-tight text-white hover:text-[#bbf7d0]"
              whileHover={{ scale: 1.03, color: '#86efac' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Contact
            </motion.span>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <Link href="/auth/login">
            <motion.span
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white bg-[#003328] px-5 py-2.5 text-sm font-semibold text-white sm:px-6 sm:py-2.5 sm:text-base"
              whileTap={{ scale: 0.96 }}
            >
              Login
            </motion.span>
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="flex size-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
              >
                <List size={24} weight="bold" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(320px,85vw)] border-gray-200 bg-gray-50">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav className="mt-8 flex flex-col">
                <Accordion type="single" collapsible className="w-full">
                  {mobileNavSections.map((section) => (
                    <AccordionItem key={section.value} value={section.value} className="border-b border-gray-200">
                      <AccordionTrigger className="px-4 py-3 text-base font-semibold text-gray-900 hover:no-underline hover:bg-emerald-50 [&[data-state=open]]:bg-emerald-50">
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
                  ))}
                </Accordion>
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-900 hover:bg-emerald-50 mt-1"
                >
                  Contact Us
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Login - right corner (desktop) */}
        <div className="hidden shrink-0 items-center lg:flex">
          <motion.div>
            <Link href="/auth/login">
              <motion.span
                className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white bg-[#003328] px-5 py-2.5 text-sm font-semibold text-white sm:px-7 sm:py-3 sm:text-base"
                initial={false}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.1)',
                  transition: { duration: 0.3 },
                }}
                whileTap={{
                  scale: 0.96,
                  boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                  transition: { duration: 0.1 },
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
