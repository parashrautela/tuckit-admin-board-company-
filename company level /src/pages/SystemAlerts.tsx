import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ShieldAlert,
  WifiOff,
  RotateCcw,
  Search,
  Filter,
  Layers,
  Zap,
  Check,
} from 'lucide-react';

interface TelemetryIncident {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  terminalCode: string;
  siteName: string;
  timestamp: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
}

const initialIncidents: TelemetryIncident[] = [
  { id: 'ALT-101', severity: 'CRITICAL', title: 'Heartbeat Timeout / Offline Cluster', message: 'No telemetry frame received for 180 seconds on SIM 4G gateway.', terminalCode: 'HKBKCBELB', siteName: 'HKBK College Of Engineering (Boys Hostel)', timestamp: '3 mins ago', status: 'ACTIVE' },
  { id: 'ALT-102', severity: 'WARNING', title: 'Solenoid Sensor Response Latency', message: 'Locker #04 latch feedback delayed by 2400ms exceeding nominal 500ms limit.', terminalCode: 'TCK-MUM-001', siteName: 'Phoenix Marketcity Kurla (North Court)', timestamp: '12 mins ago', status: 'ACTIVE' },
  { id: 'ALT-103', severity: 'WARNING', title: 'High Ambient Temperature Alert', message: 'Linaro SBC thermal sensor reading 74°C. Fan speed adjusted to maximum.', terminalCode: 'AIRP-HYD-01', siteName: 'Rajiv Gandhi International Airport (Arrivals)', timestamp: '25 mins ago', status: 'ACKNOWLEDGED' },
  { id: 'ALT-104', severity: 'INFO', title: 'OTA Software Update Success', message: 'Firmware successfully patched to v2.4.1 (Linaro Build 8820).', terminalCode: 'TCK-DEL-002', siteName: 'Select Citywalk Saket', timestamp: '1 hour ago', status: 'RESOLVED' },
  { id: 'ALT-105', severity: 'CRITICAL', title: 'UPS Battery Voltage Drop', message: 'External AC mains interrupted; operating on battery inverter backup (42% remaining).', terminalCode: 'TCK-CHE-003', siteName: 'Express Avenue Royapettah', timestamp: '2 hours ago', status: 'ACTIVE' },
];

export const SystemAlerts: React.FC = () => {
  const { terminals, showToast } = useRealtime();
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

  const [incidents, setIncidents] = useState<TelemetryIncident[]>(initialIncidents);

  const filtered = useMemo(() => {
    return incidents.filter(i => {
      if (severityFilter !== 'ALL' && i.severity !== severityFilter) return false;
      if (
        search &&
        !i.terminalCode.toLowerCase().includes(search.toLowerCase()) &&
        !i.title.toLowerCase().includes(search.toLowerCase()) &&
        !i.siteName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [incidents, severityFilter, search]);

  const activeCount = incidents.filter(i => i.status === 'ACTIVE').length;

  const handleStatusChange = (id: string, newStatus: TelemetryIncident['status']) => {
    setIncidents(prev =>
      prev.map(i => (i.id === id ? { ...i, status: newStatus } : i))
    );
    showToast(`Alert ${id} updated to ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Live Hardware Telemetry & Alerts
            </h1>
            {activeCount > 0 && (
              <span className="px-2.5 py-0.5 bg-red-600 text-white text-[11px] font-black rounded-full animate-pulse">
                {activeCount} CRITICAL ALARMS
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time IoT heartbeat monitor, socket disconnects, solenoid latencies, and thermal sensor alarms
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => updateParam('search', e.target.value)}
            placeholder="Search by terminal code, alert title, or site name..."
            className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-lg text-xs font-medium outline-none focus:border-primary"
          />
        </div>

        <select
          value={severityFilter}
          onChange={e => updateParam('severity', e.target.value)}
          className="h-10 px-3 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 outline-none focus:border-primary"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical Alarms</option>
          <option value="WARNING">Warnings</option>
          <option value="INFO">Information</option>
        </select>
      </div>

      {/* Alerts Grid / List */}
      <div className="space-y-3">
        {filtered.map(inc => (
          <div
            key={inc.id}
            className={`p-4 rounded-xl border bg-white shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              inc.severity === 'CRITICAL'
                ? 'border-red-200 hover:border-red-300'
                : inc.severity === 'WARNING'
                ? 'border-amber-200 hover:border-amber-300'
                : 'border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`p-2.5 rounded-lg shrink-0 ${
                  inc.severity === 'CRITICAL'
                    ? 'bg-red-50 text-red-600'
                    : inc.severity === 'WARNING'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                {inc.severity === 'CRITICAL' ? (
                  <AlertCircle className="h-5 w-5" />
                ) : inc.severity === 'WARNING' ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <Info className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs text-zinc-900">{inc.terminalCode}</span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-xs font-bold text-zinc-800">{inc.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      inc.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-700'
                        : inc.severity === 'WARNING'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{inc.message}</p>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1.5 font-mono">
                  <span>{inc.siteName}</span>
                  <span>•</span>
                  <span>{inc.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {inc.status === 'ACTIVE' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(inc.id, 'ACKNOWLEDGED')}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg transition-colors"
                >
                  Acknowledge
                </button>
              )}
              {inc.status !== 'RESOLVED' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(inc.id, 'RESOLVED')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" /> Resolve
                </button>
              )}
              {inc.status === 'RESOLVED' && (
                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-lg flex items-center gap-1 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> RESOLVED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
