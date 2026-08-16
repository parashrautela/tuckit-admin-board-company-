import React, { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert, WifiOff } from 'lucide-react';
import { useRealtime } from '../context/RealtimeContext';

export const SystemAlerts: React.FC = () => {
  const { terminals } = useRealtime();

  const offlineTerminals = terminals.filter(t => t.connectivityStatus === 'OFFLINE');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Real-time System Telemetry Alerts
            </h1>
            <span className="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full">
              {offlineTerminals.length} ACTIVE INCIDENTS
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Live hardware sensor alerts, network dropouts, and critical security alarms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {offlineTerminals.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-red-200 shadow-2xs p-4 flex items-start gap-3.5 hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <WifiOff className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black font-mono text-zinc-900">{t.code}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase">
                    OFFLINE
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  Last Heartbeat: {t.heartbeatSecondsAgo > 60 ? `${Math.floor(t.heartbeatSecondsAgo / 60)}m ago` : `${t.heartbeatSecondsAgo}s ago`}
                </span>
              </div>

              <p className="text-xs font-semibold text-zinc-800 mt-1 truncate">
                {t.siteName} — {t.city}, {t.state}
              </p>

              <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-500">
                <span>Network: <strong className="text-zinc-700 font-mono">{t.networkType}</strong></span>
                <span>Firmware: <strong className="text-zinc-700 font-mono">{t.firmwareVersion}</strong></span>
                <span>Lockers: <strong className="text-zinc-700">{t.totalLockers} Total</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
