import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Terminal as TerminalIcon, Download, Eye } from 'lucide-react';
import { Modal } from '../components/common/Modal';

interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: string;
  action: string;
  target: string;
  ipAddress: string;
  details: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
}

const initialAuditLogs: AuditLog[] = [
  { id: 'LOG-9921', timestamp: '16 Aug 2024, 21:04:12', adminName: 'parash', adminRole: 'SUPERADMIN', action: 'FORCE_UNLOCK_LOCKER', target: 'Terminal: MALL-BLR-01 (Door #3)', ipAddress: '106.51.24.112', details: 'Authorized emergency manual unlock for customer ticket #99412', severity: 'WARN' },
  { id: 'LOG-9922', timestamp: '16 Aug 2024, 20:30:00', adminName: 'parash', adminRole: 'SUPERADMIN', action: 'UPDATE_PRICING_RULE', target: 'Rule: PRC-03 (Mall Large)', ipAddress: '106.51.24.112', details: 'Changed initial rate from ₹100 to ₹120', severity: 'INFO' },
  { id: 'LOG-9923', timestamp: '16 Aug 2024, 19:45:18', adminName: 'rohit_ops', adminRole: 'OPERATIONS', action: 'TERMINAL_REMOTE_REBOOT', target: 'Terminal: METRO-DEL-02', ipAddress: '49.36.128.4', details: 'Reboot triggered following 4 consecutive WS socket disconnects', severity: 'CRITICAL' },
  { id: 'LOG-9924', timestamp: '16 Aug 2024, 18:15:33', adminName: 'kavita_fin', adminRole: 'FINANCE', action: 'APPROVE_REFUND', target: 'Refund: REF-7999 (₹300)', ipAddress: '182.73.19.88', details: 'Approved double transaction refund claim via Razorpay API', severity: 'INFO' },
  { id: 'LOG-9925', timestamp: '16 Aug 2024, 17:00:21', adminName: 'parash', adminRole: 'SUPERADMIN', action: 'BLACKLIST_PHONE', target: 'Phone: +91 9988223344', ipAddress: '106.51.24.112', details: 'Physical door tamper detected on kiosk telemetry', severity: 'CRITICAL' },
];

export const AuditLogs: React.FC = () => {
  const [logs] = useState<AuditLog[]>(initialAuditLogs);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filtered = logs.filter(l => !search || l.adminName.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Enterprise System Audit Trail
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Immutable security event logging, hardware commands, rate modifications, and staff actions</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors">
          <Download className="h-3.5 w-3.5" /> Export Audit Log
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by admin, command, or terminal target..."
          className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
        />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">LOG ID</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">ACTOR / ROLE</th>
                <th className="py-3 px-4">ACTION EXECUTED</th>
                <th className="py-3 px-4">TARGET ASSET</th>
                <th className="py-3 px-4">IP ADDRESS</th>
                <th className="py-3 px-4">SEVERITY</th>
                <th className="py-3 px-4 text-right">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">{l.id}</td>
                  <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">{l.timestamp}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-zinc-900 font-mono">@{l.adminName}</div>
                    <div className="text-[10px] text-zinc-400 font-semibold">{l.adminRole}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-800 text-[11px]">{l.action}</td>
                  <td className="py-3 px-4 text-zinc-700 font-medium max-w-[200px] truncate">{l.target}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">{l.ipAddress}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        l.severity === 'CRITICAL'
                          ? 'bg-red-50 text-red-700'
                          : l.severity === 'WARN'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {l.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(l)}
                      className="text-zinc-400 hover:text-zinc-900 p-1"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Audit Event Payload Details" maxWidth="md">
        {selectedLog && (
          <div className="space-y-4">
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs space-y-2">
              <div className="flex justify-between"><span className="text-zinc-500">Log ID:</span><span className="font-mono font-bold text-zinc-900">{selectedLog.id}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Actor:</span><span className="font-mono font-bold text-zinc-900">@{selectedLog.adminName} ({selectedLog.adminRole})</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Action:</span><span className="font-mono font-bold text-primary">{selectedLog.action}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Target:</span><span className="font-bold text-zinc-800">{selectedLog.target}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">IP Origin:</span><span className="font-mono text-zinc-600">{selectedLog.ipAddress}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Timestamp:</span><span className="font-mono text-zinc-600">{selectedLog.timestamp}</span></div>
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-700 mb-1">Event Narrative:</div>
              <p className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-200">{selectedLog.details}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
