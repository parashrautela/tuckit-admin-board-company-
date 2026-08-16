import React, { useState, useMemo } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { Modal } from '../components/common/Modal';
import {
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  RefreshCw,
  TrendingUp,
  CreditCard,
  IndianRupee,
  Layers,
  ArrowDownToLine,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Building,
  MapPin,
  Monitor,
  ShieldCheck,
  Check,
  Smartphone,
  Globe,
  MessageSquare,
  QrCode,
} from 'lucide-react';

interface ExportModalConfig {
  isOpen: boolean;
  type: 'daily' | 'monthly' | 'cancellation';
  title: string;
}

const ALL_EXPORT_COLUMNS = [
  { id: 'bookingId', label: 'Booking ID / Serial', defaultChecked: true },
  { id: 'invoiceNumber', label: 'Invoice Number', defaultChecked: true },
  { id: 'customerName', label: 'Customer Name', defaultChecked: true },
  { id: 'customerPhone', label: 'Customer Mobile', defaultChecked: true },
  { id: 'dateOfBirth', label: 'Date of Birth (PII)', defaultChecked: false },
  { id: 'terminalCode', label: 'Terminal Code', defaultChecked: true },
  { id: 'siteName', label: 'Site / Location Name', defaultChecked: true },
  { id: 'city', label: 'City', defaultChecked: true },
  { id: 'state', label: 'State Jurisdiction', defaultChecked: true },
  { id: 'lockerDoorNumber', label: 'Locker Door #', defaultChecked: true },
  { id: 'lockerSize', label: 'Locker Size / Type', defaultChecked: true },
  { id: 'bookingSource', label: 'Booking Source (Kiosk/Web/App)', defaultChecked: true },
  { id: 'checkinTime', label: 'Check-in Timestamp', defaultChecked: true },
  { id: 'duration', label: 'Total Duration (Hours)', defaultChecked: true },
  { id: 'amount', label: 'Base Amount (₹)', defaultChecked: true },
  { id: 'extraCharges', label: 'Overdue / Excess Charges (₹)', defaultChecked: true },
  { id: 'totalPaid', label: 'Net Total Paid (₹)', defaultChecked: true },
  { id: 'paymentMethod', label: 'Payment Mode (UPI/Cash/Card)', defaultChecked: true },
  { id: 'transactionRef', label: 'Gateway Transaction Ref', defaultChecked: true },
  { id: 'status', label: 'Final Booking Status', defaultChecked: true },
];

