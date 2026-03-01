'use client';

import { Logo } from '@/components/logo';
import { Link } from '@/libs/I18nNavigation';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Solution', href: '/#problem', external: false },
  { label: 'Technology', href: '/#features', external: false },
  { label: 'Pricing', href: '/#pricing', external: false },
  { label: 'FAQ', href: '/#faq', external: false },
  { label: 'About Us', href: 'https://eco-solutise.com/about-us/', external: true },
  { label: 'Contact US', href: '/#contact', external: false },
];

export function Footer() {
  return (
    <footer>
      {/* Top footer: logo + navigation on white background */}
      <div className="bg-white text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            {/* Left: Logo */}
            <div className="flex flex-1 justify-center md:justify-start">
              <Logo
                href="/"
                size="lg"
                showText
                className="[&_img]:!h-20 [&_img]:!w-auto [&_img]:!max-w-none sm:[&_img]:!h-24 md:[&_img]:!h-28"
              />
            </div>

            {/* Center: Nav items - positioned middle of screen, text left-aligned */}
            <nav className="flex flex-1 justify-center md:justify-center">
              <ul className="flex flex-col items-start justify-center gap-2 text-sm font-medium tracking-wide text-gray-700">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label} className="flex justify-start">
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block outline-none"
                      >
                        <motion.span
                          className="inline-block cursor-pointer rounded-lg px-3 py-1.5 text-gray-700 transition-colors hover:text-emerald-600"
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.96, y: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          {item.label}
                        </motion.span>
                      </a>
                    ) : (
                      <Link href={item.href} className="block outline-none">
                        <motion.span
                          className="inline-block cursor-pointer rounded-lg px-3 py-1.5 text-gray-700 transition-colors hover:text-emerald-600"
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.96, y: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          {item.label}
                        </motion.span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            {/* Right: balance for center positioning */}
            <div className="hidden flex-1 md:block" aria-hidden />
          </div>
        </div>
      </div>

      {/* Bottom bar: legal + copyright (black bg, dashed separator, light gray text) - 200px pulled down */}
      <div className="bg-black pt-[200px]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div
            className="mb-4 border-t border-dashed border-gray-500"
            aria-hidden
          />
          <div className="flex flex-col gap-3 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Link href="/privacy-policy" className="transition-colors hover:text-gray-200 hover:underline">
                Privacy Policy
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/terms-of-use" className="transition-colors hover:text-gray-200 hover:underline">
                Terms of Use
              </Link>
            </div>
            <p className="text-center text-gray-400 sm:text-right">
              © ProductLens 2026. Patent Pending.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

