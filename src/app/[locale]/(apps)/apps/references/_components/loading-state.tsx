'use client';

import { CircleNotch } from '@phosphor-icons/react';

export default function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <CircleNotch size={40} className="animate-spin text-emerald-500" />
        <p className="text-lg font-medium text-gray-700">Loading References...</p>
      </div>
    </div>
  );
}
