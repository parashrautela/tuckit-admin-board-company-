import React from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { MonitorCheck } from 'lucide-react';

export const PESITTerminals: React.FC = () => {
  const { terminals } = useRealtime();
  const pesitTerminals = terminals.filter(t => t.siteName.includes('PESIT') || t.siteType === 'Campus');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2"><MonitorCheck className="h-5 w-5 text-primary" /> PESIT Terminals</h1>
        <p className="text-xs text-zinc-500 mt-1">Campus locker terminal health, capacity, and batch operations</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pesitTerminals.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black font-mono text-zinc-900">{t.code}</span>
              <StatusBadge status={t.connectivityStatus} pulse={t.connectivityStatus === 'ONLINE'} />
            </div>
            <div className="text-xs font-semibold text-zinc-700 mt-1.5 truncate">{t.siteName}</div>
            <div className="mt-3 space-y-1 text-[11px]">
              <div className="flex justify-between"><span className="text-zinc-400">Lockers</span><span className="font-bold text-zinc-900">{t.totalLockers} ({t.availableLockers} free)</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Heartbeat</span><span className="font-mono font-bold text-emerald-600">{t.heartbeatSecondsAgo}s</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Firmware</span><span className="font-mono text-zinc-700">{t.firmwareVersion}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
