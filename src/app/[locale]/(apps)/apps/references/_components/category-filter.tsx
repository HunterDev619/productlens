'use client';

import type { Category } from '@/services/types';
import { CaretDown } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/utils';

const INITIAL_CATEGORIES_TO_SHOW = 6;

type CategoryFilterProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (categories.length === 0) {
    return null;
  }

  const visibleCategories = isExpanded
    ? categories
    : categories.slice(0, INITIAL_CATEGORIES_TO_SHOW);

  const hasMoreCategories = categories.length > INITIAL_CATEGORIES_TO_SHOW;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategorySelect(null)}
          className={cn(
            'rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors',
            selectedCategoryId === null
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
          )}
        >
          All Categories
        </button>
        <AnimatePresence>
          {visibleCategories.map((category, index) => {
            const categoryColor = category.color || '#10b981'; // Default emerald
            const isSelected = selectedCategoryId === category.id;

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                type="button"
                onClick={() => onCategorySelect(category.id)}
                className={cn(
                  'rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors',
                  isSelected
                    ? 'text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                )}
                style={
                  isSelected
                    ? {
                        backgroundColor: categoryColor,
                        borderColor: categoryColor,
                      }
                    : undefined
                }
              >
                {category.title}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse Button */}
      {hasMoreCategories && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          <CaretDown
            size={16}
            className={cn(
              'transition-transform duration-200',
              isExpanded && 'rotate-180',
            )}
          />
          {isExpanded
            ? `Show Less (${INITIAL_CATEGORIES_TO_SHOW} categories)`
            : `Show More (${categories.length - INITIAL_CATEGORIES_TO_SHOW} more categories)`}
        </button>
      )}
    </div>
  );
}
