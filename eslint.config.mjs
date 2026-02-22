import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import antfu from '@antfu/eslint-config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tailwind from 'eslint-plugin-tailwindcss';

export default antfu(
  {
    react: true,
    nextjs: true,
    typescript: true,

    // Configuration preferences
    lessOpinionated: true,
    isInEditor: false,

    // Code style
    stylistic: {
      semi: true,
    },

    // Format settings
    formatters: {
      css: true,
    },

    // Ignored paths
    ignores: [
      'migrations/**/*',
    ],
  },
  // --- Accessibility Rules ---
  jsxA11y.flatConfigs.recommended,
  // --- Tailwind CSS Rules ---
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        config: `${dirname(fileURLToPath(import.meta.url))}/src/styles/global.css`,
        whitelist: [
          // Data state animations
          'data-\\[state=open\\]:animate-in',
          'data-\\[state=closed\\]:animate-out',
          'data-\\[swipe=end\\]:animate-out',
          'data-\\[state=closed\\]:fade-out-80',
          'data-\\[state=closed\\]:slide-out-to-right-full',
          'data-\\[state=open\\]:slide-in-from-top-full',
          'data-\\[state=open\\]:sm:slide-in-from-bottom-full',
          // Custom color variants
          'border-error',
          'bg-error',
          'text-error-foreground',
          'border-warning',
          'bg-warning',
          'text-warning-foreground',
          'border-info',
          'bg-info',
          'text-info-foreground',
          'border-success',
          'bg-success',
          'text-success-foreground',
        ],
      },
    },
  },
  // --- Custom Rule Overrides ---
  {
    rules: {
      'antfu/no-top-level-await': 'off', // Allow top-level await
      'style/brace-style': ['error', '1tbs'], // Use the default brace style
      'ts/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
      'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
      'node/prefer-global/process': 'off', // Allow using `process.env`
      'test/padding-around-all': 'error', // Add padding in test files
      'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles
    },
  },
);
