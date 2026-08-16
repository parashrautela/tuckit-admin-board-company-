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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'OFFLINE':
      case 'BLOCKED':
      case 'FAILED':
      case 'REJECTED':
      case 'FAULTY':
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'OVERDUE':
      case 'WARNING':
      case 'MAINTENANCE':
      case 'PENDING':
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'COMPLETED':
      case 'RESOLVED':
      case 'ACKNOWLEDGED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ONLINE PAYMENT':
      case 'NETBANKING':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'PAY LATER':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-zinc-50 text-zinc-600 border-zinc-200';
    }
  };

  // DESIGN.md: tags use rounded-sm (6px), font-medium (500), no mono
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-sm border tracking-wide uppercase ${pad} ${getStyle()}`}
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
