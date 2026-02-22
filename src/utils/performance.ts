// Performance optimization utilities for SEO and Core Web Vitals

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) {
      link.type = type;
    }
    document.head.appendChild(link);
  }
}

// Prefetch next page resources
export function prefetchPage(href: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
}

// DNS prefetch for external domains
export function dnsPrefetch(domain: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  }
}

// Preconnect to critical third-party origins
export function preconnect(href: string, crossorigin?: boolean) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    if (crossorigin) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }
}

// Critical third-party domains to preconnect
export const CRITICAL_DOMAINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://www.google-analytics.com',
  'https://www.googletagmanager.com',
];

// Initialize critical resource hints
export function initializeCriticalResourceHints() {
  CRITICAL_DOMAINS.forEach((domain) => {
    preconnect(domain, true);
  });
}

// Lazy load images with intersection observer
export function createImageObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
        }
      }
    });
  }, {
    rootMargin: '50px',
  });
}

// Report Core Web Vitals to analytics
export function reportWebVitals(metric: any) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      custom_map: { metric_id: 'custom_metric' },
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

// Optimize font loading
export function optimizeFontLoading() {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    preloadResource('/fonts/inter-var.woff2', 'font', 'font/woff2');

    // Add font-display: swap to existing font faces
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url('/fonts/inter-var.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.warn('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.warn('SW registration failed: ', registrationError);
        });
    });
  }
}

// Critical CSS inlining helper
export function inlineCriticalCSS(css: string) {
  if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    style.setAttribute('data-critical', 'true');
    document.head.appendChild(style);
  }
}

// Defer non-critical JavaScript
export function deferScript(src: string, async: boolean = true) {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    if (async) {
      script.async = true;
    }
    document.body.appendChild(script);
  }
}

// Initialize all performance optimizations
export function initializePerformanceOptimizations() {
  initializeCriticalResourceHints();
  optimizeFontLoading();
  registerServiceWorker();
}
