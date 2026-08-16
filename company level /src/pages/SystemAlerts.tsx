import React, { useState, useMemo } from 'react';
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
  const [incidents, setIncidents] = useState<TelemetryIncident[]>(initialIncidents);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [search, setSearch] = useState('');

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
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status === 'ACTIVE').length;

  const handleAcknowledge = (id: string) => {
    setIncidents(prev => prev.map(i => (i.id === id ? { ...i, status: 'ACKNOWLEDGED' } : i)));
    showToast('Incident acknowledged by operator', 'info');
  };

  const handleResolve = (id: string) => {
    setIncidents(prev => prev.map(i => (i.id === id ? { ...i, status: 'RESOLVED' } : i)));
    showToast('Incident marked as resolved', 'success');
  };

  const handleReboot = (code: string) => {
    showToast(`Remote reboot pulse dispatched to terminal ${code}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 rounded-xl text-white shadow-sm">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-zinc-900 tracking-tight">Real-time System Alerts & Remote Diagnostics</h1>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-black rounded-full uppercase">
                CLUSTER TELEMETRY
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live hardware sensor alarms, network dropouts, power interruptions, and remote diagnostic logs
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => showToast('Telemetry alarms synced across 238 terminals', 'info')}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
        >
          <Zap className="h-3.5 w-3.5 text-amber-400" /> Acknowledge All Alarms
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-600" /> Critical Alarms
          </div>
          <div className="text-2xl font-black text-red-600 mt-1">{criticalCount}</div>
          <div className="text-[11px] text-red-600 font-semibold mt-0.5">Immediate intervention</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Active Warnings
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-1">{activeCount}</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-0.5">Hardware & temperature</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Resolved Today
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">28</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Automated recovery</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-sky-500" /> Monitored Nodes
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-1">{terminals.length}</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-0.5">Nationwide network</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search alerts by terminal code, site, or incident title..."
            className="w-full pl-10 pr-4 h-9 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-primary"
          />
        </div>

        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical Alarms</option>
          <option value="WARNING">Warnings</option>
          <option value="INFO">Informational</option>
        </select>
      </div>

      {/* Alarms Feed */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              item.severity === 'CRITICAL'
                ? 'border-l-4 border-l-red-600 border-zinc-200'
                : item.severity === 'WARNING'
                ? 'border-l-4 border-l-amber-500 border-zinc-200'
                : 'border-l-4 border-l-sky-500 border-zinc-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                  item.severity === 'CRITICAL'
                    ? 'bg-red-50 text-red-600'
                    : item.severity === 'WARNING'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-sky-50 text-sky-600'
                }`}
              >
                {item.severity === 'CRITICAL' ? (
                  <WifiOff className="h-6 w-6" />
                ) : item.severity === 'WARNING' ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <Info className="h-6 w-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black font-mono text-zinc-900">{item.terminalCode}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      item.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-800'
                        : item.severity === 'WARNING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">• {item.timestamp}</span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 mt-1">{item.title}</h3>
                <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed max-w-2xl">{item.message}</p>
                <p className="text-[11px] text-zinc-400 font-medium mt-1">{item.siteName}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
              <button
                type="button"
                onClick={() => handleReboot(item.terminalCode)}
                className="flex items-center gap-1 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reboot
              </button>

              {item.status === 'ACTIVE' && (
                <button
                  type="button"
                  onClick={() => handleAcknowledge(item.id)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl transition-colors border border-amber-200"
                >
                  Acknowledge
                </button>
              )}

              {item.status !== 'RESOLVED' ? (
                <button
                  type="button"
                  onClick={() => handleResolve(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  <Check className="h-3.5 w-3.5" /> Resolve
                </button>
              ) : (
                <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-xs font-bold rounded-xl">
                  Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
