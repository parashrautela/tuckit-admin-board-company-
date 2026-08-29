import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRealtime } from '@/context/RealtimeContext';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { Modal } from '@/components/common/Modal';
import { ForceUnlockModal } from '@/components/control-center/ForceUnlockModal';
import { CompactBookingFilters, SavedView } from '@/components/control-center/CompactBookingFilters';
import { BookingDetailModal } from '@/components/modals/BookingDetailModal';
import { PaymentHoverBadge } from '@/components/control-center/PaymentHoverBadge';
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
import { Separator } from '@/components/ui/separator';
import {
  Search,
  RotateCw,
  FileSpreadsheet,
  KeyRound,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Bookmark,
  BookmarkPlus,
  X,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const BUILT_IN_VIEWS: SavedView[] = [
  { id: 'view-all', name: 'Default (All Bookings)', isBuiltIn: true, params: {} },
  { id: 'view-active', name: 'Active Occupied Lockers', isBuiltIn: true, params: { status: 'ACTIVE' } },
  { id: 'view-overdue', name: 'Overdue Penalty Alerts', isBuiltIn: true, params: { status: 'OVERDUE' } },
  { id: 'view-touchscreen', name: 'Touchscreen Kiosks Only', isBuiltIn: true, params: { source: 'Touchscreen' } },
  { id: 'view-blr', name: 'Bengaluru Hubs', isBuiltIn: true, params: { city: 'Bengaluru' } },
];

const SAVED_VIEWS_STORAGE_KEY = 'tuckit_saved_views_dashboard';

const computePresetDates = (preset: string): { start: string; end: string } => {
  const today = new Date();
  const format = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  switch (preset) {
    case 'Today': {
      const s = format(today);
      return { start: s, end: s };
    }
    case 'Yesterday': {
      const y = new Date(today);
      y.setDate(today.getDate() - 1);
      const s = format(y);
      return { start: s, end: s };
    }
    case 'Last 7 Days': {
      const past = new Date(today);
      past.setDate(today.getDate() - 6);
      return { start: format(past), end: format(today) };
    }
    case 'Last 30 Days': {
      const past = new Date(today);
      past.setDate(today.getDate() - 29);
      return { start: format(past), end: format(today) };
    }
    case 'This Month': {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: format(first), end: format(today) };
    }
    case 'This Year': {
      const first = new Date(today.getFullYear(), 0, 1);
      return { start: format(first), end: format(today) };
    }
    default:
      return { start: 'Aug 01, 2026', end: 'Aug 16, 2026' };
  }
};

