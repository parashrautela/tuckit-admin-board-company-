import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import {
  ShieldCheck,
  Lock,
  Check,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
  Key,
  Shield,
  Layers,
  SlidersHorizontal,
  Settings,
  Eye,
  FileSpreadsheet,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface PermissionCategory {
  id: string;
  name: string;
  permissions: { id: string; label: string; description: string }[];
}

const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'dashboard',
    name: 'Dashboard & Main View',
    permissions: [
      { id: 'PAGE:DASHBOARD', label: 'View Dashboard & Bookings', description: 'Access live booking stream and KPI summary' },
      { id: 'ACTION:FORCE_UNLOCK', label: 'Emergency Force Unlock', description: 'Trigger hardware solenoid pulse' },
      { id: 'ACTION:SMS_UNLOCK', label: 'Send SMS Fallback Link', description: 'Dispatch customer recovery SMS' },
    ],
  },
  {
    id: 'terminals',
    name: 'Hardware & Terminal Operations',
    permissions: [
      { id: 'PAGE:TERMINALS', label: 'View Terminal Cluster', description: 'Inspect 238 nationwide stations' },
      { id: 'ACTION:TERMINAL_REBOOT', label: 'Restart Terminal', description: 'Soft kiosk reload or full hardware reboot' },
      { id: 'ACTION:BATCH_COMMAND', label: 'Batch Shell Execution', description: 'Run diagnostics across cluster' },
      { id: 'ACTION:S3_FILE_TRANSFER', label: 'Push Software Updates', description: 'Deploy builds via AWS S3 pipeline' },
    ],
  },
  {
    id: 'reports',
    name: 'Financial & Export Control',
    permissions: [
      { id: 'PAGE:REPORTS', label: 'View Reports & BI Analytics', description: 'Access revenue metrics and source share' },
      { id: 'ACTION:REPORTS_EXPORT', label: 'Download Excel / CSV', description: 'Generate regional accounting reports' },
      { id: 'PAGE:REFUNDS', label: 'Manage Refund Requests', description: 'Approve or reject customer refund claims' },
    ],
  },
  {
    id: 'security',
    name: 'Security, Audit & RBAC',
    permissions: [
      { id: 'PAGE:AUDIT_LOGS', label: 'View Audit Trail', description: 'Inspect timestamped operator incident logs' },
      { id: 'ACTION:USER_BLOCK', label: 'Blacklist Customer Numbers', description: 'Restrict phone numbers across network' },
      { id: 'ACTION:ADMIN_MANAGE', label: 'Manage Internal Admins', description: 'Create and assign staff credentials' },
    ],
  },
];

