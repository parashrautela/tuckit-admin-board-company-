import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  pulse = false,
  className,
}) => {
  const norm = status ? status.toUpperCase() : '';

  const getVariant = (): 'success' | 'destructive' | 'warning' | 'info' | 'primary' | 'secondary' | 'outline' => {
    switch (norm) {
      case 'ONLINE':
      case 'ACTIVE':
      case 'AVAILABLE':
      case 'APPROVED':
      case 'SETTLED':
      case 'SUCCESS':
      case 'STORED':
      case 'PICKED UP':
        return 'success';
      case 'OFFLINE':
      case 'BLOCKED':
      case 'FAILED':
      case 'REJECTED':
      case 'FAULTY':
      case 'HIGH':
      case 'DELAYED':
      case 'OVERDUE':
      case 'ISSUE':
        return 'destructive';
      case 'WARNING':
      case 'MAINTENANCE':
      case 'PENDING':
      case 'MEDIUM':
        return 'warning';
      case 'COMPLETED':
      case 'RESOLVED':
      case 'ACKNOWLEDGED':
        return 'info';
      case 'NEW':
      case 'PROMOTIONAL':
      case 'PAY LATER':
        return 'primary';
      case 'ONLINE PAYMENT':
      case 'NETBANKING':
      case 'UPI':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const variant = getVariant();

  return (
    <Badge
      variant={variant}
      size={size === 'sm' ? 'default' : 'lg'}
      className={cn('uppercase tracking-wider font-semibold', className)}
    >
      {pulse && (
        <span
          className={cn(
            'size-1.5 rounded-full shrink-0',
            variant === 'success' && 'bg-success-500 animate-pulse',
            variant === 'destructive' && 'bg-error-500',
            variant === 'warning' && 'bg-warning-500 animate-pulse',
            variant === 'info' && 'bg-info-500',
            variant === 'primary' && 'bg-primary-500 animate-pulse',
            variant === 'secondary' && 'bg-neutral-500',
            variant === 'outline' && 'bg-neutral-400'
          )}
        />
      )}
      <span>{status}</span>
    </Badge>
  );
};
