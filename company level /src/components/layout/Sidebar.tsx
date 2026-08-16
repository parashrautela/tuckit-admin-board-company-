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
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Lock,
} from 'lucide-react';
import { ControlCenterDrawer } from '../control-center/ControlCenterDrawer';
import { BlacklistUserModal } from '../modals/BlacklistUserModal';

interface NavItem {
  path: string;
  label: string;
  icon: any;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { session, logout } = useAuth();
  const { pendingRefundsCount, pendingStaffCreditsCount, totalAlertsCount } = useRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Track which groups are expanded (all expanded by default)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    main: true,
    pesit: true,
    revenue: true,
    access: true,
  });

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleGroup = (key: string) => {
    if (isCollapsed) return;
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups: { key: string; group: NavGroup }[] = [
    {
      key: 'main',
      group: {
        title: 'Main',
        items: [
          { path: '/dashboard', label: 'Dashboard & Main View', icon: LayoutDashboard },
          { path: '/reports', label: 'Reports & Analysis', icon: BarChart3 },
          { path: '/device-status', label: 'Device / Terminal Status', icon: MonitorCheck },
          { path: '/locker-status', label: 'Locker Status', icon: Grid },
          { path: '/future-first', label: 'Future First', icon: Building2 },
        ],
      },
    },
    {
      key: 'pesit',
      group: {
        title: 'PESIT Locker',
        items: [
          { path: '/pesit-terminals', label: 'PESIT Terminals', icon: MonitorCheck },
          { path: '/pesit-students', label: 'Student Management', icon: GraduationCap },
          { path: '/pesit-managers', label: 'Locker Managers', icon: Users2 },
        ],
      },
    },
    {
      key: 'revenue',
      group: {
        title: 'Revenue & Billing',
        items: [
          { path: '/refund-requests', label: 'Refund Requests', icon: RotateCcw, badge: pendingRefundsCount },
          { path: '/refund-history', label: 'Refund History', icon: Receipt },
          { path: '/pricing', label: 'Pricing Control', icon: Tag },
          { path: '/state-gst', label: 'State GST Config', icon: FileSpreadsheet },
          { path: '/staff-credit', label: 'Staff Credit Request', icon: Wallet, badge: pendingStaffCreditsCount },
          { path: '/staff-profiles', label: 'Staff Profiles', icon: UserCheck },
        ],
      },
    },
    {
      key: 'access',
      group: {
        title: 'User Management',
        items: [
          { path: '/users', label: 'Customers', icon: Users },
          { path: '/admins', label: 'Internal Admins', icon: UserCog },
          { path: '/employee-monitor', label: 'Employee Monitor', icon: UserCheck },
          { path: '/roles', label: 'Roles & RBAC', icon: Lock },
          { path: '/blacklist-history', label: 'Block / Unblock History', icon: ShieldAlert },
          { path: '/audit-logs', label: 'Audit Logs', icon: ClipboardList },
        ],
      },
    },
  ];

  const isGroupActive = (items: NavItem[]) => items.some(i => currentPath === i.path);

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col ${sidebarWidth} h-screen bg-white border-r border-hairline fixed left-0 top-0 z-40 transition-all duration-200 ease-in-out`}
      >
        {/* ── Logo & Collapse Toggle ── */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-hairline-soft shrink-0">
          {!isCollapsed && (
            <div
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-base shrink-0 group-hover:scale-105 transition-transform">
                T
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-[17px] tracking-tight text-ink leading-none">
                  TUCK<span className="text-primary">IT</span>
                </span>
                <span className="text-[9px] font-semibold text-ink-subtle uppercase tracking-widest leading-tight">
                  Control Center
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div
              onClick={() => navigate('/dashboard')}
              className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-base cursor-pointer mx-auto hover:scale-105 transition-transform"
            >
              T
            </div>
          )}

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-zinc-100 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Nav Groups ── */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-3 px-2 space-y-1">
          {navGroups.map(({ key, group }) => {
            const isExpanded = expandedGroups[key];
            const groupActive = isGroupActive(group.items);

            return (
              <div key={key} className="mb-1">
                {/* Group Header / Eyebrow */}
                {!isCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(key)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      groupActive ? 'text-primary' : 'text-ink-subtle hover:text-ink-muted'
                    }`}
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${
                        isExpanded ? '' : '-rotate-90'
                      }`}
                    />
                  </button>
                ) : (
                  <div className="h-px bg-hairline-soft mx-2 my-2" />
                )}

                {/* Group Items */}
                <div
                  className={`space-y-0.5 overflow-hidden transition-all duration-200 ${
                    isCollapsed || isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;

                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => navigate(item.path)}
                        title={isCollapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-2.5 rounded-md transition-all duration-150 group relative ${
                          isCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-[7px]'
                        } ${
                          isActive
                            ? 'bg-orange-50 text-primary font-semibold'
                            : 'text-ink-muted hover:bg-zinc-50 hover:text-ink'
                        }`}
                      >
                        {/* Active left accent bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary" />
                        )}

                        <Icon className={`h-[18px] w-[18px] shrink-0 ${
                          isActive ? 'text-primary' : 'text-ink-subtle group-hover:text-ink-muted'
                        }`} />

                        {!isCollapsed && (
                          <span className="text-[13px] truncate flex-1 text-left">
                            {item.label}
                          </span>
                        )}

                        {!isCollapsed && item.badge && item.badge > 0 && (
                          <span className="h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}

                        {isCollapsed && item.badge && item.badge > 0 && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── Bottom Section ── */}
        <div className="shrink-0 border-t border-hairline-soft px-2 py-3 space-y-1.5">
          {/* System Alerts */}
          <button
            type="button"
            onClick={() => navigate('/alerts')}
            className={`w-full flex items-center gap-2.5 rounded-md transition-all duration-150 ${
              isCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-[7px]'
            } ${
              currentPath === '/alerts'
                ? 'bg-orange-50 text-primary font-semibold'
                : 'text-ink-muted hover:bg-zinc-50 hover:text-ink'
            }`}
          >
            <div className="relative shrink-0">
              <Bell className={`h-[18px] w-[18px] ${currentPath === '/alerts' ? 'text-primary' : 'text-ink-subtle'}`} />
              {totalAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
              )}
            </div>
            {!isCollapsed && (
              <>
                <span className="text-[13px] truncate flex-1 text-left">System Alerts</span>
                {totalAlertsCount > 0 && (
                  <span className="h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {totalAlertsCount}
                  </span>
                )}
              </>
            )}
          </button>

          {/* Control Center CTA */}
          <button
            type="button"
            onClick={() => setIsControlCenterOpen(true)}
            className={`w-full flex items-center gap-2.5 rounded-md bg-zinc-900 hover:bg-black text-white transition-all duration-150 ${
              isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'
            }`}
            title={isCollapsed ? 'Control Center' : undefined}
          >
            <Sliders className="h-[16px] w-[16px] text-primary shrink-0" />
            {!isCollapsed && (
              <span className="text-[13px] font-semibold">Control Center</span>
            )}
          </button>

          {/* Expand button (collapsed only) */}
          {isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="w-full flex items-center justify-center py-2 rounded-md text-ink-subtle hover:text-ink hover:bg-zinc-100 transition-colors"
              title="Expand sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}

          {/* User Profile Pill */}
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`w-full flex items-center gap-2.5 rounded-md hover:bg-zinc-50 transition-colors ${
                isCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-2'
              }`}
            >
              <div className="h-7 w-7 rounded-md bg-zinc-100 border border-hairline flex items-center justify-center text-ink font-bold text-xs shrink-0">
                {session?.username ? session.username.charAt(0).toUpperCase() : 'P'}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <span className="text-[12px] font-semibold text-ink leading-tight truncate w-full text-left">
                    {session?.username || 'parash'}
                  </span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider leading-tight">
                    {session?.role || 'SUPERADMIN'}
                  </span>
                </div>
              )}
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className={`absolute ${isCollapsed ? 'left-16' : 'left-0'} bottom-full mb-2 w-56 bg-white rounded-xl shadow-lg border border-hairline py-1 z-50`}>
                <div className="px-4 py-2.5 border-b border-hairline-soft">
                  <p className="text-[13px] font-semibold text-ink">{session?.name || 'Parash Rautela'}</p>
                  <p className="text-[11px] text-ink-muted truncate">{session?.email || 'parash@tuckit.in'}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-ink-muted hover:bg-zinc-50 hover:text-ink transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>View Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsBlacklistModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Block / Unblock User</span>
                </button>

                <div className="border-t border-hairline-soft my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Secure Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Control Center Drawer */}
      <ControlCenterDrawer isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} />

      {/* Quick Blacklist Modal */}
      <BlacklistUserModal isOpen={isBlacklistModalOpen} onClose={() => setIsBlacklistModalOpen(false)} />
    </>
  );
};