interface RoleDef {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

const initialRoles: RoleDef[] = [
  {
    id: 'ROLE-01',
    name: 'SUPERADMIN',
    description: 'Unrestricted global root privileges across all terminals, billing records, firmware updates, and user management.',
    userCount: 3,
    permissions: ['PAGE:DASHBOARD', 'ACTION:FORCE_UNLOCK', 'ACTION:SMS_UNLOCK', 'PAGE:TERMINALS', 'ACTION:TERMINAL_REBOOT', 'ACTION:BATCH_COMMAND', 'ACTION:S3_FILE_TRANSFER', 'PAGE:REPORTS', 'ACTION:REPORTS_EXPORT', 'PAGE:REFUNDS', 'PAGE:AUDIT_LOGS', 'ACTION:USER_BLOCK', 'ACTION:ADMIN_MANAGE'],
  },
  {
    id: 'ROLE-02',
    name: 'OPERATIONS_LEAD',
    description: 'Ground and station control: reboot terminals, force open stuck doors, inspect locker status, and monitor field employees.',
    userCount: 8,
    permissions: ['PAGE:DASHBOARD', 'ACTION:FORCE_UNLOCK', 'ACTION:SMS_UNLOCK', 'PAGE:TERMINALS', 'ACTION:TERMINAL_REBOOT', 'PAGE:AUDIT_LOGS'],
  },
  {
    id: 'ROLE-03',
    name: 'SUPPORT_SPECIALIST',
    description: 'Customer service desk: inspect customer bookings, trigger remote SMS unlock links, initiate refund review queues.',
    userCount: 14,
    permissions: ['PAGE:DASHBOARD', 'ACTION:SMS_UNLOCK', 'PAGE:REFUNDS'],
  },
  {
    id: 'ROLE-04',
    name: 'FINANCE_AUDITOR',
    description: 'Accounting department: access revenue analytics, download GST tax summaries, and verify staff cash collector balances.',
    userCount: 4,
    permissions: ['PAGE:DASHBOARD', 'PAGE:REPORTS', 'ACTION:REPORTS_EXPORT', 'PAGE:REFUNDS'],
  },
];

export const Roles: React.FC = () => {
  const { showToast } = useRealtime();
  const [roles, setRoles] = useState<RoleDef[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<RoleDef>(initialRoles[0]);
  const [createModal, setCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRolePerms, setNewRolePerms] = useState<string[]>([]);

  const handleTogglePerm = (permId: string) => {
    if (selectedRole.name === 'SUPERADMIN') {
      showToast('Superadmin permissions are immutable global defaults', 'warning');
      return;
    }
    const updatedPerms = selectedRole.permissions.includes(permId)
      ? selectedRole.permissions.filter(p => p !== permId)
      : [...selectedRole.permissions, permId];

    const updatedRole = { ...selectedRole, permissions: updatedPerms };
    setSelectedRole(updatedRole);
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    showToast(`Permission updated for ${selectedRole.name}`, 'info');
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;

    const newRole: RoleDef = {
      id: `ROLE-${String(roles.length + 1).padStart(2, '0')}`,
      name: newRoleName.toUpperCase().replace(/\s+/g, '_'),
      description: newRoleDesc || 'Custom role policy definition',
      userCount: 0,
      permissions: newRolePerms,
    };

    setRoles(prev => [...prev, newRole]);
    setSelectedRole(newRole);
    setCreateModal(false);
    setNewRoleName('');
    setNewRoleDesc('');
    setNewRolePerms([]);
    showToast(`Role ${newRole.name} created successfully!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-zinc-900 tracking-tight">Role Engineering & Granular RBAC</h1>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-full uppercase">
                SECURITY ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Configure fine-grained system access policies, hardware controls, and PII protection slices
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" /> Create Custom Role
        </button>
      </div>

      {/* Main 2-Column Split: Roles List on Left & Granular Permission Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Role Selector Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
            Configured System Roles ({roles.length})
          </div>

          {roles.map(r => {
            const isSelected = selectedRole.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className={`h-4 w-4 ${isSelected ? 'text-indigo-600' : 'text-zinc-400'}`} />
                    <span className="text-sm font-black text-zinc-900 font-mono">{r.name}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-700 text-[10px] font-bold rounded-full shadow-2xs">
                    {r.userCount} Users
                  </span>
                </div>

                <p className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-2">{r.description}</p>

                <div className="mt-3 pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-indigo-700 font-mono">{r.permissions.length} Permissions Active</span>
                  <ChevronRight className={`h-3.5 w-3.5 ${isSelected ? 'text-indigo-600' : 'text-zinc-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Permission Policy Matrix */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-zinc-400">{selectedRole.id}</span>
                <h2 className="text-lg font-black text-zinc-900">{selectedRole.name}</h2>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{selectedRole.description}</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl self-start border border-emerald-200">
              {selectedRole.permissions.length} Active Grants
            </span>
          </div>

          {/* Categories Grid */}
          <div className="space-y-5">
            {PERMISSION_CATEGORIES.map(cat => (
              <div key={cat.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                <div className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-indigo-600" /> {cat.name}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cat.permissions.map(p => {
                    const isGranted = selectedRole.permissions.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleTogglePerm(p.id)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer select-none transition-all ${
                          isGranted
                            ? 'bg-white border-indigo-300 text-zinc-900 shadow-2xs'
                            : 'bg-zinc-100/50 border-transparent text-zinc-400 hover:bg-zinc-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isGranted}
                          onChange={() => {}}
                          className="mt-0.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <div>
                          <div className="text-xs font-bold">{p.label}</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">{p.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Create Custom RBAC Role Policy"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateRole} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Role Identifier / Name *
            </label>
            <input
              type="text"
              required
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              placeholder="e.g. REGIONAL_SUPERVISOR"
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Policy Description
            </label>
            <input
              type="text"
              value={newRoleDesc}
              onChange={e => setNewRoleDesc(e.target.value)}
              placeholder="Describe access boundary and assigned staff scope..."
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Initialize Role Policy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
