'use client';

import { motion } from 'framer-motion';

type ReferencesHeaderProps = {
  totalCount: number;
};

export default function ReferencesHeader({ totalCount }: ReferencesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-4xl font-bold text-transparent"
      >
        References
      </motion.h1>
      <div className="text-sm text-gray-600">
        {totalCount}
        {' '}
        reference
        {totalCount !== 1 ? 's' : ''}
        {' '}
        found
      </div>
    </div>
  );
}
