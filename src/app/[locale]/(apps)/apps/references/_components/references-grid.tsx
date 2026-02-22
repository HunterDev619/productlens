'use client';

import type { Category, Reference } from '@/services/types';
import { motion } from 'framer-motion';
import ReferenceCard from './reference-card';

type ReferencesGridProps = {
  references: Reference[];
  getCategory: (categoryId: string) => Category | null;
};

export default function ReferencesGrid({ references, getCategory }: ReferencesGridProps) {
  if (references.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3"
    >
      {references.map(reference => (
        <ReferenceCard
          key={reference.id}
          reference={reference}
          category={getCategory(reference.categoryId)}
        />
      ))}
    </motion.div>
  );
}
