import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Search,
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
  const { showToast } = useRealtime();
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
            <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary-500" /> Live Hardware Telemetry & Alerts
            </h1>
            {activeCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {activeCount} CRITICAL ALARMS
              </Badge>
            )}
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Real-time IoT heartbeat monitor, socket disconnects, solenoid latencies, and thermal sensor alarms
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            value={search}
            onChange={e => updateParam('search', e.target.value)}
            placeholder="Search by terminal code, alert title, or site name..."
            className="pl-9"
          />
        </div>

        <select
          value={severityFilter}
          onChange={e => updateParam('severity', e.target.value)}
          className="flex h-9 px-3 bg-white border border-neutral-200 rounded-md text-sm text-neutral-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
            className={`p-4 rounded-lg border bg-white shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              inc.severity === 'CRITICAL'
                ? 'border-error-100'
                : inc.severity === 'WARNING'
                ? 'border-warning-100'
                : 'border-neutral-200'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`p-2.5 rounded-md shrink-0 ${
                  inc.severity === 'CRITICAL'
                    ? 'bg-error-50 text-error-500'
                    : inc.severity === 'WARNING'
                    ? 'bg-warning-50 text-warning-500'
                    : 'bg-info-50 text-info-500'
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
                  <span className="font-mono font-bold text-xs text-neutral-900">{inc.terminalCode}</span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-sm font-semibold text-neutral-900">{inc.title}</span>
                  <Badge
                    variant={
                      inc.severity === 'CRITICAL'
                        ? 'destructive'
                        : inc.severity === 'WARNING'
                        ? 'warning'
                        : 'info'
                    }
                    size="sm"
                  >
                    {inc.severity}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{inc.message}</p>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1.5 font-mono">
                  <span>{inc.siteName}</span>
                  <span>•</span>
                  <span>{inc.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {inc.status === 'ACTIVE' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(inc.id, 'ACKNOWLEDGED')}
                >
                  Acknowledge
                </Button>
              )}
              {inc.status !== 'RESOLVED' && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleStatusChange(inc.id, 'RESOLVED')}
                >
                  <Check className="h-3.5 w-3.5" /> Resolve
                </Button>
              )}
              {inc.status === 'RESOLVED' && (
                <Badge variant="outline" className="text-success-700 bg-success-50 border-success-100 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success-500" /> RESOLVED
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
