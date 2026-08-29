import React, { useState, useMemo } from 'react';
import { useRealtime } from '@/context/RealtimeContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PrintQrModal } from '@/components/control-center/PrintQrModal';
import { ScreenCaptureModal } from '@/components/control-center/ScreenCaptureModal';
import { RegionalTelemetryHub } from '@/components/control-center/RegionalTelemetryHub';
import { Terminal } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  MonitorCheck,
  Wifi,
  WifiOff,
  Activity,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  Printer,
  Camera,
  Signal,
  ChevronLeft,
  ChevronRight,
  Radio,
  Network,
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 24 : 20;

  const [printQrTerminal, setPrintQrTerminal] = useState<Terminal | null>(null);
  const [captureTerminal, setCaptureTerminal] = useState<Terminal | null>(null);

  const filteredTerminals = useMemo(() => {
    return terminals.filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !t.code.toLowerCase().includes(q) &&
          !t.siteName.toLowerCase().includes(q) &&
          !t.city.toLowerCase().includes(q)
        ) {
          return false;
        }
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

  const totalPages = Math.max(1, Math.ceil(filteredTerminals.length / itemsPerPage));
  const paginatedTerminals = filteredTerminals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const uniqueStates = useMemo(() => [...new Set(terminals.map(t => t.state))].sort(), [terminals]);
  const uniqueCities = useMemo(() => [...new Set(terminals.map(t => t.city))].sort(), [terminals]);

  const slowNetCount = useMemo(
    () => terminals.filter(t => t.connectivityStatus === 'ONLINE' && t.heartbeatSecondsAgo > 15).length,
    [terminals]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">Terminal Telemetry & Fleet Status</h1>
            <Badge variant="outline" size="sm" className="font-mono bg-primary-50 text-primary-900 border-primary-200 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary-500 animate-pulse" />
              <span>MQTT LIVE FEED</span>
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Real-time ping, telemetry, WebSocket state, and remote diagnostics for all deployed kiosks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={refreshFeed}
          >
            <RefreshCw className="size-3.5" />
            <span>Poll Telemetry</span>
          </Button>
        </div>
      </div>

      {/* ── 5 Metric KPI Cards (Clean Monochromatic Palette) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Nodes</span>
              <MonitorCheck className="size-4 text-zinc-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mt-1">{totalTerminals}</div>
            <span className="text-xs text-zinc-500">{onlineDevices} configured active</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Online Nodes</span>
              <Wifi className="size-4 text-zinc-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mt-1">{onlineDevices}</div>
            <span className="text-xs text-zinc-500">{onlinePercentage}% network uptime</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Offline Nodes</span>
              <WifiOff className="size-4 text-zinc-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mt-1">{offlineDevices}</div>
            <span className="text-xs text-zinc-500">Requires attention</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Connection Types</span>
              <Signal className="size-4 text-zinc-400" />
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <div>
                <span className="text-xs text-zinc-500 block">LAN/WS</span>
                <span className="font-semibold text-zinc-900 font-mono text-xs">{connectionDistribution.lan}</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">4G SIM</span>
                <span className="font-semibold text-zinc-900 font-mono text-xs">{connectionDistribution.sim}</span>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">WiFi</span>
                <span className="font-semibold text-zinc-900 font-mono text-xs">{connectionDistribution.wifi}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sync State</span>
              <Activity className="size-4 text-zinc-400" />
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="size-2 rounded-full bg-primary-500" />
              <span className="text-xs font-bold text-zinc-900">LIVE SYNC</span>
            </div>
            <span className="text-xs text-zinc-500 font-mono truncate">Checked: {lastCheckedTime}</span>
          </CardContent>
        </Card>
      </div>

      {/* ── Regional Telemetry & State Coverage Section ── */}
      <RegionalTelemetryHub
        stateCoverage={stateCoverage}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
        totalTerminals={totalTerminals}
        onlineDevices={onlineDevices}
        offlineDevices={offlineDevices}
      />

      {/* ── Search, Filters & View Toggle ── */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-2.5 size-4 text-ink-subtle" />
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search terminals by code, site name, city, state..."
                className="pl-9"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-hairline shrink-0">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-7 px-2.5 text-xs font-semibold"
              >
                <LayoutGrid className="size-3.5" />
                <span>Grid</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-7 px-2.5 text-xs font-semibold"
              >
                <List className="size-3.5" />
                <span>List</span>
              </Button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline-soft">
            <Select
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
            >
              <option value="ALL">All States</option>
              {uniqueStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>

            <Select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
            >
              <option value="ALL">All Cities</option>
              {uniqueCities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>

            <Select
              value={siteTypeFilter}
              onChange={e => setSiteTypeFilter(e.target.value)}
            >
              <option value="ALL">All Site Types</option>
              <option value="Mall">Mall</option>
              <option value="Metro">Metro</option>
              <option value="Railway">Railway</option>
              <option value="Airport">Airport</option>
              <option value="Campus">Campus</option>
              <option value="Temple">Temple</option>
              <option value="Commercial">Commercial</option>
            </Select>

            <Select
              value={lockerTypeFilter}
              onChange={e => setLockerTypeFilter(e.target.value)}
            >
              <option value="ALL">All Locker Types</option>
              <option value="BAGGAGE">Baggage</option>
              <option value="MOBILE">Mobile</option>
              <option value="HYBRID">Hybrid</option>
            </Select>

            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </Select>

            <Select
              value={networkFilter}
              onChange={e => setNetworkFilter(e.target.value)}
            >
              <option value="ALL">All Network</option>
              <option value="LAN">LAN</option>
              <option value="SIM">SIM</option>
              <option value="WiFi">WiFi</option>
              <option value="WS">WS</option>
            </Select>

            <div className="ml-auto text-xs text-ink-muted self-center font-mono">
              {filteredTerminals.length} of {totalTerminals} nodes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Terminal Card Grid or List View ── */}
      {viewMode === 'grid' ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedTerminals.map(t => (
              <Card key={t.id} className="hover:border-zinc-300 transition-all flex flex-col justify-between">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-ink bg-zinc-100 px-1.5 py-0.5 rounded border border-hairline">
                      {t.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={t.connectivityStatus} pulse={t.connectivityStatus === 'ONLINE'} />
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-1 flex flex-col gap-2.5">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 truncate">{t.siteName}</h4>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">{t.city}, {t.state}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-zinc-50 rounded-lg border border-neutral-200/80">
                    <div>
                      <span className="text-zinc-500 text-xs block uppercase font-bold">Network</span>
                      <span className="font-bold font-mono text-neutral-900 text-xs">{t.networkType}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-xs block uppercase font-bold">Firmware</span>
                      <span className="font-bold font-mono text-neutral-900 text-xs">{t.firmwareVersion}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-xs block uppercase font-bold">Hardware</span>
                      <span className="font-bold text-neutral-900 text-xs">{t.deviceType}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-xs block uppercase font-bold">Heartbeat</span>
                      <span
                        className={`font-mono font-bold text-xs ${
                          t.heartbeatSecondsAgo < 15
                            ? 'text-emerald-700'
                            : t.heartbeatSecondsAgo < 60
                            ? 'text-amber-700'
                            : 'text-rose-600'
                        }`}
                      >
                        {t.heartbeatSecondsAgo < 60
                          ? `${t.heartbeatSecondsAgo}s ago`
                          : `${Math.floor(t.heartbeatSecondsAgo / 60)}m ago`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2.5 pt-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => setPrintQrTerminal(t)}
                      className="flex-1 h-9 text-xs font-semibold px-3 shadow-xs hover:bg-neutral-50 active:bg-neutral-100"
                    >
                      <Printer className="size-4 mr-1.5 text-neutral-700" />
                      <span>Print QR</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="default"
                      onClick={() => setCaptureTerminal(t)}
                      className="flex-1 h-9 text-xs font-semibold px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                    >
                      <Camera className="size-4 mr-1.5 text-neutral-700" />
                      <span>Capture</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Grid View Pagination */}
          <div className="p-3 bg-white rounded-xl border border-hairline flex items-center justify-between text-xs text-ink-muted">
            <span>
              Showing {filteredTerminals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(filteredTerminals.length, currentPage * itemsPerPage)} of{' '}
              {filteredTerminals.length} nodes
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-3.5" />
                <span>Previous</span>
              </Button>
              <div className="inline-flex h-8 items-center justify-center px-3 text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 rounded-md shadow-xs select-none">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Terminal List Table View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Site Name</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Firmware</TableHead>
                  <TableHead>Device Type</TableHead>
                  <TableHead>Heartbeat</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTerminals.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono font-bold text-ink whitespace-nowrap">
                      {t.code}
                    </TableCell>
                    <TableCell className="text-ink font-medium max-w-[200px] truncate">
                      {t.siteName}
                    </TableCell>
                    <TableCell className="text-ink-muted">{t.state}</TableCell>
                    <TableCell className="text-ink-muted">{t.city}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.connectivityStatus} pulse={t.connectivityStatus === 'ONLINE'} />
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-ink">{t.networkType}</TableCell>
                    <TableCell className="font-mono text-ink-muted">{t.firmwareVersion}</TableCell>
                    <TableCell className="text-ink-muted">{t.deviceType}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setPrintQrTerminal(t)}
                          title="Print QR"
                        >
                          <Printer className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setCaptureTerminal(t)}
                          title="Screen Capture"
                        >
                          <Camera className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-3 sm:px-6 border-t border-hairline-soft flex items-center justify-between bg-zinc-50/50">
            <span className="text-xs text-ink-muted">
              Showing {filteredTerminals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(filteredTerminals.length, currentPage * itemsPerPage)} of{' '}
              {filteredTerminals.length} nodes
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-3.5" />
                <span>Previous</span>
              </Button>
              <div className="inline-flex h-8 items-center justify-center px-3 text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 rounded-md shadow-xs select-none">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* ── Modals ── */}
      <PrintQrModal isOpen={!!printQrTerminal} onClose={() => setPrintQrTerminal(null)} terminal={printQrTerminal} />
      <ScreenCaptureModal isOpen={!!captureTerminal} onClose={() => setCaptureTerminal(null)} terminal={captureTerminal} />
    </div>
  );
};