export const Reports: React.FC = () => {
  const { terminals, bookings, showToast } = useRealtime();

  // Header Filters
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('2024-08-01');
  const [endDate, setEndDate] = useState('2024-08-16');
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Export Card Dates
  const [dailyDate, setDailyDate] = useState('2024-08-16');
  const [monthlyMonth, setMonthlyMonth] = useState('08');
  const [monthlyYear, setMonthlyYear] = useState('2024');
  const [cancellationDate, setCancellationDate] = useState('2024-08-16');

  // Terminal-Wise Report Cascade
  const [twState, setTwState] = useState('');
  const [twCity, setTwCity] = useState('');
  const [twTerminalId, setTwTerminalId] = useState('');
  const [twMonth, setTwMonth] = useState('08');
  const [twYear, setTwYear] = useState('2024');
  const [isDownloadingTw, setIsDownloadingTw] = useState(false);

  // Column Customization Modal
  const [exportModal, setExportModal] = useState<ExportModalConfig>({ isOpen: false, type: 'daily', title: '' });
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ALL_EXPORT_COLUMNS.filter(c => c.defaultChecked).map(c => c.id)
  );
  const [exportStateScope, setExportStateScope] = useState('ALL');
  const [isDownloading, setIsDownloading] = useState(false);

  const uniqueStates = useMemo(() => [...new Set(terminals.map(t => t.state))].sort(), [terminals]);

  const twAvailableCities = useMemo(() => {
    if (!twState) return [];
    return [...new Set(terminals.filter(t => t.state === twState).map(t => t.city))].sort();
  }, [terminals, twState]);

  const twAvailableTerminals = useMemo(() => {
    return terminals.filter(t => {
      if (twState && t.state !== twState) return false;
      if (twCity && t.city !== twCity) return false;
      return true;
    });
  }, [terminals, twState, twCity]);

  // Executive KPI summary calculations
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (selectedState !== 'ALL' && b.state !== selectedState) return false;
      return true;
    });
  }, [bookings, selectedState]);

  const netRevenue = useMemo(() => {
    return filteredBookings.reduce((sum, b) => sum + (b.amount || 0) + (b.extraCharges || 0), 0);
  }, [filteredBookings]);

  const totalTransactions = filteredBookings.length;
  const totalRefundAmount = 4350;
  const refundCount = 18;
  const manualRevenue = useMemo(() => {
    return filteredBookings.filter(b => b.paymentMethod === 'CASH' || b.paymentMethod === 'Manual Rev.').reduce((s, b) => s + b.amount, 0);
  }, [filteredBookings]);

  // Source share data
  const sourceStats = useMemo(() => {
    const counts: Record<string, number> = {
      'Touchscreen': 0,
      'Web': 0,
      'Mobile App': 0,
      'WhatsApp': 0,
      'Offline Payment / QR': 0,
    };
    filteredBookings.forEach(b => {
      const src = b.bookingSource || 'Touchscreen';
      counts[src] = (counts[src] || 0) + 1;
    });
    const total = filteredBookings.length || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / total) * 100),
    }));
  }, [filteredBookings]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsRefreshing(false);
      showToast('Report analytics synced from live transaction streams', 'success');
    }, 600);
  };

  const openExportModal = (type: 'daily' | 'monthly' | 'cancellation', title: string) => {
    setExportModal({ isOpen: true, type, title });
  };

  const toggleColumn = (id: string) => {
    setSelectedColumns(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
  };

  const handleSelectAllColumns = (all: boolean) => {
    if (all) {
      setSelectedColumns(ALL_EXPORT_COLUMNS.map(c => c.id));
    } else {
      setSelectedColumns(['bookingId', 'customerName', 'totalPaid', 'status']);
    }
  };

  const handleExecuteExport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setExportModal({ isOpen: false, type: 'daily', title: '' });

      const fileName =
        exportModal.type === 'daily'
          ? `transactions_${exportStateScope}_${dailyDate}.xlsx`
          : exportModal.type === 'monthly'
          ? `transactions_${exportStateScope}_${monthlyYear}_${monthlyMonth}.xlsx`
          : `cancellations_${cancellationDate}.csv`;

      // Trigger synthetic download
      const element = document.createElement('a');
      const file = new Blob([
        `Tuckit Report: ${exportModal.title}\nDate Scope: ${dailyDate}\nState Scope: ${exportStateScope}\nColumns: ${selectedColumns.join(', ')}\nTotal Rows: ${filteredBookings.length}\n\nGenerated by Tuckit Admin Control Center`,
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      showToast(`${fileName} downloaded successfully`, 'success');
    }, 1200);
  };

  const handleTerminalReportDownload = () => {
    if (!twTerminalId) {
      showToast('Please select a terminal first', 'warning');
      return;
    }
    const tObj = terminals.find(t => t.id === twTerminalId || t.code === twTerminalId);
    const code = tObj ? tObj.code : 'terminal';
    setIsDownloadingTw(true);

    setTimeout(() => {
      setIsDownloadingTw(false);
      const fileName = `invoice_report_${code}_${twYear}_${twMonth}.xlsx`;
      const element = document.createElement('a');
      const file = new Blob([
        `Tuckit Terminal Monthly Report\nTerminal: ${code}\nYear-Month: ${twYear}-${twMonth}\nSite: ${tObj?.siteName}\nGenerated at: ${new Date().toISOString()}`,
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      showToast(`${fileName} downloaded successfully`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Global Report Scope Filter */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 rounded-xl text-white">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-black text-zinc-900 tracking-tight">Report Analysis</h1>
              <p className="text-xs text-zinc-500">
                Executive business intelligence and professional data exports.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Global State Scope */}
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 outline-none focus:bg-white focus:border-primary"
            >
              <option value="ALL">All States (National)</option>
              {uniqueStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Date Scope */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-1 text-xs">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-transparent px-2 py-1 outline-none text-xs font-medium font-mono text-zinc-700"
              />
              <span className="text-zinc-400 font-bold">to</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-transparent px-2 py-1 outline-none text-xs font-medium font-mono text-zinc-700"
              />
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync: {lastRefreshed}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Executive KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Net Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <IndianRupee className="h-3.5 w-3.5 text-primary" /> Net Revenue
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-2">₹{netRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +24.8% vs last month</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Post-refund realized revenue</div>
        </div>

        {/* Success Count */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <CreditCard className="h-3.5 w-3.5 text-emerald-500" /> Success Count
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{totalTransactions}</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-1">Paid transactions</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Total successful deposits</div>
        </div>

        {/* Total Refund */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <RotateCcw className="h-3.5 w-3.5 text-red-500" /> Total Refund
          </div>
          <div className="text-2xl font-black text-red-600 mt-2">₹{totalRefundAmount.toLocaleString()}</div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">1.8% of gross volume</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Disbursed transaction returns</div>
        </div>

        {/* Refund Count */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" /> Refund Count
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-2">{refundCount}</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-1">Resolved claims</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Total customer claims</div>
        </div>

        {/* Manual Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5 text-sky-500" /> Manual Rev.
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-2">₹{manualRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-1">Cash desk & OTC</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Physical cash intake</div>
        </div>
      </div>

      {/* Booking Source Share Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Share (Current Period) */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-zinc-900">Booking Source Distribution</h3>
            </div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase">Current Period</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {sourceStats.map(s => (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-700 flex items-center gap-2">
                    {s.name === 'Touchscreen' && <Monitor className="h-3.5 w-3.5 text-zinc-500" />}
                    {s.name === 'Web' && <Globe className="h-3.5 w-3.5 text-zinc-500" />}
                    {s.name === 'Mobile App' && <Smartphone className="h-3.5 w-3.5 text-zinc-500" />}
                    {s.name === 'WhatsApp' && <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />}
                    {s.name === 'Offline Payment / QR' && <QrCode className="h-3.5 w-3.5 text-zinc-500" />}
                    {s.name}
                  </span>
                  <span className="font-mono text-zinc-900">
                    {s.count} bookings ({s.pct}%)
                  </span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      s.name === 'Touchscreen'
                        ? 'bg-primary'
                        : s.name === 'Mobile App'
                        ? 'bg-emerald-500'
                        : s.name === 'Web'
                        ? 'bg-sky-500'
                        : s.name === 'WhatsApp'
                        ? 'bg-green-600'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Source Share Trend */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-zinc-900">Channel Growth & Adoption Trends</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-600">6-Month Trend</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
              <div className="text-xs text-zinc-400 font-bold uppercase">Touchscreen</div>
              <div className="text-lg font-black text-zinc-900 mt-1">68.4%</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Primary Kiosk UI</div>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
              <div className="text-xs text-zinc-400 font-bold uppercase">Mobile App</div>
              <div className="text-lg font-black text-emerald-600 mt-1">19.2%</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ +14% QoQ</div>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
              <div className="text-xs text-zinc-400 font-bold uppercase">WhatsApp Bot</div>
              <div className="text-lg font-black text-green-600 mt-1">12.4%</div>
              <div className="text-[10px] text-green-600 font-semibold mt-0.5">↑ +28% QoQ</div>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed bg-orange-50/50 p-3 rounded-xl border border-orange-100">
            <strong>Executive Insight:</strong> App and WhatsApp adoption rates grew by 32% across Tier-1 airports and metro stations in Q3, reducing kiosk touch latency by 45 seconds per check-in.
          </p>
        </div>
      </div>

      {/* Export Control Center Header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="p-2 bg-zinc-900 rounded-xl text-white">
          <ArrowDownToLine className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-zinc-900">Export Control Center</h2>
          <p className="text-xs text-zinc-500">
            Generate high-fidelity reports for auditing, compliance, and regional tracking.
          </p>
        </div>
      </div>

      {/* 4 Dedicated Export Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* Card 1: Daily Transaction Report */}
        <div className="bg-white rounded-2xl border border-zinc-200 border-l-4 border-l-blue-500 shadow-2xs p-5 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 mt-1">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900">Daily Transaction Report</h3>
              <p className="text-xs text-zinc-500 mt-0.5 max-w-xl">
                Full itemized record of all successful payments, extensions, and refunds for a single day.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="date"
                  value={dailyDate}
                  onChange={e => setDailyDate(e.target.value)}
                  className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono font-bold text-zinc-800 outline-none focus:border-primary"
                />
                <span className="text-[11px] text-zinc-400 font-medium">Selected Date</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openExportModal('daily', 'Daily Transaction Report')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 self-start md:self-center"
          >
            <Download className="h-4 w-4" /> Download Data
          </button>
        </div>

        {/* Card 2: Monthly Financial Summary */}
        <div className="bg-white rounded-2xl border border-zinc-200 border-l-4 border-l-indigo-500 shadow-2xs p-5 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 mt-1">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900">Monthly Financial Summary</h3>
              <p className="text-xs text-zinc-500 mt-0.5 max-w-xl">
                Consolidated transaction logs grouped by state. Essential for monthly accounts and tax auditing.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={monthlyMonth}
                  onChange={e => setMonthlyMonth(e.target.value)}
                  className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-800 outline-none focus:border-primary"
                >
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select
                  value={monthlyYear}
                  onChange={e => setMonthlyYear(e.target.value)}
                  className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-800 outline-none focus:border-primary"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openExportModal('monthly', 'Monthly Financial Summary')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 self-start md:self-center"
          >
            <Download className="h-4 w-4" /> Download Data
          </button>
        </div>

        {/* Card 3: Cancellation Audit Log */}
        <div className="bg-white rounded-2xl border border-zinc-200 border-l-4 border-l-orange-500 shadow-2xs p-5 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 text-primary rounded-2xl shrink-0 mt-1">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900">Cancellation Audit Log</h3>
              <p className="text-xs text-zinc-500 mt-0.5 max-w-xl">
                Security-focused summary of manually and automatically cancelled bookings for the selected date.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="date"
                  value={cancellationDate}
                  onChange={e => setCancellationDate(e.target.value)}
                  className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono font-bold text-zinc-800 outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openExportModal('cancellation', 'Cancellation Audit Log')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 self-start md:self-center"
          >
            <Download className="h-4 w-4" /> Download Data
          </button>
        </div>

        {/* Card 4: Terminal-Wise Monthly Invoice Report (Full Cascade) */}
        <div className="bg-white rounded-2xl border border-zinc-200 border-l-4 border-l-emerald-500 shadow-2xs p-5 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 mt-1">
              <Monitor className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900">Terminal-Wise Monthly Invoice Report</h3>
              <p className="text-xs text-zinc-500 mt-0.5 max-w-xl">
                Download a detailed financial summary for a specific terminal, with searchable State, City, and Terminal filtering.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-zinc-100">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                State
              </label>
              <select
                value={twState}
                onChange={e => {
                  setTwState(e.target.value);
                  setTwCity('');
                  setTwTerminalId('');
                }}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 outline-none focus:border-primary"
              >
                <option value="">Select State</option>
                {uniqueStates.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                City
              </label>
              <select
                value={twCity}
                disabled={!twState}
                onChange={e => {
                  setTwCity(e.target.value);
                  setTwTerminalId('');
                }}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 outline-none focus:border-primary disabled:opacity-50"
              >
                <option value="">Select City</option>
                {twAvailableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Terminal Code
              </label>
              <select
                value={twTerminalId}
                onChange={e => setTwTerminalId(e.target.value)}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-800 outline-none focus:border-primary"
              >
                <option value="">Select Terminal ({twAvailableTerminals.length} Available)</option>
                {twAvailableTerminals.map(t => (
                  <option key={t.id} value={t.code}>
                    {t.code} — {t.siteName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Month & Year
              </label>
              <div className="flex gap-1.5">
                <select
                  value={twMonth}
                  onChange={e => setTwMonth(e.target.value)}
                  className="flex-1 h-9 px-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 outline-none focus:border-primary"
                >
                  <option value="01">Jan</option>
                  <option value="02">Feb</option>
                  <option value="03">Mar</option>
                  <option value="04">Apr</option>
                  <option value="05">May</option>
                  <option value="06">Jun</option>
                  <option value="07">Jul</option>
                  <option value="08">Aug</option>
                  <option value="09">Sep</option>
                  <option value="10">Oct</option>
                  <option value="11">Nov</option>
                  <option value="12">Dec</option>
                </select>
                <select
                  value={twYear}
                  onChange={e => setTwYear(e.target.value)}
                  className="h-9 px-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 outline-none focus:border-primary"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleTerminalReportDownload}
                disabled={isDownloadingTw}
                className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isDownloadingTw ? 'Downloading...' : 'Download Report'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Column Customization Modal */}
      <Modal
        isOpen={exportModal.isOpen}
        onClose={() => setExportModal({ isOpen: false, type: 'daily', title: '' })}
        title={`Configure & Export: ${exportModal.title}`}
        subtitle="Customize your regional filters and data columns before download"
        maxWidth="lg"
      >
        <div className="space-y-5">
          {/* Regional Scope Info */}
          <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                State Jurisdiction Filter
              </label>
              <span className="text-[10px] font-mono text-zinc-500">
                {exportStateScope === 'ALL' ? 'Multi-Sheet Excel Workbook' : 'Single State CSV'}
              </span>
            </div>
            <select
              value={exportStateScope}
              onChange={e => setExportStateScope(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 outline-none focus:border-primary"
            >
              <option value="ALL">All States (Multi-Sheet Excel)</option>
              {uniqueStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-500">
              * Note: "All States" generates a single Excel workbook. Individual states download as CSV.
            </p>
          </div>

          {/* Column Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-800">
                Visible Export Columns ({selectedColumns.length} of {ALL_EXPORT_COLUMNS.length} selected)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectAllColumns(true)}
                  className="text-[11px] text-primary font-bold hover:underline"
                >
                  Select All
                </button>
                <span className="text-zinc-300">•</span>
                <button
                  type="button"
                  onClick={() => handleSelectAllColumns(false)}
                  className="text-[11px] text-zinc-500 font-medium hover:underline"
                >
                  Clear Non-Essential
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 border border-zinc-200 rounded-2xl bg-zinc-50/50 custom-scrollbar">
              {ALL_EXPORT_COLUMNS.map(col => {
                const checked = selectedColumns.includes(col.id);
                return (
                  <label
                    key={col.id}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                      checked
                        ? 'bg-white border-primary/40 text-zinc-900 font-bold shadow-2xs'
                        : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.id)}
                      className="rounded border-zinc-300 text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span className="truncate">{col.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setExportModal({ isOpen: false, type: 'daily', title: '' })}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteExport}
              disabled={isDownloading || selectedColumns.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Generating File...' : 'Generate & Download'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
