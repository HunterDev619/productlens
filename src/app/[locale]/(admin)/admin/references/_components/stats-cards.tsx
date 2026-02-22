'use client';

import type { Reference } from '@/services/types';
import { Globe, Link as LinkIcon, Tag } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

type StatsCardsProps = {
  references: Reference[];
};

export default function StatsCards({ references }: StatsCardsProps) {
  const stats = {
    total: references.length,
    public: references.filter(ref => ref.isPublic).length,
    withUrls: references.filter(ref => ref.url).length,
    withDescription: references.filter(ref => ref.description).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid gap-4 md:grid-cols-4"
    >
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total References</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.total}
            </p>
          </div>
          <Tag size={40} className="text-emerald-500" weight="duotone" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Public</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {stats.public}
            </p>
          </div>
          <Globe size={40} className="text-green-500" weight="duotone" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">With URLs</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {stats.withUrls}
            </p>
          </div>
          <LinkIcon size={40} className="text-blue-500" weight="duotone" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">With Description</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {stats.withDescription}
            </p>
          </div>
          <Tag size={40} className="text-purple-500" weight="duotone" />
        </div>
      </div>
    </motion.div>
  );
}
