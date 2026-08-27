import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RouteMeta {
  group: string;
  label: string;
}

export const routeMeta: Record<string, RouteMeta> = {
  '/dashboard': { group: 'Overview & Fleet', label: 'Live Fleet Bookings Stream' },
  '/reports': { group: 'Overview & Fleet', label: 'Reports & Financial Analytics' },
  '/device-status': { group: 'Overview & Fleet', label: 'Terminal Telemetry & Fleet Status' },
  '/locker-status': { group: 'Overview & Fleet', label: 'Physical Locker Matrix' },
  '/future-first': { group: 'Overview & Fleet', label: 'Future First Locker Management' },

  '/pesit-terminals': { group: 'PESIT Lockers', label: 'PESIT Hardware Terminals' },
  '/pesit-students': { group: 'PESIT Lockers', label: 'Student Directory' },
  '/pesit-managers': { group: 'PESIT Lockers', label: 'Locker Managers' },

  '/refund-requests': { group: 'Revenue & Operations', label: 'Refund Requests' },
  '/refund-history': { group: 'Revenue & Operations', label: 'Refund Logs & History' },
  '/pricing': { group: 'Revenue & Operations', label: 'Dynamic Pricing Control' },
  '/state-gst': { group: 'Revenue & Operations', label: 'State GST & Invoicing' },
  '/staff-credit': { group: 'Revenue & Operations', label: 'Staff Credit Requests' },
  '/staff-profiles': { group: 'Revenue & Operations', label: 'Staff Directory' },

  '/users': { group: 'Access & Governance', label: 'Customer Directory' },
  '/admins': { group: 'Access & Governance', label: 'Admin Directory' },
  '/employee-monitor': { group: 'Access & Governance', label: 'Employee Monitor' },
  '/roles': { group: 'Access & Governance', label: 'Roles & Permissions (RBAC)' },
  '/blacklist-history': { group: 'Access & Governance', label: 'Blacklist Audit Trail' },
  '/audit-logs': { group: 'Access & Governance', label: 'Immutable Audit Logs' },

  '/alerts': { group: 'Tools & Diagnostics', label: 'System Alerts & Diagnostics' },
  '/profile': { group: 'Account & Settings', label: 'Operator Profile' },
};

export const LocalNav: React.FC<{ className?: string }> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const meta = routeMeta[currentPath] || {
    group: 'Platform',
    label: currentPath.replace('/', '').replace(/-/g, ' ') || 'Dashboard',
  };

  return (
    <nav
      aria-label="Local page navigation"
      className={cn('flex items-center gap-1.5 text-xs text-neutral-500 select-none min-w-0 overflow-hidden', className)}
    >
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="text-neutral-500 hover:text-neutral-900 transition-colors font-normal shrink-0 hidden sm:inline"
      >
        Tuckit
      </button>

      {meta.group && (
        <>
          <ChevronRight className="size-3 text-neutral-400 shrink-0 hidden sm:inline-block" />
          <span className="text-neutral-500 font-normal shrink-0 hidden md:inline truncate max-w-[140px] xl:max-w-none">
            {meta.group}
          </span>
        </>
      )}

      <ChevronRight className="size-3 text-neutral-400 shrink-0 hidden md:inline-block" />
      <span className="text-neutral-900 font-semibold truncate">
        {meta.label}
      </span>
    </nav>
  );
};
