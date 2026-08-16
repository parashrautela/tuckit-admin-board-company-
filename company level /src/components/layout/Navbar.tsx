import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import {
  LayoutDashboard,
  BarChart3,
  MonitorCheck,
  Grid,
  Building2,
  GraduationCap,
  Users2,
  Receipt,
  RotateCcw,
  Tag,
  FileSpreadsheet,
  Wallet,
  UserCheck,
  Users,
  ShieldCheck,
  UserCog,
  ShieldAlert,
  ClipboardList,
  User,
  Bell,
  Sliders,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Lock,
} from 'lucide-react';
import { ControlCenterDrawer } from '../control-center/ControlCenterDrawer';
import { BlacklistUserModal } from '../modals/BlacklistUserModal';

interface NavItemConfig {
  path: string;
  label: string;
  icon: any;
  permission?: string | string[];
}

export const Navbar: React.FC = () => {
  const { session, logout, hasPermission } = useAuth();
  const { pendingRefundsCount, pendingStaffCreditsCount, totalAlertsCount } = useRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown states
  const [isPesitOpen, setIsPesitOpen] = useState(false);
  const [isRevenueOpen, setIsRevenueOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);

  const pesitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revenueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const totalBillingBadges = pendingRefundsCount + pendingStaffCreditsCount;

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollNav = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const offset = direction === 'left' ? -220 : 220;
      el.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav categories matching exact Tuckit Admin spec
  const mainNavItems: NavItemConfig[] = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/reports', label: 'Report Analysis', icon: BarChart3 },
    { path: '/device-status', label: 'Terminal Management', icon: MonitorCheck },
    { path: '/locker-status', label: 'Locker Status', icon: Grid },
    { path: '/future-first', label: 'Future First', icon: Building2 },
  ];

  const pesitItems = [
    { path: '/pesit-terminals', label: 'PESIT Terminals', icon: MonitorCheck },
    { path: '/pesit-students', label: 'Student Management', icon: GraduationCap },
    { path: '/pesit-managers', label: 'Locker Managers', icon: Users2 },
  ];

  const revenueItems = [
    { path: '/refund-requests', label: 'Refund Requests', icon: RotateCcw, badge: pendingRefundsCount },
    { path: '/refund-history', label: 'Refund History', icon: Receipt },
    { path: '/pricing', label: 'Pricing Control', icon: Tag },
    { path: '/state-gst', label: 'State GST Config', icon: FileSpreadsheet },
    { path: '/staff-credit', label: 'Staff Credit Request', icon: Wallet, badge: pendingStaffCreditsCount },
    { path: '/staff-profiles', label: 'Staff Profiles (Cash Bank)', icon: UserCheck },
  ];

  const isPesitActive = currentPath.startsWith('/pesit-');
  const isRevenueActive = [
    '/refund-requests',
    '/refund-history',
    '/pricing',
    '/state-gst',
    '/staff-credit',
    '/staff-profiles',
  ].includes(currentPath);
  const isAccessActive = [
    '/users',
    '/admins',
    '/employee-monitor',
    '/roles',
    '/blacklist-history',
    '/audit-logs',
  ].includes(currentPath);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      {/* Top Brand & Profile Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Tuckit Brand Logo */}
            <div
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-zinc-900 leading-none">
                  TUCK<span className="text-primary">IT</span>
                </span>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">
                  Control Center
                </span>
              </div>
            </div>
          </div>

          {/* User Profile & Account Dropdown */}
          <div className="flex items-center gap-3">
            {/* Quick Alerts Bell in Top Bar */}
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="relative p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
              title="System Alerts"
            >
              <Bell className="h-4 w-4" />
              {totalAlertsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            <div className="hidden sm:flex flex-col items-end mr-1 select-none">
              <span className="text-xs font-bold text-zinc-900 leading-tight">{session?.username || 'parash'}</span>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider leading-tight">
                {session?.role || 'SUPERADMIN'}
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-8 w-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 font-black text-xs hover:bg-zinc-200 transition-colors"
              >
                {session?.username ? session.username.charAt(0).toUpperCase() : 'P'}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="text-xs font-bold text-zinc-900">{session?.name || 'Parash Rautela'}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{session?.email || 'parash@tuckit.in'}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-zinc-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsBlacklistModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                    <span>Block / Unblock User</span>
                  </button>

                  <div className="border-t border-zinc-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span>Secure Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Horizontal Navigation Bar */}
      <div className="hidden lg:block border-b border-zinc-200 bg-white h-11 relative">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <div className="relative flex-1 min-w-0 h-full flex items-center overflow-hidden">
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollNav('left')}
                className="absolute left-0 z-20 h-full w-8 bg-gradient-to-r from-white via-white to-transparent flex items-center justify-start text-zinc-400 hover:text-zinc-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-1 h-full overflow-x-auto no-scrollbar scroll-smooth"
            >
              {/* Primary Direct Links */}
              {mainNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`h-full flex items-center gap-1.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* PESIT Dropdown Menu */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => {
                  if (pesitTimeoutRef.current) clearTimeout(pesitTimeoutRef.current);
                  setIsPesitOpen(true);
                }}
                onMouseLeave={() => {
                  pesitTimeoutRef.current = setTimeout(() => setIsPesitOpen(false), 200);
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate('/pesit-terminals')}
                  className={`h-full flex items-center gap-1 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isPesitActive
                      ? 'border-primary text-primary font-bold'
                      : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <GraduationCap className={`h-3.5 w-3.5 ${isPesitActive ? 'text-primary' : 'text-zinc-400'}`} />
                  <span>PESIT</span>
                  <ChevronDown className="h-3 w-3 ml-0.5 text-zinc-400" />
                </button>

                {isPesitOpen && (
                  <div className="absolute top-11 left-0 w-52 bg-white rounded-xl shadow-xl border border-zinc-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {pesitItems.map(sub => {
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.path}
                          type="button"
                          onClick={() => {
                            setIsPesitOpen(false);
                            navigate(sub.path);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                            currentPath === sub.path
                              ? 'bg-orange-50 text-primary font-bold'
                              : 'text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <SubIcon className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Revenue & Billing Dropdown Menu */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => {
                  if (revenueTimeoutRef.current) clearTimeout(revenueTimeoutRef.current);
                  setIsRevenueOpen(true);
                }}
                onMouseLeave={() => {
                  revenueTimeoutRef.current = setTimeout(() => setIsRevenueOpen(false), 200);
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate('/refund-requests')}
                  className={`h-full flex items-center gap-1.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isRevenueActive
                      ? 'border-primary text-primary font-bold'
                      : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <Wallet className={`h-3.5 w-3.5 ${isRevenueActive ? 'text-primary' : 'text-zinc-400'}`} />
                  <span>Revenue & Billing</span>
                  {totalBillingBadges > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white px-1 shadow-2xs">
                      {totalBillingBadges}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </button>

                {isRevenueOpen && (
                  <div className="absolute top-11 left-0 w-60 bg-white rounded-xl shadow-xl border border-zinc-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {revenueItems.map(sub => {
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.path}
                          type="button"
                          onClick={() => {
                            setIsRevenueOpen(false);
                            navigate(sub.path);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                            currentPath === sub.path
                              ? 'bg-orange-50 text-primary font-bold'
                              : 'text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <SubIcon className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{sub.label}</span>
                          </div>
                          {sub.badge && sub.badge > 0 ? (
                            <span className="h-4 px-1.5 bg-orange-500 text-white rounded-full text-[10px] font-bold">
                              {sub.badge}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Access Control Dropdown Menu */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => {
                  if (accessTimeoutRef.current) clearTimeout(accessTimeoutRef.current);
                  setIsAccessOpen(true);
                }}
                onMouseLeave={() => {
                  accessTimeoutRef.current = setTimeout(() => setIsAccessOpen(false), 200);
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  className={`h-full flex items-center gap-1 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isAccessActive
                      ? 'border-primary text-primary font-bold'
                      : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <ShieldCheck className={`h-3.5 w-3.5 ${isAccessActive ? 'text-primary' : 'text-zinc-400'}`} />
                  <span>Access Control</span>
                  <ChevronDown className="h-3 w-3 ml-0.5 text-zinc-400" />
                </button>

                {isAccessOpen && (
                  <div className="absolute top-11 left-0 w-56 bg-white rounded-xl shadow-xl border border-zinc-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccessOpen(false);
                        navigate('/users');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Users (Customers)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccessOpen(false);
                        navigate('/admins');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                      <UserCog className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Internal Admins</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccessOpen(false);
                        navigate('/employee-monitor');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                      <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Employee Monitor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccessOpen(false);
                        navigate('/roles');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                      <Lock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Roles & RBAC</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccessOpen(false);
                        navigate('/blacklist-history');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                      <ShieldAlert className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Block / Unblock History</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccessOpen(false);
                        navigate('/audit-logs');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                      <ClipboardList className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Audit Logs</span>
                    </button>
                  </div>
                )}
              </div>

              {/* System Alerts */}
              <button
                type="button"
                onClick={() => navigate('/alerts')}
                className={`h-full flex items-center gap-1.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  currentPath === '/alerts'
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <Bell className={`h-3.5 w-3.5 ${currentPath === '/alerts' ? 'text-primary' : 'text-zinc-400'}`} />
                <span>System Alerts</span>
              </button>
            </div>

            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollNav('right')}
                className="absolute right-0 z-20 h-full w-8 bg-gradient-to-l from-white via-white to-transparent flex items-center justify-end text-zinc-400 hover:text-zinc-900"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Prominent Dark CTA: Control Center */}
          <button
            type="button"
            onClick={() => setIsControlCenterOpen(true)}
            className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sliders className="h-3.5 w-3.5 text-primary" />
            <span>Control Center</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl p-4 flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">
                  T
                </div>
                <span className="font-black text-base tracking-tight text-zinc-900">TUCKIT</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 custom-scrollbar">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider px-2">Main</p>
                {mainNavItems.map(item => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(item.path);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg ${
                      currentPath === item.path ? 'bg-orange-50 text-primary font-bold' : 'text-zinc-700'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider px-2">PESIT</p>
                {pesitItems.map(item => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(item.path);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg"
                  >
                    <item.icon className="h-4 w-4 text-zinc-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider px-2">
                  Revenue & Billing
                </p>
                {revenueItems.map(item => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(item.path);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 text-zinc-400" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="h-4 px-1.5 bg-orange-500 text-white rounded-full text-[10px]">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider px-2">
                  Access Control
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/users');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  <Users className="h-4 w-4 text-zinc-400" />
                  <span>Users (Customers)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/admins');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  <UserCog className="h-4 w-4 text-zinc-400" />
                  <span>Internal Admins</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/roles');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  <Lock className="h-4 w-4 text-zinc-400" />
                  <span>Roles & RBAC</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/audit-logs');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  <ClipboardList className="h-4 w-4 text-zinc-400" />
                  <span>Audit Logs</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsControlCenterOpen(true);
                }}
                className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2"
              >
                <Sliders className="h-4 w-4" />
                <span>Open Control Center</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control Center Drawer */}
      <ControlCenterDrawer isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} />

      {/* Quick Blacklist Modal */}
      <BlacklistUserModal isOpen={isBlacklistModalOpen} onClose={() => setIsBlacklistModalOpen(false)} />
    </header>
  );
};