export const Dashboard: React.FC = () => {
  const { bookings, terminals, showToast, addAuditLog } = useRealtime();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-backed filter states
  const mobileFilter = searchParams.get('mobile') || '';
  const sourceFilter = searchParams.get('source') || 'ALL';
  const typeFilter = searchParams.get('type') || 'ALL';
  const statusFilter = searchParams.get('status') || 'ALL';
  const stateFilter = searchParams.get('state') || 'ALL';
  const cityFilter = searchParams.get('city') || 'ALL';
  const siteTypeFilter = searchParams.get('siteType') || 'ALL';
  const terminalFilter = searchParams.get('terminal') || 'ALL';
  const startDate = searchParams.get('startDate') || 'Aug 01, 2026';
  const endDate = searchParams.get('endDate') || 'Aug 16, 2026';
  const activePreset = searchParams.get('preset') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [showAdvanced, setShowAdvanced] = useState(true);

  // Single source of truth for PII reveal state (Passcodes & DOB)
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportIncludeSensitive, setExportIncludeSensitive] = useState(false);

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [forceUnlockBooking, setForceUnlockBooking] = useState<Booking | null>(null);

  // Saved Views State
  const [customViews, setCustomViews] = useState<SavedView[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_VIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showSaveViewModal, setShowSaveViewModal] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const allSavedViews = useMemo(() => [...BUILT_IN_VIEWS, ...customViews], [customViews]);
  const itemsPerPage = 8;

  // Helper to update a single search param
  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'ALL' || (key === 'page' && value === '1')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== 'page') {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const setDateRange = (s: string, e: string, presetName?: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('startDate', s);
    next.set('endDate', e);
    if (presetName) {
      next.set('preset', presetName);
    } else {
      next.delete('preset');
    }
    next.delete('page');
    setSearchParams(next);
  };

  const handleSelectPreset = (preset: string) => {
    const { start, end } = computePresetDates(preset);
    setDateRange(start, end, preset);
    showToast(`Filter set to: ${preset}`, 'info');
  };

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (mobileFilter) count++;
    if (sourceFilter !== 'ALL') count++;
    if (typeFilter !== 'ALL') count++;
    if (statusFilter !== 'ALL') count++;
    if (stateFilter !== 'ALL') count++;
    if (cityFilter !== 'ALL') count++;
    if (siteTypeFilter !== 'ALL') count++;
    if (terminalFilter !== 'ALL') count++;
    if (activePreset) count++;
    return count;
  }, [mobileFilter, sourceFilter, typeFilter, statusFilter, stateFilter, cityFilter, siteTypeFilter, terminalFilter, activePreset]);

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
    showToast('Filters cleared', 'info');
  };

  // Save / Apply Views
  const handleSaveView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;

    const paramsSnapshot: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      paramsSnapshot[key] = val;
    });

    const newView: SavedView = {
      id: `view-custom-${Date.now()}`,
      name: newViewName.trim(),
      params: paramsSnapshot,
    };

    const updated = [...customViews, newView];
    setCustomViews(updated);
    try {
      localStorage.setItem(SAVED_VIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setNewViewName('');
    setShowSaveViewModal(false);
    showToast(`Saved view "${newView.name}"`, 'success');
  };

  const handleDeleteSavedView = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customViews.filter(v => v.id !== id);
    setCustomViews(updated);
    try {
      localStorage.setItem(SAVED_VIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    showToast('Saved view removed', 'info');
  };

  const applyView = (view: SavedView) => {
    const next = new URLSearchParams();
    Object.entries(view.params).forEach(([k, v]) => {
      if (v && v !== 'ALL') next.set(k, v);
    });
    setSearchParams(next);
    showToast(`Applied view: "${view.name}"`, 'success');
  };

  const handleToggleSensitiveData = () => {
    const next = !showSensitiveData;
    setShowSensitiveData(next);
    if (next) {
      addAuditLog('PII_REVEAL', 'BOOKING_DATA', 'FLEET_VIEW', 'Operator unmasked sensitive PII (Passcodes & DOB) in table/session', 'WARNING');
      showToast('Sensitive fields (Passcodes & DOB) unmasked — Access logged to audit trail', 'warning');
    } else {
      showToast('Sensitive fields masked', 'info');
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (mobileFilter && !b.mobileNumber.includes(mobileFilter) && !b.customerName.toLowerCase().includes(mobileFilter.toLowerCase())) {
        return false;
      }
      if (sourceFilter !== 'ALL' && b.bookingSource !== sourceFilter) return false;
      if (typeFilter !== 'ALL' && b.bookingType !== typeFilter) return false;
      if (statusFilter !== 'ALL' && b.bookingStatus !== statusFilter) return false;
      if (stateFilter !== 'ALL' && b.state !== stateFilter) return false;
      if (cityFilter !== 'ALL' && b.city !== cityFilter) return false;
      if (siteTypeFilter !== 'ALL' && b.siteType !== siteTypeFilter) return false;
      if (terminalFilter !== 'ALL' && b.terminalCode !== terminalFilter) return false;
      return true;
    });
  }, [bookings, mobileFilter, sourceFilter, typeFilter, statusFilter, stateFilter, cityFilter, siteTypeFilter, terminalFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExecuteExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'SL,TERMINAL CODE,INVOICE NUMBER,CUSTOMER NAME,MOBILE,OPEN DATE TIME,STATUS,PAYMENT,DOB,LOCK,PASSCODE,DURATION,AMOUNT',
        ...filteredBookings.map(b => {
          const dobVal = b.dateOfBirth ? (exportIncludeSensitive ? b.dateOfBirth : '••••-••-••') : '';
          const passVal = exportIncludeSensitive ? b.passcode : '••••';
          return `${b.serialNumber},"${b.terminalCode}","${b.invoiceNumber}","${b.customerName}","${b.mobileNumber}","${b.openDateTime}","${b.bookingStatus}","${b.paymentMethod}","${dobVal}","${b.lockName}","${passVal}","${b.duration}",${b.amount}`;
        }),
      ].join('\n');

    if (exportIncludeSensitive) {
      addAuditLog('PII_EXPORT_UNMASKED', 'EXPORT_CSV', `${filteredBookings.length} records`, 'Exported bookings dataset with unmasked DOB and Passcodes', 'WARNING');
      showToast(`Exported ${filteredBookings.length} records with unmasked PII — Event logged`, 'warning');
    } else {
      addAuditLog('BOOKINGS_EXPORT', 'EXPORT_CSV', `${filteredBookings.length} records`, 'Exported bookings dataset with masked PII');
      showToast(`Exported ${filteredBookings.length} records (PII masked)`, 'success');
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tuckit_bookings_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  const activeCount = bookings.filter(b => b.bookingStatus === 'ACTIVE').length;
  const completedCount = bookings.filter(b => b.bookingStatus === 'COMPLETED').length;
  const overdueCount = bookings.filter(b => b.bookingStatus === 'OVERDUE').length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">Live Fleet Bookings Stream</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Real-time audit log of active reservations, locker assignments, and penalty alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sensitive PII Toggle */}
          <Button
            variant={showSensitiveData ? 'accent' : 'outline'}
            size="default"
            onClick={handleToggleSensitiveData}
            title="Toggle unmasking of Passcodes & DOB"
            className="h-9 px-3.5 text-xs font-semibold shadow-2xs"
          >
            {showSensitiveData ? (
              <>
                <EyeOff className="size-4 text-primary-700" />
                <span>Mask Passcodes</span>
              </>
            ) : (
              <>
                <Eye className="size-4 text-neutral-500" />
                <span>Reveal Passcodes</span>
              </>
            )}
          </Button>

          {/* Export Dialog */}
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowExportModal(true)}
            className="h-9 px-3.5 text-xs font-semibold bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50 shadow-2xs"
          >
            <FileSpreadsheet className="size-4 text-emerald-600" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* ── 4 KPI Metric Cards (Clean, Consistent Monochromatic Palette) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-neutral-200 shadow-2xs">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Bookings</span>
              <Layers className="size-4 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-0.5">{bookings.length}</div>
            <span className="text-xs text-neutral-500">All logged reservations</span>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200 shadow-2xs">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Active Lockers</span>
              <Activity className="size-4 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-0.5">{activeCount}</div>
            <span className="text-xs text-neutral-500">Occupied in real-time</span>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200 shadow-2xs">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Checked Out</span>
              <CheckCircle2 className="size-4 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-0.5">{completedCount}</div>
            <span className="text-xs text-neutral-500">Retrieved safely</span>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200 shadow-2xs">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Overdue Alerts</span>
              <AlertCircle className="size-4 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-0.5">{overdueCount}</div>
            <span className="text-xs text-neutral-500">Excess duration accrued</span>
          </CardContent>
        </Card>
      </div>

      {/* ── Compact Filter & Search Panel with Active Filter Chips ── */}
      <CompactBookingFilters
        mobileFilter={mobileFilter}
        sourceFilter={sourceFilter}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        stateFilter={stateFilter}
        cityFilter={cityFilter}
        siteTypeFilter={siteTypeFilter}
        terminalFilter={terminalFilter}
        startDate={startDate}
        endDate={endDate}
        activePreset={activePreset}
        updateFilter={updateFilter}
        setDateRange={setDateRange}
        handleSelectPreset={handleSelectPreset}
        resetFilters={resetFilters}
        terminals={terminals}
        allSavedViews={allSavedViews}
        searchParams={searchParams}
        applyView={applyView}
        handleDeleteSavedView={handleDeleteSavedView}
        onOpenSaveView={() => setShowSaveViewModal(true)}
        filteredCount={filteredBookings.length}
        totalCount={bookings.length}
        activeFiltersCount={activeFiltersCount}
      />

      {/* ── Main Bookings Stream Table ── */}
      <Card className="overflow-hidden border border-neutral-200 shadow-2xs">
        <CardHeader className="p-4 sm:px-6 border-b border-neutral-200 bg-neutral-50/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-neutral-900">
              Live Reservations Stream ({filteredBookings.length} total)
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500 mt-0.5">
              Auto-syncing realtime MQTT telemetry feed
            </CardDescription>
          </div>

          <Badge variant="outline" className="font-mono text-xs font-medium text-neutral-600 bg-white">
            Page {currentPage} of {totalPages}
          </Badge>
        </CardHeader>

        <Table className="min-w-[1120px] w-full" containerClassName="overflow-x-auto custom-scrollbar">
          <TableHeader>
            <TableRow className="bg-neutral-100/90 hover:bg-neutral-100/90 text-xs border-b border-neutral-200">
              <TableHead className="w-8 text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-1.5 text-center whitespace-nowrap">#</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-2 whitespace-nowrap">Terminal</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-2 whitespace-nowrap">Invoice</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-2 whitespace-nowrap">Customer</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-2 whitespace-nowrap">Check-In</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-1.5 whitespace-nowrap">Status</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-1.5 whitespace-nowrap">Payment</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-1.5 whitespace-nowrap">DOB</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-1.5 whitespace-nowrap">Door</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-1.5 whitespace-nowrap">Passcode</TableHead>
              <TableHead className="text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-1.5 whitespace-nowrap">Duration</TableHead>
              <TableHead className="text-right text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-2 whitespace-nowrap">Amount</TableHead>
              <TableHead className="text-center text-xs font-bold text-neutral-800 uppercase tracking-wider py-2.5 px-1.5 whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.length > 0 ? (
              paginatedBookings.map((b, idx) => (
                <TableRow
                  key={b.id}
                  onClick={() => {
                    setSelectedBooking(b);
                    setShowDetailsModal(true);
                  }}
                  className="hover:bg-neutral-50/90 transition-colors cursor-pointer group"
                >
                  <TableCell className="font-mono text-xs text-neutral-700 font-semibold py-2.5 px-1.5 text-center">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-neutral-900 whitespace-nowrap py-2.5 px-2">
                    <span className="bg-neutral-100 group-hover:bg-white px-1.5 py-0.5 rounded font-mono text-xs font-bold text-neutral-900 border border-neutral-300 transition-colors">
                      {b.terminalCode}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-neutral-900 whitespace-nowrap py-2.5 px-2">
                    {b.invoiceNumber}
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-2.5 px-2">
                    <div className="font-bold text-sm text-neutral-900 leading-tight group-hover:text-primary-900 transition-colors">{b.customerName}</div>
                    <div className="text-xs text-neutral-600 font-semibold font-mono mt-0.5">{b.mobileNumber}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-neutral-800 font-medium whitespace-nowrap py-2.5 px-2">
                    {b.openDateTime}
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-2.5 px-1.5">
                    <StatusBadge status={b.bookingStatus} pulse={b.bookingStatus === 'ACTIVE'} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-2.5 px-1.5">
                    <PaymentHoverBadge booking={b} />
                  </TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap py-2.5 px-1.5">
                    {b.dateOfBirth ? (
                      showSensitiveData ? (
                        <span className="text-neutral-900 font-bold">{b.dateOfBirth}</span>
                      ) : (
                        <span className="text-neutral-600 font-semibold">••••-••-••</span>
                      )
                    ) : (
                      <span className="text-neutral-500 font-medium">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-neutral-900 whitespace-nowrap py-2.5 px-1.5">
                    {b.lockName}
                  </TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap py-2.5 px-1.5">
                    {showSensitiveData ? (
                      <span className="font-bold text-neutral-900 bg-amber-50 text-amber-950 border border-amber-300 px-1.5 py-0.5 rounded text-xs">
                        {b.passcode}
                      </span>
                    ) : (
                      <span className="text-neutral-600 font-semibold">••••</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-800 font-semibold whitespace-nowrap py-2.5 px-1.5">{b.duration}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-sm text-neutral-900 whitespace-nowrap py-2.5 px-2">
                    ₹{b.amount}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap py-2.5 px-1.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                          setShowDetailsModal(true);
                        }}
                        className="size-7 rounded-lg flex items-center justify-center text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200 transition-colors"
                        title="View Details"
                      >
                        <FileText className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setForceUnlockBooking(b);
                        }}
                        className="size-7 rounded-lg flex items-center justify-center text-rose-700 hover:text-rose-900 hover:bg-rose-100 transition-colors"
                        title="Emergency Force Unlock"
                      >
                        <KeyRound className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} className="py-12 text-center text-neutral-500">
                  <AlertTriangle className="size-8 mx-auto text-neutral-400 mb-2" />
                  <p className="font-semibold text-sm text-neutral-900">No bookings match the active filter criteria</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Try resetting or adjusting the filter conditions above.</p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={resetFilters}
                    className="mt-3 font-semibold text-xs"
                  >
                    Clear All Filters
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* ── Table Pagination Bar ── */}
        <div className="p-3.5 sm:px-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/50">
          <span className="text-xs text-neutral-600 font-medium text-center sm:text-left">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of{' '}
            {filteredBookings.length} entries
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="default"
              onClick={() => updateFilter('page', String(Math.max(1, currentPage - 1)))}
              disabled={currentPage === 1}
              className="h-9 px-3 text-xs font-semibold"
            >
              <ChevronLeft className="size-4 mr-0.5" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={() => updateFilter('page', String(Math.min(totalPages, currentPage + 1)))}
              disabled={currentPage === totalPages}
              className="h-9 px-3 text-xs font-semibold"
            >
              <span>Next</span>
              <ChevronRight className="size-4 ml-0.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Upgraded Booking Details Modal (100% Field Parity) ── */}
      <BookingDetailModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onForceUnlock={(b) => {
          setShowDetailsModal(false);
          setForceUnlockBooking(b);
        }}
        showToast={showToast}
      />

      {/* ── Save View Modal ── */}
      {showSaveViewModal && (
        <Modal
          isOpen={showSaveViewModal}
          onClose={() => setShowSaveViewModal(false)}
          title="Save Current Filter View"
          subtitle="Save this filter and search configuration for quick access later"
        >
          <form onSubmit={handleSaveView} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink uppercase tracking-wider">
                View Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={newViewName}
                onChange={e => setNewViewName(e.target.value)}
                placeholder="e.g. Bangalore Active Malls"
                required
                autoFocus
              />
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg border border-hairline text-xs flex flex-col gap-1 text-ink-muted">
              <span className="font-bold text-ink">Included Parameters:</span>
              <p className="font-mono text-xs text-neutral-500 truncate">
                {searchParams.toString() || 'All default filters'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-hairline-soft">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowSaveViewModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Save View
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Force Unlock Modal ── */}
      {forceUnlockBooking && (
        <ForceUnlockModal
          isOpen={!!forceUnlockBooking}
          onClose={() => setForceUnlockBooking(null)}
          initialCode={forceUnlockBooking.terminalCode}
          initialLock={forceUnlockBooking.lockName}
        />
      )}

      {/* ── Export Options Modal ── */}
      {showExportModal && (
        <Modal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Export Bookings Dataset"
          subtitle={`Generate formatted CSV of ${filteredBookings.length} filtered reservations`}
        >
          <div className="flex flex-col gap-4">
            <div className="p-3.5 bg-zinc-50 border border-hairline rounded-xl flex flex-col gap-2">
              <span className="text-xs font-bold text-ink block">Export Data Scope:</span>
              <div className="grid grid-cols-2 gap-2 text-xs text-ink-muted">
                <div>• Total Rows: <strong className="text-ink">{filteredBookings.length}</strong></div>
                <div>• Format: <strong className="text-ink">CSV / Excel Compatible</strong></div>
                <div>• Active Source: <strong className="text-ink">{sourceFilter}</strong></div>
                <div>• Active Status: <strong className="text-ink">{statusFilter}</strong></div>
              </div>
            </div>

            {/* PII Unmasking Checkbox with Audit Warning */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col gap-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={exportIncludeSensitive}
                  onChange={e => setExportIncludeSensitive(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-300 text-primary focus:ring-primary size-4"
                />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    Include Unmasked Sensitive PII (Date of Birth & Passcodes)
                  </span>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    By default, customer DOB and door passcodes are exported as masked bullets (••••). Unmasking sensitive credentials will be logged in the system audit trail.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-hairline-soft">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleExecuteExport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <FileSpreadsheet className="size-3.5" />
                <span>Download CSV ({filteredBookings.length} Rows)</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
