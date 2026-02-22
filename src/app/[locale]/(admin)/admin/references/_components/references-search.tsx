'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

type ReferencesSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ReferencesSearch({ value, onChange }: ReferencesSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="relative">
        <MagnifyingGlass
          size={20}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search references by name, description, URL..."
          className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 py-3 pr-4 pl-12 transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
        />
      </div>
    </motion.div>
  );
}
