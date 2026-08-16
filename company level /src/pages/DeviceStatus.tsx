import React, { useState, useMemo } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PrintQrModal } from '../components/control-center/PrintQrModal';
import { ScreenCaptureModal } from '../components/control-center/ScreenCaptureModal';
import { Terminal } from '../types';
import {
  MonitorCheck,
  Wifi,
  WifiOff,
  Activity,
  Zap,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  Printer,
  Camera,
  MapPin,
  Clock,
  Cpu,
  Signal,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';

export const DeviceStatus: React.FC = () => {
  const {
    terminals,
    stateCoverage,
    totalTerminals,
    onlineDevices,
    offlineDevices,
    onlinePercentage,
    wsConnectedCount,
    connectionDistribution,
    lastCheckedTime,
    heartbeatTick,
    refreshFeed,
  } = useRealtime();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [siteTypeFilter, setSiteTypeFilter] = useState('ALL');
  const [lockerTypeFilter, setLockerTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [networkFilter, setNetworkFilter] = useState('ALL');

  const [printQrTerminal, setPrintQrTerminal] = useState<Terminal | null>(null);
  const [captureTerminal, setCaptureTerminal] = useState<Terminal | null>(null);

  const filteredTerminals = useMemo(() => {
    return terminals.filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !t.code.toLowerCase().includes(q) &&
          !t.siteName.toLowerCase().includes(q) &&
          !t.city.toLowerCase().includes(q) &&
          !t.state.toLowerCase().includes(q)
        )
          return false;
      }
      if (stateFilter !== 'ALL' && t.state !== stateFilter) return false;
      if (cityFilter !== 'ALL' && t.city !== cityFilter) return false;
      if (siteTypeFilter !== 'ALL' && t.siteType !== siteTypeFilter) return false;
      if (lockerTypeFilter !== 'ALL' && t.lockerType !== lockerTypeFilter) return false;
      if (statusFilter !== 'ALL' && t.connectivityStatus !== statusFilter) return false;
      if (networkFilter !== 'ALL' && t.networkType !== networkFilter) return false;
      return true;
    });
  }, [terminals, searchQuery, stateFilter, cityFilter, siteTypeFilter, lockerTypeFilter, statusFilter, networkFilter]);

  const uniqueStates = useMemo(() => [...new Set(terminals.map(t => t.state))].sort(), [terminals]);
  const uniqueCities = useMemo(() => [...new Set(terminals.map(t => t.city))].sort(), [terminals]);

  const slowNetCount = useMemo(
    () => terminals.filter(t => t.connectivityStatus === 'ONLINE' && t.heartbeatSecondsAgo > 15).length,
    [terminals]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-zinc-900 tracking-tight">Terminal Control Center</h1>
            <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse-subtle shadow-sm">
              LIVE FEED
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Manage, monitor, and configure active deployed terminal hardware in real time.
          </p>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Terminals */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs relative overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <MonitorCheck className="h-3.5 w-3.5 text-zinc-400" />
            TOTAL TERMINALS
          </div>
          <div className="text-3xl font-black text-zinc-900 mt-2">{totalTerminals}</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-1">ALL CONFIGURED</div>
          <div className="text-[11px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
            <TrendingDown className="h-3 w-3" />
            ↓ -71% VS LAST MONTH
          </div>
          <div className="absolute -bottom-3 -right-3 h-16 w-16 bg-zinc-100 rounded-full opacity-50" />
        </div>

        {/* Online Devices */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs relative overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <Wifi className="h-3.5 w-3.5 text-emerald-500" />
            ONLINE DEVICES
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">{onlineDevices}</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-1">
            ONLINE <span className="text-emerald-600 font-black">{onlinePercentage}%</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
            WS CONNECTED: <span className="text-zinc-900 font-bold">{wsConnectedCount}</span>
          </div>
          <div className="absolute -bottom-3 -right-3 h-16 w-16 bg-emerald-100 rounded-full opacity-50" />
        </div>

        {/* Offline Devices */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs relative overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <WifiOff className="h-3.5 w-3.5 text-red-500" />
            OFFLINE DEVICES
          </div>
          <div className="text-3xl font-black text-red-600 mt-2">{offlineDevices}</div>
          <div className="text-[11px] text-red-600 font-bold mt-1">REQUIRES ATTENTION</div>
          <div className="text-[11px] text-blue-600 font-bold cursor-pointer hover:underline mt-0.5">
            CHECK CONNECTION LOGS
          </div>
          <div className="absolute -bottom-3 -right-3 h-16 w-16 bg-red-100 rounded-full opacity-50" />
        </div>

        {/* Connection Types */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <Signal className="h-3.5 w-3.5 text-sky-500" />
            CONNECTION TYPES
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-600 font-medium">LAN / WS</span>
              <span className="font-bold text-zinc-900">{connectionDistribution.lan}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-600 font-medium">4G SIM</span>
              <span className="font-bold text-zinc-900">{connectionDistribution.sim}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-600 font-medium">WiFi</span>
              <span className="font-bold text-zinc-900">{connectionDistribution.wifi}</span>
            </div>
          </div>
        </div>

        {/* Auto-Refresh Feed Status */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <Activity className="h-3.5 w-3.5 text-primary" />
            AUTO-REFRESH FEED
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[11px] font-bold text-emerald-600 uppercase">LIVE SYNCING</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-1">10s Intervals</div>
          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
            LAST CHECKED: <span className="text-zinc-800 font-bold">{lastCheckedTime}</span>
          </div>
          {slowNetCount > 0 && (
            <div className="text-[11px] text-amber-600 font-bold mt-0.5">
              {slowNetCount} SLOW NET
            </div>
          )}
        </div>
      </div>

      {/* State-wise Terminal Coverage */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
          State-Wise Terminal Coverage
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {stateCoverage.map(sc => {
            const onlinePct = sc.total > 0 ? Math.round((sc.online / sc.total) * 100) : 0;
            return (
              <button
                key={sc.state}
                type="button"
                onClick={() => setStateFilter(stateFilter === sc.state ? 'ALL' : sc.state)}
                className={`relative bg-white rounded-xl border p-3 text-left shadow-2xs hover:shadow-md transition-all overflow-hidden group ${
                  stateFilter === sc.state
                    ? 'border-primary ring-1 ring-primary/30 bg-orange-50/30'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="text-xs font-bold text-zinc-900 group-hover:text-primary transition-colors truncate">
                  {sc.state}
                </div>
                <div className="text-lg font-black text-zinc-900 mt-1">{sc.total}</div>

                {/* Progress Bar */}
                <div className="mt-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${onlinePct}%` }}
                  />
                </div>

                <div className="flex justify-between mt-1.5 text-[10px] font-bold">
                  <span className="text-emerald-600">{sc.online} Online</span>
                  <span className="text-red-500">{sc.offline} Offline</span>
                </div>

                {/* Decorative bg */}
                <div className="absolute -bottom-4 -right-4 h-14 w-14 rounded-full bg-zinc-50 opacity-60 group-hover:bg-orange-50 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + Filters + View Toggle */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search terminals by code, site name, city, state, type...  ⌘ K"
              className="w-full pl-10 pr-4 h-10 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
          </div>

          <button
            type="button"
            onClick={refreshFeed}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync Now
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700"
          >
            <option value="ALL">All States</option>
            {uniqueStates.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700"
          >
            <option value="ALL">All Cities</option>
            {uniqueCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={siteTypeFilter}
            onChange={e => setSiteTypeFilter(e.target.value)}
            className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700"
          >
            <option value="ALL">All Site Types</option>
            <option value="Mall">Mall</option>
            <option value="Metro">Metro</option>
            <option value="Railway">Railway</option>
            <option value="Airport">Airport</option>
            <option value="Campus">Campus</option>
            <option value="Temple">Temple</option>
            <option value="Commercial">Commercial</option>
          </select>

          <select
            value={lockerTypeFilter}
            onChange={e => setLockerTypeFilter(e.target.value)}
            className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700"
          >
            <option value="ALL">All Locker Types</option>
            <option value="BAGGAGE">Baggage</option>
            <option value="MOBILE">Mobile</option>
            <option value="HYBRID">Hybrid</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700"
          >
            <option value="ALL">All Status</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>

          <select
            value={networkFilter}
            onChange={e => setNetworkFilter(e.target.value)}
            className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700"
          >
            <option value="ALL">All Network</option>
            <option value="LAN">LAN</option>
            <option value="SIM">SIM</option>
            <option value="WiFi">WiFi</option>
            <option value="WS">WS</option>
          </select>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Showing {filteredTerminals.length} of {totalTerminals} terminals
        </div>
      </div>

      {/* Terminal Cards Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTerminals.slice(0, 40).map(t => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MonitorCheck className="h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-black font-mono text-zinc-900">{t.code}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={t.connectivityStatus} pulse={t.connectivityStatus === 'ONLINE'} />
                  <StatusBadge status={t.lifecycleStatus} />
                </div>
              </div>

              <div className="mt-2.5 text-xs font-semibold text-zinc-700 truncate">{t.siteName}</div>

              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Firmware</span>
                  <span className="text-zinc-800 font-bold font-mono">{t.firmwareVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Device Type</span>
                  <span className="text-zinc-800 font-bold">{t.deviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Location Pin</span>
                  <span className="text-zinc-800 font-bold font-mono">{t.locationPin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Heartbeat</span>
                  <span
                    className={`font-bold font-mono ${
                      t.heartbeatSecondsAgo < 15
                        ? 'text-emerald-600'
                        : t.heartbeatSecondsAgo < 60
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}
                  >
                    {t.heartbeatSecondsAgo < 60
                      ? `${t.heartbeatSecondsAgo}s ago`
                      : `${Math.floor(t.heartbeatSecondsAgo / 60)}m ago`}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPrintQrTerminal(t)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-100 hover:bg-primary hover:text-white text-zinc-700 text-[11px] font-bold rounded-lg transition-colors"
                >
                  <Printer className="h-3 w-3" />
                  Print QR
                </button>
                <button
                  type="button"
                  onClick={() => setCaptureTerminal(t)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-700 text-[11px] font-bold rounded-lg transition-colors"
                >
                  <Camera className="h-3 w-3" />
                  Capture
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Terminal List View */
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="py-3 px-3">CODE</th>
                  <th className="py-3 px-3">SITE NAME</th>
                  <th className="py-3 px-3">STATE</th>
                  <th className="py-3 px-3">CITY</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3">NETWORK</th>
                  <th className="py-3 px-3">FIRMWARE</th>
                  <th className="py-3 px-3">DEVICE</th>
                  <th className="py-3 px-3">HEARTBEAT</th>
                  <th className="py-3 px-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredTerminals.slice(0, 50).map(t => (
                  <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">{t.code}</td>
                    <td className="py-2.5 px-3 text-zinc-700 font-medium max-w-[200px] truncate">{t.siteName}</td>
                    <td className="py-2.5 px-3 text-zinc-600">{t.state}</td>
                    <td className="py-2.5 px-3 text-zinc-600">{t.city}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={t.connectivityStatus} pulse={t.connectivityStatus === 'ONLINE'} />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-zinc-700">{t.networkType}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-600">{t.firmwareVersion}</td>
                    <td className="py-2.5 px-3 text-zinc-600">{t.deviceType}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-mono font-bold ${
                          t.heartbeatSecondsAgo < 15
                            ? 'text-emerald-600'
                            : t.heartbeatSecondsAgo < 60
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {t.heartbeatSecondsAgo < 60 ? `${t.heartbeatSecondsAgo}s` : `${Math.floor(t.heartbeatSecondsAgo / 60)}m`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPrintQrTerminal(t)}
                          className="p-1.5 text-zinc-500 hover:text-primary hover:bg-orange-50 rounded-md transition-colors"
                          title="Print QR"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCaptureTerminal(t)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                          title="Capture"
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <PrintQrModal isOpen={!!printQrTerminal} onClose={() => setPrintQrTerminal(null)} terminal={printQrTerminal} />
      <ScreenCaptureModal isOpen={!!captureTerminal} onClose={() => setCaptureTerminal(null)} terminal={captureTerminal} />
    </div>
  );
};
