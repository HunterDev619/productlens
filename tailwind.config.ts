// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'IBM Plex Sans',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
      },
      fontSize: {
        'display': ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'heading-xl': ['clamp(1.875rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'heading-lg': ['clamp(1.5rem, 2.5vw, 1.875rem)', { lineHeight: '1.25' }],
        'heading': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.8125rem', { lineHeight: '1.4' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'enter': {
          from: {
            opacity: 'var(--tw-enter-opacity, 1)',
            transform: 'translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))',
          },
        },
        'exit': {
          to: {
            opacity: 'var(--tw-exit-opacity, 1)',
            transform: 'translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))',
          },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'accordion-up': 'accordion-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'in': 'enter 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'out': 'exit 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
