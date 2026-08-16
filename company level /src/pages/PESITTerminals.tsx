import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import {
  GraduationCap,
  Unlock,
  MessageSquare,
  ShieldAlert,
  Search,
  CheckCircle2,
  RefreshCw,
  Zap,
  Building,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

export const PESITTerminals: React.FC = () => {
  const { terminals, showToast } = useRealtime();
  const [search, setSearch] = useState('');
  const [forceAllModalTerminal, setForceAllModalTerminal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pesitTerminals = terminals.filter(
    t => t.siteType === 'PESIT' || t.siteType === 'COLLEGE' || t.siteName.includes('PES') || t.siteName.includes('HKBK') || t.siteName.includes('College')
  );

  const filtered = pesitTerminals.filter(
    t => !search || t.code.toLowerCase().includes(search.toLowerCase()) || t.siteName.toLowerCase().includes(search.toLowerCase())
  );

  const handleForceOpenAll = () => {
    if (!forceAllModalTerminal) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Emergency unlock command dispatched: All doors on ${forceAllModalTerminal} unlocked!`, 'success');
      setForceAllModalTerminal(null);
    }, 1000);
  };

  const handleSendCredentials = (code: string) => {
    showToast(`Student RFID & access credentials SMS dispatched for terminal ${code}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-600 rounded-xl text-white shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-zinc-900 tracking-tight">PESIT Campus Locker Terminals</h1>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded-full uppercase">
                INSTITUTIONAL HUB
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Manage student hostel kiosks, RFID card synchronization, and campus emergency overrides
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => showToast('Campus locker cluster status synced', 'info')}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Sync Status
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search campus terminals by code or block name..."
            className="w-full pl-10 pr-4 h-9 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-primary"
          />
        </div>
      </div>

      {/* Terminal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black font-mono text-zinc-900">{t.code}</span>
              <StatusBadge status={t.connectivityStatus} pulse={t.connectivityStatus === 'ONLINE'} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-900 truncate">{t.siteName}</h3>
              <p className="text-xs text-purple-700 font-semibold mt-0.5">{t.city}, {t.state}</p>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Lockers:</span>
                <span className="font-bold text-zinc-900">{t.totalLockers} Total ({t.availableLockers} Free)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Firmware:</span>
                <span className="font-mono text-zinc-800">{t.firmwareVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Heartbeat:</span>
                <span className="font-mono text-emerald-600 font-bold">{t.heartbeatSecondsAgo}s ago</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSendCredentials(t.code)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold rounded-xl transition-colors"
              >
                <MessageSquare className="h-3 w-3 text-purple-600" /> Send SMS
              </button>

              <button
                type="button"
                onClick={() => setForceAllModalTerminal(t.code)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold rounded-xl transition-colors border border-red-200"
              >
                <Unlock className="h-3 w-3" /> Force Open All
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Force Open All Confirmation Modal */}
      <Modal
        isOpen={!!forceAllModalTerminal}
        onClose={() => setForceAllModalTerminal(null)}
        title="Emergency Campus Protocol: Force Open All Doors"
        subtitle={`Terminal: ${forceAllModalTerminal}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <strong className="block font-bold">EMERGENCY ACTION WARNING</strong>
              This command will broadcast simultaneous unlatch signals to all solenoid relays on this campus terminal. All student lockers will spring open immediately.
            </div>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            Please confirm that this action is authorized by the Campus Hostel Warden or Facility In-Charge for scheduled maintenance or emergency evacuation.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setForceAllModalTerminal(null)}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleForceOpenAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Transmitting...' : 'Confirm Force Open All'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
