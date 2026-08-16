import React, { useState, useMemo } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { Booking } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { DateRangePicker } from '../components/common/DateRangePicker';
import { Modal } from '../components/common/Modal';
import { ForceUnlockModal } from '../components/control-center/ForceUnlockModal';
import {
  Search,
  Filter,
  RotateCw,
  FileSpreadsheet,
  MoreVertical,
  KeyRound,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { bookings, terminals, showToast, addAuditLog } = useRealtime();

  // Filters
  const [mobileFilter, setMobileFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [siteTypeFilter, setSiteTypeFilter] = useState('ALL');
  const [terminalFilter, setTerminalFilter] = useState('ALL');

  const [startDate, setStartDate] = useState('Aug 01, 2026');
  const [endDate, setEndDate] = useState('Aug 16, 2026');
  const [showAdvanced, setShowAdvanced] = useState(true);
  
  // Single source of truth for PII reveal state (Passcodes & DOB)
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportIncludeSensitive, setExportIncludeSensitive] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [forceUnlockBooking, setForceUnlockBooking] = useState<Booking | null>(null);

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
    return count;
  }, [mobileFilter, sourceFilter, typeFilter, statusFilter, stateFilter, cityFilter, siteTypeFilter, terminalFilter]);

  const resetFilters = () => {
    setMobileFilter('');
    setSourceFilter('ALL');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
    setStateFilter('ALL');
    setCityFilter('ALL');
    setSiteTypeFilter('ALL');
    setTerminalFilter('ALL');
    showToast('Filters cleared', 'info');
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

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Bookings</div>
          <div className="text-2xl font-black text-zinc-900 mt-1">{bookings.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">↑ +14% vs last week</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Active Lockers</div>
          <div className="text-2xl font-black text-primary mt-1">
            {bookings.filter(b => b.bookingStatus === 'ACTIVE').length}
          </div>
          <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Occupied in real time</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Retrieved / Done</div>
          <div className="text-2xl font-black text-zinc-900 mt-1">
            {bookings.filter(b => b.bookingStatus === 'COMPLETED').length}
          </div>
          <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Checked out safely</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Overdue Alerts</div>
          <div className="text-2xl font-black text-red-600 mt-1">
            {bookings.filter(b => b.bookingStatus === 'OVERDUE').length}
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-0.5">Excess time accrued</div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-zinc-900">Filters</h2>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-orange-100 text-primary rounded-full text-[10px] font-black">
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Refine your search and find bookings quickly</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />

            <button
              type="button"
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Reset Filters
            </button>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-2 text-xs font-bold text-primary bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              {showAdvanced ? 'Show Less' : 'Advanced'}
            </button>
          </div>
        </div>

        {/* Quick Date Range Preset Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'This Year'].map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                showToast(`Filter set to: ${preset}`, 'info');
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-orange-50 hover:text-primary hover:border-orange-200 transition-colors whitespace-nowrap"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Filter Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Search Customer / Mobile
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={mobileFilter}
                onChange={e => setMobileFilter(e.target.value)}
                placeholder="Mobile number or name..."
                className="w-full pl-9 pr-3 h-9 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 focus:bg-white focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Booking Source
            </label>
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
            >
              <option value="ALL">All Sources</option>
              <option value="Touchscreen">Touchscreen (Kiosk)</option>
              <option value="Web">Web Portal</option>
              <option value="Mobile App">Mobile App</option>
              <option value="WhatsApp">WhatsApp Bot</option>
              <option value="Offline Payment / QR">Offline Payment / QR</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Mobile / Baggage
            </label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="BAGGAGE">Baggage Locker</option>
              <option value="MOBILE">Mobile Phone Locker</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Booking Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>
          </div>
        </div>

        {/* Filter Row 2 (Expandable) */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-zinc-100">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                State
              </label>
              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
              >
                <option value="ALL">All States</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Telangana">Telangana</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Kerala">Kerala</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Goa">Goa</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                City
              </label>
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
              >
                <option value="ALL">All Cities</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Chennai">Chennai</option>
                <option value="Noida">Noida</option>
                <option value="Kochi">Kochi</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Site Type
              </label>
              <select
                value={siteTypeFilter}
                onChange={e => setSiteTypeFilter(e.target.value)}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
              >
                <option value="ALL">All Site Types</option>
                <option value="Mall">Mall</option>
                <option value="Metro">Metro Station</option>
                <option value="Railway">Railway Station</option>
                <option value="Airport">Airport</option>
                <option value="Campus">Campus</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Terminal
              </label>
              <select
                value={terminalFilter}
                onChange={e => setTerminalFilter(e.target.value)}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
              >
                <option value="ALL">All Terminals ({terminals.length})</option>
                {terminals.map(t => (
                  <option key={t.id} value={t.code}>
                    {t.code} — {t.siteName} ({t.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Bookings Data Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-4 sm:px-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">Booking History</h3>
            <p className="text-xs text-zinc-500">Manage and track all locker reservations</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSensitiveData}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                showSensitiveData
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              {showSensitiveData ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showSensitiveData ? 'Mask Sensitive Fields' : 'Reveal Sensitive Fields'}</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Refreshing booking table from AWS DynamoDB...', 'info')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-md transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5 text-zinc-500" />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setExportIncludeSensitive(false);
                setShowExportModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-md shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-3">SL.</th>
                <th className="py-3 px-3">TERMINAL CODE</th>
                <th className="py-3 px-3">INVOICE NUMBER</th>
                <th className="py-3 px-3">CUSTOMER NAME</th>
                <th className="py-3 px-3">MOBILE NUMBER</th>
                <th className="py-3 px-3">OPEN DATE & TIME</th>
                <th className="py-3 px-3">BOOKING STATUS</th>
                <th className="py-3 px-3">PAYMENT METHOD</th>
                <th className="py-3 px-3">DATE OF BIRTH</th>
                <th className="py-3 px-3">LOCK NAME</th>
                <th className="py-3 px-3">PASSCODE</th>
                <th className="py-3 px-3">DURATION</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-12 text-zinc-400">
                    No bookings found matching the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map(b => (
                  <tr key={b.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-400">{b.serialNumber}</td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900 whitespace-nowrap">
                      {b.terminalCode}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-600 whitespace-nowrap">{b.invoiceNumber}</td>
                    <td className="py-3 px-3 font-semibold text-zinc-900 whitespace-nowrap">{b.customerName}</td>
                    <td className="py-3 px-3 font-mono text-zinc-600 whitespace-nowrap">{b.mobileNumber}</td>
                    <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">{b.openDateTime}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={b.bookingStatus} pulse={b.bookingStatus === 'ACTIVE'} />
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={b.paymentMethod} />
                    </td>
                    <td className="py-3 px-3 text-zinc-500 font-mono whitespace-nowrap">
                      {b.dateOfBirth ? (showSensitiveData ? b.dateOfBirth : '••••-••-••') : '—'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-800 whitespace-nowrap">{b.lockName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary whitespace-nowrap">
                      {showSensitiveData ? b.passcode : '••••'}
                    </td>
                    <td className="py-3 px-3 text-zinc-700 whitespace-nowrap font-medium">{b.duration}</td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBooking(b);
                          setShowDetailsModal(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-zinc-700 bg-zinc-100 hover:bg-primary hover:text-white rounded-md transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <div>
            Showing <strong>{Math.min(filteredBookings.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong>{Math.min(filteredBookings.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong>{filteredBookings.length}</strong> reservations
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono font-bold text-zinc-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={`Booking Details — ${selectedBooking.invoiceNumber}`}
          subtitle={`Locker ${selectedBooking.lockName} at ${selectedBooking.terminalCode}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Customer Name</span>
                <span className="font-bold text-zinc-900 text-sm">{selectedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Mobile Number</span>
                <span className="font-mono font-bold text-zinc-900">{selectedBooking.mobileNumber}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Terminal & Lock</span>
                <span className="font-mono font-bold text-zinc-900">{selectedBooking.terminalCode} / {selectedBooking.lockName}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Date of Birth (PII)</span>
                <span className="font-mono font-bold text-zinc-900">
                  {selectedBooking.dateOfBirth ? (showSensitiveData ? selectedBooking.dateOfBirth : '••••-••-••') : '—'}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold">4-Digit Passcode</span>
                  <button
                    type="button"
                    onClick={handleToggleSensitiveData}
                    className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    {showSensitiveData ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showSensitiveData ? 'Mask' : 'Reveal'}
                  </button>
                </div>
                <span className="font-mono font-black text-primary text-base">
                  {showSensitiveData ? selectedBooking.passcode : '••••'}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Status</span>
                <StatusBadge status={selectedBooking.bookingStatus} />
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Payment</span>
                <span className="font-bold text-zinc-900">₹{selectedBooking.amount} ({selectedBooking.paymentMethod})</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setForceUnlockBooking(selectedBooking);
                  setShowDetailsModal(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-orange-100 hover:bg-orange-200 text-primary text-xs font-bold rounded-lg transition-colors"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Force Open Locker</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Invoice PDF sent to ${selectedBooking.customerName}`, 'success');
                  setShowDetailsModal(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Download Invoice PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Dedicated Export Options Modal (Deliberate PII reveal control) */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Bookings Dataset"
        subtitle={`Export ${filteredBookings.length} filtered reservation records to CSV/Excel`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
            <div className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              Export Configuration
            </div>
            <div className="text-xs text-zinc-600">
              Generating an itemized record of current filtered bookings ({filteredBookings.length} rows).
            </div>
          </div>

          {/* Sensitive PII Opt-In Checkbox */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={exportIncludeSensitive}
                onChange={e => setExportIncludeSensitive(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300 text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <div className="text-xs font-bold text-zinc-900">
                  Include unmasked sensitive fields (DOB & Passcodes)
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                  By default, sensitive locker passcodes and customer dates of birth are masked (<code className="font-mono text-zinc-700">••••</code>). Checking this exports plaintext values.
                </div>
              </div>
            </label>

            {exportIncludeSensitive && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Security Audit Notice:</strong> Unmasking sensitive PII in exported files is logged to the system audit trail with your operator username, IP address, and timestamp.
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteExport}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Force Unlock Modal trigger from row */}
      {forceUnlockBooking && (
        <ForceUnlockModal
          isOpen={!!forceUnlockBooking}
          onClose={() => setForceUnlockBooking(null)}
          defaultTerminalCode={forceUnlockBooking.terminalCode}
          defaultLockerName={forceUnlockBooking.lockName}
        />
      )}
    </div>
  );
};
