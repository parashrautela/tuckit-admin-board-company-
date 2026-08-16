import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import {
  Bell,
  Menu,
  Search,
  ChevronRight,
} from 'lucide-react';

// Breadcrumb label mapping
const pathLabels: Record<string, string> = {
  '/dashboard': 'Dashboard & Main View',
  '/reports': 'Reports & Analysis',
  '/device-status': 'Device / Terminal Status',
  '/locker-status': 'Locker Status',
  '/future-first': 'Future First',
  '/pesit-terminals': 'PESIT Terminals',
  '/pesit-students': 'Student Management',
  '/pesit-managers': 'Locker Managers',
  '/refund-requests': 'Refund Requests',
  '/refund-history': 'Refund History',
  '/pricing': 'Pricing Control',
  '/state-gst': 'State GST Config',
  '/staff-credit': 'Staff Credit Request',
  '/staff-profiles': 'Staff Profiles',
  '/users': 'Customers',
  '/admins': 'Internal Admins',
  '/employee-monitor': 'Employee Monitor',
  '/roles': 'Roles & RBAC',
  '/blacklist-history': 'Block / Unblock History',
  '/audit-logs': 'Audit Logs',
  '/profile': 'Profile',
  '/alerts': 'System Alerts',
};

const pathGroups: Record<string, string> = {
  '/pesit-terminals': 'PESIT Locker',
  '/pesit-students': 'PESIT Locker',
  '/pesit-managers': 'PESIT Locker',
  '/refund-requests': 'Revenue & Billing',
  '/refund-history': 'Revenue & Billing',
  '/pricing': 'Revenue & Billing',
  '/state-gst': 'Revenue & Billing',
  '/staff-credit': 'Revenue & Billing',
  '/staff-profiles': 'Revenue & Billing',
  '/users': 'User Management',
  '/admins': 'User Management',
  '/employee-monitor': 'User Management',
  '/roles': 'User Management',
  '/blacklist-history': 'User Management',
  '/audit-logs': 'User Management',
};

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { totalAlertsCount } = useRealtime();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentPath = location.pathname;
  const pageLabel = pathLabels[currentPath] || 'Dashboard';
  const groupLabel = pathGroups[currentPath];

  return (
    <div className="min-h-screen bg-surface-canvas font-sans text-ink">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Nav */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area — offset by sidebar width on desktop */}
      <div className="lg:ml-64 flex flex-col min-h-screen transition-all duration-200">
        {/* Compact Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-hairline h-12 flex items-center justify-between px-4 sm:px-6">
          {/* Left: Hamburger (mobile) + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-md border border-hairline text-ink-muted hover:bg-zinc-50 transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[13px] min-w-0">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-ink-subtle hover:text-ink transition-colors shrink-0"
              >
                Home
              </button>
              {groupLabel && (
                <>
                  <ChevronRight className="h-3 w-3 text-ink-subtle shrink-0" />
                  <span className="text-ink-subtle shrink-0">{groupLabel}</span>
                </>
              )}
              <ChevronRight className="h-3 w-3 text-ink-subtle shrink-0" />
              <span className="text-ink font-medium truncate">{pageLabel}</span>
            </nav>
          </div>

          {/* Right: Search + Alerts + Avatar */}
          <div className="flex items-center gap-2">
            {/* Search — decorative for now */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-50 border border-hairline text-ink-subtle text-[13px] w-48 lg:w-56">
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span>Search…</span>
            </div>

            {/* Alert Bell */}
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="relative p-1.5 text-ink-subtle hover:text-ink hover:bg-zinc-50 rounded-md transition-colors"
              title="System Alerts"
            >
              <Bell className="h-4 w-4" />
              {totalAlertsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {/* User Avatar (mobile only — desktop shows in sidebar) */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-zinc-100 border border-hairline flex items-center justify-center text-ink font-bold text-xs">
                {session?.username ? session.username.charAt(0).toUpperCase() : 'P'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-hairline bg-white py-3 text-center text-[11px] text-ink-subtle font-mono">
          TUCKIT Physical Locker Operations Console • v2.4.0 • Connected Node: AWS IoT AP-South-1
        </footer>
      </div>

      <ToastContainer />
    </div>
  );
};
