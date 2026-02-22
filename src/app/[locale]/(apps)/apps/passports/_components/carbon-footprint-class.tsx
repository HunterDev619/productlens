'use client';

import { cn } from '@/utils';

type CarbonFootprintClassProps = {
  cfClass?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

const classConfig: Record<string, { bg: string; text: string }> = {
  A: { bg: 'bg-emerald-500', text: 'text-white' },
  B: { bg: 'bg-green-500', text: 'text-white' },
  C: { bg: 'bg-lime-500', text: 'text-white' },
  D: { bg: 'bg-yellow-500', text: 'text-white' },
  E: { bg: 'bg-orange-500', text: 'text-white' },
  F: { bg: 'bg-red-500', text: 'text-white' },
  G: { bg: 'bg-red-700', text: 'text-white' },
};

const sizeConfig = {
  small: 'w-8 h-8 text-sm',
  medium: 'w-12 h-12 text-lg',
  large: 'w-16 h-16 text-2xl',
};

export function CarbonFootprintClass({ cfClass, size = 'medium', className }: CarbonFootprintClassProps) {
  const normalizedClass = cfClass?.toUpperCase() ?? '-';
  const config = classConfig[normalizedClass] ?? { bg: 'bg-slate-300', text: 'text-slate-600' };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg font-bold shadow-sm',
        config.bg,
        config.text,
        sizeConfig[size],
        className,
      )}
    >
      {normalizedClass}
    </div>
  );
}
