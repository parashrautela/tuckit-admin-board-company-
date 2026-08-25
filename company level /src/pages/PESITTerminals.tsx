import React, { useState, useMemo } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { DestructiveActionModal } from '../components/common/DestructiveActionModal';
import {
  GraduationCap,
  Unlock,
  MessageSquare,
  Search,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const PESITTerminals: React.FC = () => {
  const { terminals, showToast, addAuditLog } = useRealtime();
  const [search, setSearch] = useState('');
  const [forceAllModalTerminal, setForceAllModalTerminal] = useState<string | null>(null);

  const pesitTerminals = useMemo(() => {
    return terminals.filter(
      t =>
        t.siteType === 'PESIT' ||
        t.siteType === 'COLLEGE' ||
        t.siteName.includes('PES') ||
        t.siteName.includes('HKBK') ||
        t.siteName.includes('College')
    );
  }, [terminals]);

  const filtered = useMemo(() => {
    if (!search.trim()) return pesitTerminals;
    const query = search.toLowerCase().trim();
    return pesitTerminals.filter(
      t => t.code.toLowerCase().includes(query) || t.siteName.toLowerCase().includes(query)
    );
  }, [pesitTerminals, search]);

  const selectedTerminalObj = useMemo(() => {
    return terminals.find(t => t.code === forceAllModalTerminal);
  }, [terminals, forceAllModalTerminal]);

  const handleForceOpenAll = async (reason: string) => {
    if (!forceAllModalTerminal) return;
    const termCode = forceAllModalTerminal;
    addAuditLog('TERMINAL_FORCE_OPEN_ALL', 'TERMINAL', termCode, `Broadcast emergency unlock to all lockers: ${reason}`, 'WARNING');
    showToast(`Emergency unlock command dispatched: All doors on ${termCode} unlocked!`, 'success');
    setForceAllModalTerminal(null);
  };

  const handleSendCredentials = (code: string) => {
    addAuditLog('SMS_CREDENTIALS_DISPATCH', 'TERMINAL', code, 'Dispatched student RFID and PIN credentials via SMS gateway');
    showToast(`Student RFID & access credentials SMS dispatched for terminal ${code}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-500 rounded-lg text-white shadow-2xs">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">PESIT Campus Locker Terminals</h1>
              <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 border border-primary-200 text-xs font-bold rounded-md uppercase">
                INSTITUTIONAL HUB
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Manage student hostel kiosks, RFID card synchronization, and campus emergency overrides
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => showToast('Campus locker cluster status synced', 'info')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FFE5C6] hover:bg-[#FFD7A8] text-neutral-900 border border-[#FFC898]/70 text-xs font-semibold rounded-lg transition-all shadow-xs shrink-0 h-9"
        >
          <RefreshCw className="size-4" /> <span>Sync Status</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-3.5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search campus terminals by code or block name..."
            className="w-full pl-9 pr-4 h-9 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium outline-none focus:bg-white focus:border-zinc-900 transition-colors"
          />
        </div>
      </div>

      {/* Terminal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => {
          const occupiedCount = t.totalLockers - t.availableLockers;
          return (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{t.code}</span>
                  <StatusBadge status={t.connectivityStatus} pulse={t.connectivityStatus === 'ONLINE'} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 truncate">{t.siteName}</h3>
                  <p className="text-xs text-neutral-700 font-semibold mt-0.5">{t.city}, {t.state}</p>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-600 font-medium">Lockers:</span>
                    <span className="font-bold text-zinc-900">
                      {t.totalLockers} Total ({t.availableLockers} Free, {occupiedCount} Occupied)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 font-medium">Firmware:</span>
                    <span className="font-mono text-zinc-800">{t.firmwareVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 font-medium">Heartbeat:</span>
                    <span className="font-mono text-emerald-700 font-semibold">{t.heartbeatSecondsAgo}s ago</span>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-3 border-t border-zinc-100 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSendCredentials(t.code)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FFE5C6] hover:bg-[#FFD7A8] text-neutral-900 border border-[#FFC898]/70 text-xs font-semibold rounded-lg transition-colors shadow-xs h-9"
                >
                  <MessageSquare className="size-4 text-neutral-700" />
                  <span>Send SMS Credentials</span>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setForceAllModalTerminal(t.code)}
                    className="text-xs text-zinc-500 hover:text-rose-600 font-medium transition-colors inline-flex items-center gap-1.5 hover:underline pt-0.5"
                  >
                    <Unlock className="size-3.5" />
                    <span>Emergency: Force Open All Doors</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Whole-Terminal Bulk Unlock Confirmation Modal */}
      {forceAllModalTerminal && (
        <DestructiveActionModal
          isOpen={!!forceAllModalTerminal}
          onClose={() => setForceAllModalTerminal(null)}
          onConfirm={handleForceOpenAll}
          title="Emergency Protocol: Force Open All Terminal Doors"
          subtitle={`Terminal ${forceAllModalTerminal} (${selectedTerminalObj?.siteName || 'Campus Station'})`}
          actionLabel="Execute Fleet Unlock"
          severity="bulk"
          targetCode={forceAllModalTerminal}
          affectedCountText={`This will broadcast simultaneous solenoid unlatch pulses to open all ${selectedTerminalObj?.totalLockers || 24} lockers (${selectedTerminalObj ? selectedTerminalObj.totalLockers - selectedTerminalObj.availableLockers : 8} currently occupied) on terminal ${forceAllModalTerminal}.`}
          auditWarning="Emergency whole-terminal unlock events are permanently recorded in the central compliance audit trail with operator identity and network origin."
          checkboxLabel="I confirm that Campus Hostel Warden or Facility In-Charge authorization is on file."
          reasonPlaceholder="State evacuation or warden emergency authorization reference..."
        />
      )}
    </div>
  );
};
