'use client';

import { useEffect } from 'react';

/**
 * Scrolls the scroll viewport to top on mount.
 * Used on Terms of Use and Privacy Policy pages to avoid "flowing" / scroll position carry-over when navigating.
 */
export function ScrollToTopOnMount() {
  useEffect(() => {
    const scrollToTop = () => {
      const viewport = document.querySelector('[data-scroll-viewport]');
      if (viewport instanceof HTMLElement) {
        viewport.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    scrollToTop();
  }, []);
  return null;
}
