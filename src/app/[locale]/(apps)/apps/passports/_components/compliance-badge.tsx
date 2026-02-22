'use client';

import { Badge } from '@/components/ui';
import { cn } from '@/utils';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

type ComplianceStatus = 'compliant' | 'warning' | 'pending' | 'non-compliant';

type ComplianceBadgeProps = {
  status?: ComplianceStatus | string;
  size?: 'small' | 'medium';
  className?: string;
};

const statusConfig: Record<ComplianceStatus, { label: string; className: string; icon: React.ReactNode }> = {
  compliant: {
    label: 'Compliant',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  warning: {
    label: 'Warning',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <AlertCircle className="h-3 w-3" />,
  },
  pending: {
    label: 'Pending',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <Clock className="h-3 w-3" />,
  },
  'non-compliant': {
    label: 'Non-Compliant',
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

export function ComplianceBadge({ status, size = 'medium', className }: ComplianceBadgeProps) {
  const config = statusConfig[status as ComplianceStatus] ?? statusConfig.pending;

  return (
    <Badge
      variant="secondary"
      className={cn(
        'border',
        'flex items-center gap-1 font-medium',
        size === 'small' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1',
        config.className,
        className,
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
