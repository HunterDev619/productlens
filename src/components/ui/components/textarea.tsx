'use client';
import { forwardRef } from 'react';
import { cn } from '@/utils';

export type TextareaProps = {
  hasError?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError = false, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-20 w-full rounded border border-border bg-transparent px-3 py-2 text-sm ring-0 ring-offset-transparent transition-colors placeholder:opacity-80 hover:bg-secondary/20 focus:border-primary focus:bg-secondary/20 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
        hasError ? 'border-error' : 'border-border',
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';

