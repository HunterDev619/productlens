'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';

type ReferencesSearchProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export default function ReferencesSearch({ searchQuery, onSearchChange }: ReferencesSearchProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="relative">
        <MagnifyingGlass
          size={20}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search references by name, description, URL..."
          className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 py-3 pr-4 pl-12 transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
        />
      </div>
    </div>
  );
}
