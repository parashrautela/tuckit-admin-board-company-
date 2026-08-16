import React from 'react';
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
  UserCog,
  ShieldAlert,
  ClipboardList,
  Bell,
  Sliders,
  X,
  LogOut,
  Lock,
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileNavItem {
  path: string;
  label: string;
  icon: any;
  badge?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { session, logout } = useAuth();
  const { pendingRefundsCount, pendingStaffCreditsCount, totalAlertsCount } = useRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const groups: { title: string; items: MobileNavItem[] }[] = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard & Main View', icon: LayoutDashboard },
        { path: '/reports', label: 'Reports & Analysis', icon: BarChart3 },
        { path: '/device-status', label: 'Device / Terminal Status', icon: MonitorCheck },
        { path: '/locker-status', label: 'Locker Status', icon: Grid },
        { path: '/future-first', label: 'Future First', icon: Building2 },
      ],
    },
    {
      title: 'PESIT Locker',
      items: [
        { path: '/pesit-terminals', label: 'PESIT Terminals', icon: MonitorCheck },
        { path: '/pesit-students', label: 'Student Management', icon: GraduationCap },
        { path: '/pesit-managers', label: 'Locker Managers', icon: Users2 },
      ],
    },
    {
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
    {
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
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-hairline-soft shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">
              T
            </div>
            <span className="font-extrabold text-base tracking-tight text-ink">
              TUCK<span className="text-primary">IT</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-ink-subtle hover:text-ink rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Groups */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3 space-y-4">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-0.5">
              <p className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider px-2 mb-1">
                {group.title}
              </p>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => go(item.path)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-primary font-semibold'
                        : 'text-ink-muted hover:bg-zinc-50 hover:text-ink'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-primary' : 'text-ink-subtle'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 ? (
                      <span className="h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}

          {/* System Alerts */}
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider px-2 mb-1">System</p>
            <button
              type="button"
              onClick={() => go('/alerts')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] transition-colors ${
                currentPath === '/alerts'
                  ? 'bg-orange-50 text-primary font-semibold'
                  : 'text-ink-muted hover:bg-zinc-50 hover:text-ink'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="h-[18px] w-[18px]" />
                <span>System Alerts</span>
              </div>
              {totalAlertsCount > 0 && (
                <span className="h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {totalAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom: User & Logout */}
        <div className="shrink-0 border-t border-hairline-soft p-3 space-y-2">
          <div className="flex items-center gap-2.5 px-2">
            <div className="h-7 w-7 rounded-md bg-zinc-100 border border-hairline flex items-center justify-center text-ink font-bold text-xs">
              {session?.username ? session.username.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-semibold text-ink truncate">{session?.username || 'parash'}</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{session?.role || 'SUPERADMIN'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { onClose(); handleLogout(); }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
