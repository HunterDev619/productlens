'use client';

import type { Category, Reference } from '@/services/types';
import { Globe, Link as LinkIcon, Tag } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import Link from 'next/link';

type ReferenceCardProps = {
  reference: Reference;
  category: Category | null;
};

export default function ReferenceCard({ reference, category }: ReferenceCardProps) {
  const categoryColor = category?.color || '#10b981'; // Default emerald
  const categoryName = category?.title || reference.categoryId;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-12 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
    >
      {/* Category Badge */}
      <div className="mb-8">
        <span
          className="inline-flex items-center rounded-full px-5 py-1.5 text-base font-medium text-white"
          style={{
            backgroundColor: categoryColor,
          }}
        >
          <Tag size={18} className="mr-1.5" />
          {categoryName}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-6 text-2xl font-semibold text-gray-900 group-hover:text-emerald-600">
        {reference.name}
      </h3>

      {/* Description */}
      {reference.description && (
        <p className="mb-10 text-lg leading-relaxed text-gray-600">
          {reference.description}
        </p>
      )}

      {/* URL Link */}
      {reference.url && (
        <div className="mb-10 max-w-full min-w-0">
          <Link
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex max-w-full min-w-0 items-center gap-2 text-lg text-blue-600 hover:text-blue-700 hover:underline"
            title={reference.url}
          >
            <LinkIcon size={22} className="flex-shrink-0" weight="regular" />
            <span className="max-w-full min-w-0 truncate">
              {reference.url}
            </span>
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-10">
        <div className="flex items-center gap-2 text-base text-gray-500">
          <Globe size={20} />
          <span>Public</span>
        </div>
        <div className="text-base text-gray-500">
          {dayjs(reference.createdAt).format('MMM D, YYYY')}
        </div>
      </div>
    </motion.div>
  );
}
