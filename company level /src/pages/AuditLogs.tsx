import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Search, Filter, Download, Eye, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const severityFilter = searchParams.get('severity') || 'ALL';

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'ALL') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const [logs] = useState<AuditLog[]>(initialAuditLogs);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filtered = logs.filter(l => {
    if (severityFilter !== 'ALL' && l.severity !== severityFilter) return false;
    if (
      search &&
      !l.adminName.toLowerCase().includes(search.toLowerCase()) &&
      !l.action.toLowerCase().includes(search.toLowerCase()) &&
      !l.target.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => updateParam('search', e.target.value)}
            placeholder="Search by actor, action, or target asset..."
            className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-lg text-xs font-medium outline-none focus:border-primary"
          />
        </div>

        <select
          value={severityFilter}
          onChange={e => updateParam('severity', e.target.value)}
          className="h-10 px-3 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 outline-none focus:border-primary"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="WARN">Warning</option>
          <option value="INFO">Info</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-400">
                    No audit logs matching current filter.
                  </td>
                </tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">{l.id}</td>
                    <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">{l.timestamp}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-800">{l.adminName}</div>
                      <div className="text-[10px] font-bold text-orange-600 uppercase">{l.adminRole}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-zinc-800">{l.action}</td>
                    <td className="py-3 px-4 text-zinc-600 font-mono text-[11px]">{l.target}</td>
                    <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">{l.ipAddress}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        l.severity === 'CRITICAL'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : l.severity === 'WARN'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {l.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(l)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Log Entry — ${selectedLog.id}`}
          subtitle={`${selectedLog.action} executed by ${selectedLog.adminName} at ${selectedLog.timestamp}`}
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Action:</span>
                <span className="font-mono font-bold text-zinc-900">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Target Asset:</span>
                <span className="font-mono text-zinc-800">{selectedLog.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Operator IP:</span>
                <span className="font-mono text-zinc-600">{selectedLog.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Severity:</span>
                <span className="font-bold">{selectedLog.severity}</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Payload & Event Details</span>
              <p className="text-zinc-700 leading-relaxed font-mono text-[11px]">{selectedLog.details}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
