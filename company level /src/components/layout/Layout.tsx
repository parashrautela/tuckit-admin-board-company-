import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { LocalNav } from './LocalNav';
import { ToastContainer } from '../common/Toast';
import { useAuth } from '@/context/AuthContext';
import { useRealtime } from '@/context/RealtimeContext';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { totalAlertsCount } = useRealtime();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex flex-col antialiased">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Nav Drawer */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Shell */}
      <div className="lg:ml-64 flex flex-col min-h-screen transition-all duration-200 flex-1">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-200 h-14 flex items-center justify-between px-4 sm:px-6 shrink-0 relative">
          {/* Left: Mobile Menu Toggle + Breadcrumb Local Nav */}
          <div className="flex items-center gap-2.5 min-w-0 max-w-[calc(50%-130px)] sm:max-w-[calc(50%-180px)] lg:max-w-[calc(50%-240px)]">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden shrink-0"
              title="Open Navigation"
            >
              <Menu className="size-4" />
            </Button>

            {/* Breadcrumb Local Navigation */}
            <LocalNav />
          </div>

          {/* Center: Horizontally Centered Large Search Bar */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center pointer-events-auto z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-2 sm:px-4">
            <div
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-lg bg-neutral-100/90 border border-neutral-200/90 text-neutral-500 text-xs sm:text-sm w-full cursor-pointer hover:bg-neutral-200/60 hover:border-neutral-300 transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="size-4 shrink-0 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                <span className="truncate text-neutral-500 font-normal">Search terminal or user...</span>
              </div>
              <kbd className="pointer-events-none hidden sm:inline-flex h-4 select-none items-center gap-0.5 rounded border border-neutral-300 bg-white px-1.5 font-mono text-[10px] font-medium text-neutral-400 shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Alert Bell + Mobile Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto z-10">
            {/* Alert Bell */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate('/alerts')}
              className="relative text-neutral-600 hover:text-neutral-900"
              title="System Alerts & Diagnostics"
            >
              <Bell className="size-4" />
              {totalAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-error-500 ring-2 ring-white animate-pulse" />
              )}
            </Button>

            {/* Mobile User Avatar */}
            <div
              onClick={() => navigate('/profile')}
              className="lg:hidden flex items-center cursor-pointer"
            >
              <Avatar className="size-7">
                <AvatarFallback className="bg-neutral-100 text-neutral-800 font-bold text-xs">
                  {session?.name ? session.name.charAt(0).toUpperCase() : 'P'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-200 bg-white py-3.5 px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-2 font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-success-500" />
            <span>TUCKIT FLEET CONTROL • v2.4.0</span>
          </div>
          <div>AWS IoT ap-south-1 • Telemetry Engine</div>
        </footer>
      </div>

      <ToastContainer />
    </div>
  );
};
