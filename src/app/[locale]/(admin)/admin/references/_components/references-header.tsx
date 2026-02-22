'use client';

import { Plus } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

type ReferencesHeaderProps = {
  onCreateClick: () => void;
};

export default function ReferencesHeader({ onCreateClick }: ReferencesHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="space-y-2">
        <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-4xl font-bold text-transparent">
          References Management
        </h1>
        <p className="text-lg text-gray-600">
          Manage reference sources and documentation links
        </p>
      </div>
      <Button
        onClick={onCreateClick}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        <Plus size={20} className="mr-2" />
        Create Reference
      </Button>
    </motion.div>
  );
}
