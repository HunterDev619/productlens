'use client';

import { Badge } from '@/components/ui';
import { cn } from '@/utils';

type PassportStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'active' | 'expired' | 'recycled';

type StatusBadgeProps = {
  status?: PassportStatus | string;
  className?: string;
};

const statusConfig: Record<PassportStatus, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  active: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  expired: {
    label: 'Expired',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  recycled: {
    label: 'Recycled',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as PassportStatus] ?? {
    label: status ?? 'Unknown',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <Badge variant="secondary" className={cn('text-xs font-medium border', config.className, className)}>
      {config.label}
    </Badge>
  );
}
