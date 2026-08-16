import React, { useState, useMemo } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Building2,
  BatteryCharging,
  Sun,
  Zap,
  Radio,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Power,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

interface FutureFirstStation {
  id: string;
  code: string;
  name: string;
  type: 'FUTURE_FIRST' | 'SAAS_LOCKER' | 'FOOTY_LOCKER';
  location: string;
  batteryLevel: number;
  solarWatts: number;
  signalDbm: number;
  totalLockers: number;
  occupiedLockers: number;
  status: 'ONLINE' | 'OFFLINE';
  lastHeartbeat: string;
  activeReservations: number;
}

const initialStations: FutureFirstStation[] = [
  { id: 'FF-01', code: 'FF-BLR-SPORTS-01', name: 'Padukone-Dravid Centre for Sports Excellence', type: 'FUTURE_FIRST', location: 'Bengaluru, Karnataka', batteryLevel: 98, solarWatts: 140, signalDbm: -68, totalLockers: 32, occupiedLockers: 14, status: 'ONLINE', lastHeartbeat: '12s ago', activeReservations: 6 },
  { id: 'FF-02', code: 'FF-MUM-FOOTY-01', name: 'Cooperage Football Ground Arena', type: 'FOOTY_LOCKER', location: 'Mumbai, Maharashtra', batteryLevel: 84, solarWatts: 95, signalDbm: -74, totalLockers: 24, occupiedLockers: 19, status: 'ONLINE', lastHeartbeat: '5s ago', activeReservations: 4 },
  { id: 'FF-03', code: 'FF-DEL-SAAS-01', name: 'Cyber City Corporate Hub Station', type: 'SAAS_LOCKER', location: 'Gurugram, Haryana', batteryLevel: 100, solarWatts: 210, signalDbm: -62, totalLockers: 48, occupiedLockers: 28, status: 'ONLINE', lastHeartbeat: 'Just now', activeReservations: 12 },
  { id: 'FF-04', code: 'FF-HYD-SPORTS-02', name: 'Gachibowli Stadium Training Complex', type: 'FUTURE_FIRST', location: 'Hyderabad, Telangana', batteryLevel: 42, solarWatts: 20, signalDbm: -88, totalLockers: 32, occupiedLockers: 8, status: 'OFFLINE', lastHeartbeat: '14m ago', activeReservations: 0 },
];

export const FutureFirst: React.FC = () => {
  const { showToast } = useRealtime();
  const [stations, setStations] = useState<FutureFirstStation[]>(initialStations);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return stations.filter(s => {
      if (typeFilter !== 'ALL' && s.type !== typeFilter) return false;
      if (search && !s.code.toLowerCase().includes(search.toLowerCase()) && !s.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [stations, search, typeFilter]);

  const totalOccupied = stations.reduce((a, b) => a + b.occupiedLockers, 0);
  const totalCapacity = stations.reduce((a, b) => a + b.totalLockers, 0);
  const totalReservations = stations.reduce((a, b) => a + b.activeReservations, 0);

  const handleRebootStation = (code: string) => {
    showToast(`Remote power cycle signal sent to station ${code}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-zinc-900 tracking-tight">Future First Locker Management</h1>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                PARTNER ECOSYSTEM
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Dedicated off-grid, solar-hybrid, and SaaS partner locker stations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => showToast('Future First station telemetry synced', 'info')}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Sync Telemetry
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-600" /> Total Stations
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-1">{stations.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">3 Active / 1 Maintenance</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> Total Capacity
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-1">{totalCapacity} Lockers</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-0.5">{totalOccupied} Currently Occupied</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarCheck className="h-3.5 w-3.5 text-primary" /> Active Reservations
          </div>
          <div className="text-2xl font-black text-primary mt-1">{totalReservations}</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-0.5">Advance mobile bookings</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-amber-500" /> Solar Yield
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">465 W</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Clean off-grid power</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search partner stations by code or location..."
            className="w-full pl-10 pr-4 h-9 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-primary"
          />
        </div>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800"
        >
          <option value="ALL">All Partner Types</option>
          <option value="FUTURE_FIRST">Future First</option>
          <option value="FOOTY_LOCKER">Footy Locker</option>
          <option value="SAAS_LOCKER">SaaS Locker</option>
        </select>
      </div>

      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-mono text-zinc-900">{s.code}</span>
                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] font-bold rounded-md uppercase">
                  {s.type.replace('_', ' ')}
                </span>
              </div>
              <StatusBadge status={s.status} pulse={s.status === 'ONLINE'} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-900">{s.name}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{s.location}</p>
            </div>

            {/* Hardware & Sensor Telemetry */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
              <div className="flex items-center gap-2">
                <BatteryCharging className={`h-4 w-4 ${s.batteryLevel > 50 ? 'text-emerald-600' : 'text-amber-500'}`} />
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Battery</div>
                  <div className="font-bold font-mono text-zinc-900">{s.batteryLevel}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Solar</div>
                  <div className="font-bold font-mono text-zinc-900">{s.solarWatts} W</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-sky-500" />
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Signal</div>
                  <div className="font-bold font-mono text-zinc-900">{s.signalDbm} dBm</div>
                </div>
              </div>
            </div>

            {/* Occupancy Bar */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-zinc-500">Locker Occupancy</span>
                <span className="font-bold text-zinc-900">{s.occupiedLockers} / {s.totalLockers} ({Math.round((s.occupiedLockers / s.totalLockers) * 100)}%)</span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${(s.occupiedLockers / s.totalLockers) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-mono">Heartbeat: {s.lastHeartbeat}</span>
              <button
                type="button"
                onClick={() => handleRebootStation(s.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-800 text-xs font-bold rounded-lg transition-colors"
              >
                <Power className="h-3.5 w-3.5" /> Power Cycle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
