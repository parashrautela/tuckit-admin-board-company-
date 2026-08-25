import React, { useState, useMemo } from 'react';
import { Globe, MapPin, Search, CheckCircle2, AlertTriangle, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StateCoverageItem {
  state: string;
  total: number;
  online: number;
  offline: number;
  cities?: string[];
}

interface RegionalTelemetryHubProps {
  stateCoverage: StateCoverageItem[];
  stateFilter: string;
  setStateFilter: (state: string) => void;
  totalTerminals: number;
  onlineDevices: number;
  offlineDevices: number;
}

export const RegionalTelemetryHub: React.FC<RegionalTelemetryHubProps> = ({
  stateCoverage,
  stateFilter,
  setStateFilter,
  totalTerminals,
  onlineDevices,
  offlineDevices,
}) => {
  const [stateSearch, setStateSearch] = useState('');

  // Top 6 largest deployment hubs
  const topHubs = useMemo(() => {
    return stateCoverage.slice(0, 6);
  }, [stateCoverage]);

  // Filtered list for the state directory
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return stateCoverage;
    const q = stateSearch.toLowerCase();
    return stateCoverage.filter(
      s => s.state.toLowerCase().includes(q) || (s.cities || []).some(c => c.toLowerCase().includes(q))
    );
  }, [stateCoverage, stateSearch]);

  const nationalUptime = totalTerminals > 0 ? Math.round((onlineDevices / totalTerminals) * 100) : 100;

  return (
    <Card className="border border-neutral-200 shadow-2xs overflow-hidden">
      {/* Header */}
      <CardHeader className="p-5 pb-4 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-primary-500" />
            <CardTitle className="text-base font-bold text-neutral-900 tracking-tight">
              Regional Telemetry & State Coverage
            </CardTitle>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Geographic node concentration, state-level health indicators, and regional telemetry dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {stateFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => setStateFilter('ALL')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFE5C6] hover:bg-[#FFD7A8] text-neutral-900 border border-[#FFC898]/70 text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Filtered: {stateFilter}</span>
              <X className="size-3 text-neutral-700" />
            </button>
          )}

          <Badge variant="outline" size="sm" className="text-neutral-600 font-mono font-medium">
            {stateCoverage.length} Active States · {totalTerminals} Total Nodes
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Top Deployment Hubs (Ranked Fleet Concentration) ── */}
        <div className="lg:col-span-6 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Primary Deployment Hubs
            </div>
            <span className="text-xs text-neutral-500 font-mono">By Node Count</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {topHubs.map(hub => {
              const onlinePct = hub.total > 0 ? Math.round((hub.online / hub.total) * 100) : 100;
              const fleetSharePct = totalTerminals > 0 ? Math.round((hub.total / totalTerminals) * 100) : 0;
              const isSelected = stateFilter === hub.state;

              return (
                <div
                  key={hub.state}
                  onClick={() => setStateFilter(isSelected ? 'ALL' : hub.state)}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-amber-50/40 border-primary ring-1 ring-primary/40 shadow-xs'
                      : 'bg-white hover:bg-neutral-50/80 border-neutral-200/80 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors truncate">
                        {hub.state}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono shrink-0">
                        {hub.cities?.length ? `${hub.cities.length} ${hub.cities.length === 1 ? 'City' : 'Cities'}` : 'Regional Fleet'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-xs">
                      <span className="font-mono font-bold text-neutral-900">
                        {hub.online}/{hub.total}
                      </span>
                      <span
                        className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                          hub.offline === 0
                            ? 'bg-neutral-100 text-neutral-700'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}
                      >
                        {onlinePct}% Uptime
                      </span>
                    </div>
                  </div>

                  {/* Multi-Tone Concentration Progress Bar */}
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                    {/* Online segment in soft warm amber */}
                    <div
                      className="h-full bg-[#E58A3C] rounded-full transition-all duration-500"
                      style={{ width: `${(hub.online / hub.total) * 100}%` }}
                      title={`${hub.online} Online`}
                    />
                    {/* Offline segment in soft rose/red if present */}
                    {hub.offline > 0 && (
                      <div
                        className="h-full bg-rose-400 rounded-full transition-all duration-500"
                        style={{ width: `${(hub.offline / hub.total) * 100}%` }}
                        title={`${hub.offline} Offline`}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                    <span>{fleetSharePct}% of National Fleet</span>
                    <span className={hub.offline > 0 ? 'text-rose-600 font-semibold' : 'text-neutral-600'}>
                      {hub.offline > 0 ? `${hub.offline} Nodes Offline` : 'All Nodes Online'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Regional Summary Badge Strip */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs text-neutral-600 mt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="size-2 rounded-full bg-primary-500" />
              <span>National Fleet Health:</span>
              <strong className="text-neutral-900 font-mono">{nationalUptime}% Uptime</strong>
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              {offlineDevices} Offline Total
            </span>
          </div>
        </div>

        {/* ── Right Column: Interactive State Matrix Directory ── */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              State Coverage Directory
            </div>

            {/* Quick State Search Input */}
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-neutral-400" />
              <input
                type="text"
                value={stateSearch}
                onChange={e => setStateSearch(e.target.value)}
                placeholder="Search state..."
                className="w-full pl-8 pr-2.5 h-8 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-primary transition-colors text-neutral-900 placeholder:text-neutral-400 font-medium"
              />
            </div>
          </div>

          {/* Compact Scrollable State Matrix Table */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white max-h-[345px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-600 uppercase tracking-wider select-none z-10">
                <tr>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3 text-center">Nodes</th>
                  <th className="py-2.5 px-3 text-center">Health</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredStates.map(st => {
                  const isSelected = stateFilter === st.state;
                  const isAllOnline = st.offline === 0;

                  return (
                    <tr
                      key={st.state}
                      onClick={() => setStateFilter(isSelected ? 'ALL' : st.state)}
                      className={`hover:bg-neutral-50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-50/50 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className={`size-3.5 shrink-0 ${isSelected ? 'text-primary-600' : 'text-neutral-400'}`} />
                          <span className={`text-xs ${isSelected ? 'text-primary-900 font-bold' : 'text-neutral-800'}`}>
                            {st.state}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-neutral-900 text-xs">
                        <span>{st.online}</span>
                        <span className="text-neutral-400 font-normal"> / {st.total}</span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
                            isAllOnline
                              ? 'bg-neutral-100 text-neutral-700'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isAllOnline ? 'bg-neutral-400' : 'bg-rose-500'
                            }`}
                          />
                          <span>{isAllOnline ? '100%' : `${st.offline} Offline`}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            isSelected ? 'text-primary-700' : 'text-neutral-500 hover:text-neutral-800'
                          }`}
                        >
                          <span>{isSelected ? 'Active' : 'Filter'}</span>
                          <ArrowUpRight className="size-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
