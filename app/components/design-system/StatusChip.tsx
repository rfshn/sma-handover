'use client';

import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface StatusChipProps {
  status: 'waiting' | 'joined' | 'confirmed';
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusChip({
  status,
  label,
  size = 'md',
}: StatusChipProps) {
  const statusConfig = {
    waiting: {
      variant: 'outline' as const,
      className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
      icon: Clock,
      defaultLabel: 'Waiting',
    },
    joined: {
      variant: 'outline' as const,
      className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      icon: Check,
      defaultLabel: 'Joined',
    },
    confirmed: {
      variant: 'outline' as const,
      className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      icon: Check,
      defaultLabel: 'Confirmed',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
  };

  return (
    <Badge
      variant={config.variant}
      className={clsx(config.className, sizeStyles[size], 'gap-1.5')}
    >
      <Icon size={iconSizes[size]} />
      {displayLabel}
    </Badge>
  );
}
