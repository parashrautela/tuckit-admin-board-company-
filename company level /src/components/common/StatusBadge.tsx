import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', pulse = false }) => {
  const norm = status.toUpperCase();

  const getStyle = () => {
    switch (norm) {
      case 'ONLINE':
      case 'ACTIVE':
      case 'AVAILABLE':
      case 'APPROVED':
      case 'SETTLED':
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
      case 'OFFLINE':
      case 'BLOCKED':
      case 'FAILED':
      case 'REJECTED':
      case 'FAULTY':
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800';
      case 'OVERDUE':
      case 'WARNING':
      case 'MAINTENANCE':
      case 'PENDING':
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
      case 'COMPLETED':
      case 'RESOLVED':
      case 'ACKNOWLEDGED':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
      case 'ONLINE PAYMENT':
      case 'NETBANKING':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400';
      case 'PAY LATER':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
    }
  };

  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-md border tracking-wide uppercase font-mono ${pad} ${getStyle()}`}
    >
      {pulse && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            norm === 'ONLINE' || norm === 'ACTIVE'
              ? 'bg-emerald-500 animate-pulse'
              : norm === 'OFFLINE'
              ? 'bg-red-500'
              : 'bg-amber-500'
          }`}
        />
      )}
      {status}
    </span>
  );
};
