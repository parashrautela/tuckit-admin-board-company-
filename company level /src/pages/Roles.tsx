import React, { useState } from 'react';
import { ShieldCheck, Lock, Check, X, Plus } from 'lucide-react';

interface RoleDef {
  id: string;
  name: string;
  description: string;
  assignedUsers: number;
  permissions: {
    dashboard: boolean;
    deviceControl: boolean;
    forceUnlock: boolean;
    rebootKiosk: boolean;
    financialReports: boolean;
    refundApproval: boolean;
    manageAdmins: boolean;
    viewAuditLogs: boolean;
  };
}

const initialRoles: RoleDef[] = [
  {
    id: 'ROLE-01',
    name: 'SUPERADMIN',
    description: 'Unrestricted global root privileges across all terminals, billing records, firmware updates, and user management.',
    assignedUsers: 1,
    permissions: { dashboard: true, deviceControl: true, forceUnlock: true, rebootKiosk: true, financialReports: true, refundApproval: true, manageAdmins: true, viewAuditLogs: true },
  },
  {
    id: 'ROLE-02',
    name: 'OPERATIONS',
    description: 'Ground and station control: reboot terminals, force open stuck doors, inspect locker status, and monitor field employees.',
    assignedUsers: 4,
    permissions: { dashboard: true, deviceControl: true, forceUnlock: true, rebootKiosk: true, financialReports: false, refundApproval: false, manageAdmins: false, viewAuditLogs: true },
  },
  {
    id: 'ROLE-03',
    name: 'SUPPORT_AGENT',
    description: 'Customer service desk: inspect customer bookings, trigger remote SMS unlock links, initiate refund review queues.',
    assignedUsers: 6,
    permissions: { dashboard: true, deviceControl: false, forceUnlock: false, rebootKiosk: false, financialReports: false, refundApproval: true, manageAdmins: false, viewAuditLogs: false },
  },
  {
    id: 'ROLE-04',
    name: 'FINANCE',
    description: 'Accounting department: access revenue analytics, download GST tax summaries, and verify staff cash collector balances.',
    assignedUsers: 2,
    permissions: { dashboard: true, deviceControl: false, forceUnlock: false, rebootKiosk: false, financialReports: true, refundApproval: true, manageAdmins: false, viewAuditLogs: false },
  },
];

export const Roles: React.FC = () => {
  const [roles] = useState<RoleDef[]>(initialRoles);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Roles & Granular RBAC Permissions
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Configure role-based access control, operational hardware actions, and PII view permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-black text-zinc-900">{r.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] font-bold rounded-full">
                {r.assignedUsers} Users
              </span>
            </div>

            <p className="text-xs text-zinc-500 mt-2">{r.description}</p>

            <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
              {Object.entries(r.permissions).map(([perm, enabled]) => (
                <div key={perm} className="flex items-center gap-2">
                  {enabled ? (
                    <div className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0">
                      <X className="h-3 w-3" />
                    </div>
                  )}
                  <span className={`text-[11px] font-medium capitalize ${enabled ? 'text-zinc-800' : 'text-zinc-400'}`}>
                    {perm.replace(/([A-Z])/g, ' $1')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
