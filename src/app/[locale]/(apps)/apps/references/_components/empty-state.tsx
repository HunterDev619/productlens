'use client';

import { Tag } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

type EmptyStateProps = {
  hasSearchOrFilter: boolean;
};

export default function EmptyState({ hasSearchOrFilter }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm"
    >
      <Tag size={48} className="mx-auto text-gray-300" weight="duotone" />
      <p className="mt-4 text-lg font-medium text-gray-500">No references found</p>
      <p className="mt-2 text-sm text-gray-400">
        {hasSearchOrFilter
          ? 'Try adjusting your search or filter criteria'
          : 'No references available at the moment'}
      </p>
    </motion.div>
  );
}
