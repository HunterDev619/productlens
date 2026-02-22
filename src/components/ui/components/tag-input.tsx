'use client';

import type { KeyboardEvent } from 'react';
import { X } from '@phosphor-icons/react';
import { useState } from 'react';
import { cn } from '@/utils';

export type TagInputProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
};

const EMPTY_ARRAY: string[] = [];

export const TagInput = ({ ref, value, onChange, placeholder = 'Enter values...', disabled = false, hasError = false, className }: TagInputProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const [inputValue, setInputValue] = useState('');
  const tags = value || EMPTY_ARRAY;

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onChange?.([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    if (disabled) {
      return;
    }
    onChange?.(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace if input is empty
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    // Add tag on blur if there's a value
    if (inputValue.trim()) {
      addTag();
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-h-[42px] w-full flex-wrap items-center gap-2 rounded border border-border bg-transparent px-3 py-2 text-sm ring-0 ring-offset-transparent transition-colors hover:bg-secondary/20 focus-within:border-primary focus-within:bg-secondary/20',
        hasError ? 'border-error' : 'border-border',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        className,
      )}
    >
      {tags.map((tag, index) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-sm"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 rounded-sm hover:bg-secondary-foreground/20"
              aria-label={`Remove ${tag}`}
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="min-w-[120px] flex-1 bg-transparent outline-none placeholder:opacity-80 disabled:cursor-not-allowed"
      />
    </div>
  );
};

TagInput.displayName = 'TagInput';
