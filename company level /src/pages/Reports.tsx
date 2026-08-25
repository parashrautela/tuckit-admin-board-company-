import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRealtime } from '@/context/RealtimeContext';
import { Modal } from '@/components/common/Modal';
import { BookingsOverviewChart } from '@/components/reports/BookingsOverviewChart';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  RotateCcw,
  RefreshCw,
  TrendingUp,
  CreditCard,
  IndianRupee,
  Layers,
  ArrowDownToLine,
  Monitor,
  ShieldCheck,
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Header Filters (URL-synced)
  const selectedState = searchParams.get('state') || 'ALL';
  const startDate = searchParams.get('startDate') || '2024-08-01';
  const endDate = searchParams.get('endDate') || '2024-08-16';

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'ALL') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const setSelectedState = (val: string) => updateParam('state', val);
  const setStartDate = (val: string) => updateParam('startDate', val);
  const setEndDate = (val: string) => updateParam('endDate', val);

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
    const channelMeta: Record<string, { color: string; fill: string; bg: string; text: string; icon: any }> = {
      'Touchscreen': { color: '#E58A3C', fill: '#E58A3C', bg: 'bg-[#E58A3C]', text: 'text-[#C2651E]', icon: Monitor },
      'Mobile App': { color: '#5B84B1', fill: '#5B84B1', bg: 'bg-[#5B84B1]', text: 'text-[#3E6591]', icon: Smartphone },
      'Web': { color: '#4E9F8E', fill: '#4E9F8E', bg: 'bg-[#4E9F8E]', text: 'text-[#357B6C]', icon: Globe },
      'WhatsApp': { color: '#8E7C93', fill: '#8E7C93', bg: 'bg-[#8E7C93]', text: 'text-[#6D5D72]', icon: MessageSquare },
      'Offline Payment / QR': { color: '#C49B58', fill: '#C49B58', bg: 'bg-[#C49B58]', text: 'text-[#96743A]', icon: QrCode },
    };

    const counts: Record<string, number> = {
      'Touchscreen': 0,
      'Mobile App': 0,
      'Web': 0,
      'WhatsApp': 0,
      'Offline Payment / QR': 0,
    };

    filteredBookings.forEach(b => {
      const src = b.bookingSource || 'Touchscreen';
      if (counts[src] !== undefined) {
        counts[src] += 1;
      } else {
        counts['Touchscreen'] += 1;
      }
    });

    const total = filteredBookings.length || 1;
    return Object.entries(counts).map(([name, count]) => {
      const meta = channelMeta[name] || channelMeta['Touchscreen'];
      return {
        name,
        count,
        pct: Math.round((count / total) * 100),
        color: meta.color,
        fill: meta.fill,
        bg: meta.bg,
        text: meta.text,
        icon: meta.icon,
      };
    });
  }, [filteredBookings]);

  // Donut chart calculations
  const donutData = useMemo(() => {
    const total = sourceStats.reduce((sum, s) => sum + s.count, 0) || 1;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;

    return {
      total,
      circumference,
      slices: sourceStats.map(s => {
        const percent = s.count / total;
        const strokeDasharray = `${percent * circumference} ${circumference}`;
        const strokeDashoffset = -(accumulatedPercent * circumference);
        accumulatedPercent += percent;
        return {
          ...s,
          strokeDasharray,
          strokeDashoffset,
        };
      }),
    };
  }, [sourceStats]);

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
    <div className="flex flex-col gap-6 font-sans">
      {/* ── Header & Global Report Scope Filter ── */}
      <Card>
        <CardContent className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Reports & Financial Analytics</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Executive business intelligence, revenue realizations, and audit-ready data exports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Global State Scope */}
            <Select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
            >
              <option value="ALL">All States (National)</option>
              {uniqueStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>

            {/* Date Scope */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-md p-1 text-xs">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-transparent px-2 py-0.5 outline-none text-xs font-mono text-zinc-800"
              />
              <span className="text-zinc-500 font-medium text-xs">to</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-transparent px-2 py-0.5 outline-none text-xs font-mono text-zinc-800"
              />
            </div>

            {/* Sync Button */}
            <Button
              variant="default"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`size-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync: {lastRefreshed}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── 5 Executive KPI Summary Cards (Clean, Consistent Monochromatic Palette) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Net Revenue</span>
              <IndianRupee className="size-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">₹{netRevenue.toLocaleString()}</div>
            <span className="text-xs text-zinc-500">Post-refund realized</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Success Count</span>
              <CreditCard className="size-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">{totalTransactions}</div>
            <span className="text-xs text-zinc-500">Successful deposits</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Refund</span>
              <RotateCcw className="size-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">₹{totalRefundAmount.toLocaleString()}</div>
            <span className="text-xs text-zinc-500">1.8% of gross volume</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Refund Count</span>
              <ShieldCheck className="size-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">{refundCount}</div>
            <span className="text-xs text-zinc-500">Resolved claims</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Manual Rev.</span>
              <Layers className="size-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">₹{manualRevenue.toLocaleString()}</div>
            <span className="text-xs text-zinc-500">Cash desk & OTC</span>
          </CardContent>
        </Card>
      </div>

      {/* ── Booking Channel Share & Adoption Trends ── */}
      <BookingsOverviewChart />

      {/* ── Export Control Center Section ── */}
      <div className="flex items-center gap-2 pt-2">
        <ArrowDownToLine className="size-4 text-neutral-700" />
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Export Control Center</h2>
          <p className="text-xs text-neutral-500">
            Generate itemized XLSX/CSV records for regional compliance, daily cash closing, and tax reporting.
          </p>
        </div>
      </div>

      {/* 4 Dedicated Export Cards (Consistent, Clean Neutral Cards with Simple White Buttons) */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* Card 1: Daily Transaction Report */}
        <Card>
          <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-neutral-100 text-neutral-700 rounded-lg shrink-0 mt-0.5">
                <FileSpreadsheet className="size-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Daily Transaction Itemized Report</h3>
                <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">
                  Full itemized record of all successful payments, extensions, and refunds for a single day.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="date"
                    value={dailyDate}
                    onChange={e => setDailyDate(e.target.value)}
                    className="h-8 px-2.5 bg-white border border-neutral-200 rounded-md text-xs font-mono font-medium text-neutral-800 outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <span className="text-xs text-neutral-500">Selected Date</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openExportModal('daily', 'Daily Transaction Report')}
              className="bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800 shrink-0 self-start md:self-center font-medium shadow-xs"
            >
              <Download className="size-3.5 mr-1.5 text-neutral-600" />
              <span>Configure & Export</span>
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: Monthly Financial Summary */}
        <Card>
          <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-neutral-100 text-neutral-700 rounded-lg shrink-0 mt-0.5">
                <Calendar className="size-5 text-primary-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Monthly Financial & State Tax Summary</h3>
                <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">
                  Consolidated transaction logs grouped by state. Essential for monthly accounts and tax auditing.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Select
                    value={monthlyMonth}
                    onChange={e => setMonthlyMonth(e.target.value)}
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
                  </Select>
                  <Select
                    value={monthlyYear}
                    onChange={e => setMonthlyYear(e.target.value)}
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openExportModal('monthly', `Monthly Tax Report (${monthlyMonth}/${monthlyYear})`)}
              className="bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800 shrink-0 self-start md:self-center font-medium shadow-xs"
            >
              <Download className="size-3.5 mr-1.5 text-neutral-600" />
              <span>Configure & Export</span>
            </Button>
          </CardContent>
        </Card>

        {/* Card 3: Cancellation Audit Log */}
        <Card>
          <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-neutral-100 text-neutral-700 rounded-lg shrink-0 mt-0.5">
                <RotateCcw className="size-5 text-error-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Cancellation & Refund Audit Log</h3>
                <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">
                  Security-focused summary of manually and automatically cancelled bookings for the selected date.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="date"
                    value={cancellationDate}
                    onChange={e => setCancellationDate(e.target.value)}
                    className="h-8 px-2.5 bg-white border border-neutral-200 rounded-md text-xs font-mono font-medium text-neutral-800 outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openExportModal('cancellation', 'Cancellation Audit Log')}
              className="bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800 shrink-0 self-start md:self-center font-medium shadow-xs"
            >
              <Download className="size-3.5 mr-1.5 text-neutral-600" />
              <span>Configure & Export</span>
            </Button>
          </CardContent>
        </Card>

        {/* Card 4: Terminal-Wise Monthly Invoice Report */}
        <Card>
          <CardContent className="p-4 sm:p-6 bg-white flex flex-col gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                <FileSpreadsheet className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    Terminal Deep-Dive
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">Scope: Filtered Device Matrix</span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mt-1">Terminal-Specific Financial Breakdown</h3>
                <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">
                  Download a detailed financial summary for a specific terminal node with State, City, and Terminal filtering.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-zinc-100">
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">
                  State
                </label>
                <Select
                  value={twState}
                  onChange={e => {
                    setTwState(e.target.value);
                    setTwCity('');
                    setTwTerminalId('');
                  }}
                  containerClassName="w-full"
                >
                  <option value="">Select State</option>
                  {uniqueStates.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">
                  City
                </label>
                <Select
                  value={twCity}
                  disabled={!twState}
                  onChange={e => {
                    setTwCity(e.target.value);
                    setTwTerminalId('');
                  }}
                  containerClassName="w-full"
                >
                  <option value="">Select City</option>
                  {twAvailableCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">
                  Terminal Code
                </label>
                <Select
                  value={twTerminalId}
                  onChange={e => setTwTerminalId(e.target.value)}
                  containerClassName="w-full"
                >
                  <option value="">Select Terminal ({twAvailableTerminals.length} Available)</option>
                  {twAvailableTerminals.map(t => (
                    <option key={t.id} value={t.code}>
                      {t.code} — {t.siteName}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">
                  Month & Year
                </label>
                <div className="flex gap-1.5">
                  <Select
                    value={twMonth}
                    onChange={e => setTwMonth(e.target.value)}
                    containerClassName="flex-1"
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
                  </Select>
                  <Select
                    value={twYear}
                    onChange={e => setTwYear(e.target.value)}
                    containerClassName="w-24"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </Select>
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={handleTerminalReportDownload}
                  disabled={isDownloadingTw}
                  className="w-full bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800 font-medium shadow-xs"
                >
                  <Download className="size-3.5 mr-1.5 text-neutral-600" />
                  <span>{isDownloadingTw ? 'Downloading...' : 'Download Report'}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Column Customization Modal ── */}
      <Modal
        isOpen={exportModal.isOpen}
        onClose={() => setExportModal({ isOpen: false, type: 'daily', title: '' })}
        title={`Configure & Export: ${exportModal.title}`}
        subtitle="Customize your regional scope and selected data columns before download"
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4 text-sm">
          {/* Regional Scope */}
          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                State Jurisdiction Scope
              </label>
              <Badge variant="outline" size="sm" className="font-mono text-zinc-600">
                {exportStateScope === 'ALL' ? 'Multi-Sheet Excel' : 'Single State CSV'}
              </Badge>
            </div>
            <Select
              value={exportStateScope}
              onChange={e => setExportStateScope(e.target.value)}
              containerClassName="w-full"
            >
              <option value="ALL">All States (Multi-Sheet Excel Workbook)</option>
              {uniqueStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>

          {/* Column Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-zinc-800">
                Visible Export Columns ({selectedColumns.length} of {ALL_EXPORT_COLUMNS.length} selected)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectAllColumns(true)}
                  className="text-xs text-zinc-800 font-semibold hover:underline"
                >
                  Select All
                </button>
                <span className="text-zinc-300">•</span>
                <button
                  type="button"
                  onClick={() => handleSelectAllColumns(false)}
                  className="text-xs text-zinc-500 font-medium hover:underline"
                >
                  Clear Non-Essential
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 border border-zinc-200 rounded-lg bg-zinc-50/50 custom-scrollbar">
              {ALL_EXPORT_COLUMNS.map(col => {
                const checked = selectedColumns.includes(col.id);
                return (
                  <label
                    key={col.id}
                    className={`flex items-center gap-2 p-2 rounded-md border text-xs cursor-pointer select-none transition-all ${
                      checked
                        ? 'bg-white border-zinc-300 text-zinc-900 font-medium shadow-xs'
                        : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.id)}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 size-3.5"
                    />
                    <span className="truncate">{col.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <Button
              variant="ghost"
              onClick={() => setExportModal({ isOpen: false, type: 'daily', title: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleExecuteExport}
              disabled={isDownloading || selectedColumns.length === 0}
            >
              <Download className="size-3.5 mr-1.5" />
              <span>{isDownloading ? 'Generating File...' : 'Generate & Download'}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
