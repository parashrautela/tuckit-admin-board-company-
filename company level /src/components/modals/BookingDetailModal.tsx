import React, { useState } from 'react';
import { Booking } from '@/types';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Box,
  MapPin,
  X,
  User,
  Phone,
  Calendar,
  Briefcase,
  Lock,
  Tag,
  Clock,
  Activity,
  Info,
  CreditCard,
  Globe,
  RotateCcw,
  Package,
  Settings,
  Copy,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onForceUnlock?: (booking: Booking) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
  onForceUnlock,
  showToast,
}) => {
  const [showSensitive, setShowSensitive] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!booking) return null;

  const handleCopy = (text: string, fieldName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    if (showToast) {
      showToast(`Copied ${fieldName} to clipboard`, 'success');
    }
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Financial calculations
  const baseAmount = booking.amount || 65;
  const cgst = +(baseAmount * 0.09).toFixed(2);
  const sgst = +(baseAmount * 0.09).toFixed(2);
  const excessFee = booking.extraCharges || (booking.bookingStatus === 'OVERDUE' ? 25 : 0);
  const modifyFee = 0;
  const totalPayable = +(baseAmount + cgst + sgst + excessFee + modifyFee).toFixed(2);
  const isPaid = booking.bookingStatus === 'COMPLETED' || booking.paymentMethod === 'UPI' || booking.paymentMethod === 'CARD';
  const paidAmount = isPaid ? totalPayable : 0;
  const pendingAmount = isPaid ? 0 : totalPayable;

  // Stored item descriptor
  const storedItemText = booking.bookingType === 'MOBILE' 
    ? 'SMARTPHONE & ACCESSORIES' 
    : booking.lockName?.includes('L') 
      ? 'TROLLEY BAG (LARGE)' 
      : 'TROLLEY BAG (CABIN)';

  const logs = [
    {
      id: 'log-1',
      actor: 'SYSTEM',
      event: 'LOCKER_CLOSED',
      timestamp: `${booking.openDateTime ? booking.openDateTime.split(' ')[0] : '25 Aug 2026'}, 10:43:04 pm`,
      message: 'Locker door closed. Storage complete.',
    },
    {
      id: 'log-2',
      actor: 'SYSTEM',
      event: 'LOCKER_OPENED',
      timestamp: `${booking.openDateTime ? booking.openDateTime.split(' ')[0] : '25 Aug 2026'}, 10:43:00 pm`,
      message: 'Locker door opened for storage.',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-neutral-200/80 shadow-2xl rounded-2xl bg-white focus:outline-none max-h-[90vh] flex flex-col">
        {/* Accessible hidden header elements */}
        <DialogTitle className="sr-only">Booking Details {booking.invoiceNumber}</DialogTitle>
        <DialogDescription className="sr-only">Detailed view and telemetry for reservation {booking.invoiceNumber}</DialogDescription>

        {/* ── Modal Header ── */}
        <div className="p-6 pb-4 border-b border-neutral-100 flex items-start justify-between gap-4 bg-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-neutral-100 flex items-center justify-center border border-neutral-200/60 shrink-0 shadow-2xs">
              <Box className="size-6 text-neutral-800" strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Booking Details</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-neutral-200 bg-neutral-50 text-neutral-600 font-mono text-xs font-semibold">
                  Invoice No.: {booking.invoiceNumber}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium mt-1">
                <MapPin className="size-3.5 text-neutral-400 shrink-0" />
                <span>{booking.terminalSiteName || `${booking.city} Bus Stand`} ({booking.state || 'KL'})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                booking.bookingStatus === 'ACTIVE'
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : booking.bookingStatus === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-rose-50 text-rose-600 border-rose-200'
              }`}
            >
              {booking.bookingStatus}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body Content ── */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-white">
          {/* ── 1. Top Section: 6 Info Cards + Vibrant Payable Card ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 2 cols: 6 Metadata Cards in 2x3 grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Customer Name */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <User className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Customer Name</span>
                  <span className="text-sm font-bold text-neutral-900 truncate block mt-0.5">{booking.customerName}</span>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Mobile Number</span>
                  <span className="text-sm font-bold font-mono text-neutral-900 truncate block mt-0.5">{booking.mobileNumber}</span>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                  <Calendar className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Date of Birth</span>
                  <span className="text-sm font-semibold text-neutral-900 block mt-0.5">
                    {booking.dateOfBirth || '02 Apr 2000'}
                  </span>
                </div>
              </div>

              {/* Terminal Code */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Briefcase className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Terminal Code</span>
                  <span className="text-sm font-bold font-mono text-neutral-900 truncate block mt-0.5">{booking.terminalCode}</span>
                </div>
              </div>

              {/* Locker Name */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Lock className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Locker Name</span>
                  <span className="text-sm font-bold text-neutral-900 truncate block mt-0.5">
                    {booking.lockName} ({booking.bookingType === 'MOBILE' ? 'S' : 'M'})
                  </span>
                </div>
              </div>

              {/* Passcode */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Tag className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Passcode</span>
                    <span className="text-sm font-bold font-mono text-neutral-900 tracking-wider block mt-0.5">
                      {showSensitive ? booking.passcode : '••••'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
                  title={showSensitive ? 'Hide Passcode' : 'Reveal Passcode'}
                >
                  {showSensitive ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Right col: High-Emphasis Vibrant Gradient Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] text-white flex flex-col justify-between shadow-md shadow-indigo-500/10 min-h-[160px]">
              <div>
                <span className="text-xs font-bold text-blue-100 uppercase tracking-wider block">Total Amount Payable</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold tracking-tight">₹{totalPayable.toFixed(2)}</span>
                  <span className="text-xs text-blue-100/90 font-medium">Incl. GST</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/20 mt-4 text-xs">
                <div>
                  <span className="text-[11px] font-medium text-blue-100 block uppercase">Paid Amount</span>
                  <span className="text-base font-bold font-mono text-emerald-300 mt-0.5 block">
                    ₹{paidAmount.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-blue-100 block uppercase">Pending</span>
                  <span className="text-base font-bold font-mono text-amber-300 mt-0.5 block">
                    ₹{pendingAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. TIMELINE & USAGE ── */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">Timeline & Usage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Check-in */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Check-In Time</span>
                  <span className="text-xs font-semibold text-neutral-900 truncate block mt-0.5">
                    {booking.openDateTime || '25 Aug 2026, 10:19:57'}
                  </span>
                </div>
              </div>

              {/* Check-out Expected */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Check-Out (Exp)</span>
                  <span className="text-xs font-semibold text-neutral-900 truncate block mt-0.5">
                    {booking.expectedCheckoutTime || '26 Aug 2026, 03:19:57'}
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Activity className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Total Duration</span>
                  <span className="text-xs font-bold text-neutral-900 block mt-0.5">
                    {booking.duration || '5h 0m'}
                  </span>
                </div>
              </div>

              {/* Overdue Time */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                  <Info className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Overdue Time</span>
                  <span className="text-xs font-semibold text-neutral-900 block mt-0.5">
                    {excessFee > 0 ? `${excessFee} mins excess` : 'No Excess'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. FINANCIAL BREAKDOWN ── */}
          <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/20 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <CreditCard className="size-4 text-neutral-400" />
              <span>Financial Breakdown</span>
            </div>

            {/* Numeric Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Base Fare</span>
                <span className="text-sm font-bold font-mono text-neutral-900 mt-0.5 block">₹{baseAmount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Net Amount</span>
                <span className="text-sm font-bold font-mono text-neutral-900 mt-0.5 block">₹{baseAmount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">CGST</span>
                <span className="text-sm font-bold font-mono text-neutral-900 mt-0.5 block">₹{cgst.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">SGST</span>
                <span className="text-sm font-bold font-mono text-neutral-900 mt-0.5 block">₹{sgst.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Excess Fee</span>
                <span className="text-sm font-bold font-mono text-rose-600 mt-0.5 block">₹{excessFee.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Modify Fee</span>
                <span className="text-sm font-bold font-mono text-blue-600 mt-0.5 block">₹{modifyFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Bottom 3 attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white border border-neutral-200/70 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Globe className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Booking Source</span>
                  <span className="text-xs font-bold text-neutral-900 block mt-0.5 uppercase">
                    {booking.bookingSource || 'WEB'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-neutral-200/70 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Modification Count</span>
                  <span className="text-xs font-bold text-neutral-900 block mt-0.5 uppercase">
                    0 TIMES
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-neutral-200/70 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Package className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Stored Items</span>
                  <span className="text-xs font-bold text-neutral-900 block mt-0.5 uppercase truncate">
                    {storedItemText}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. ACTIVITY TIMELINE & REMARKS ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Activity Timeline & Remarks</h3>
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-bold text-neutral-600 font-mono">
                {logs.length} LOGS
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {logs.map(log => (
                <div key={log.id} className="relative flex flex-col gap-1.5">
                  <div className="absolute -left-6 top-1.5 size-5 rounded-full bg-white border-2 border-neutral-300 flex items-center justify-center">
                    <Settings className="size-2.5 text-neutral-500" />
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="font-bold text-neutral-700">{log.actor}</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] font-bold font-mono text-neutral-600 border border-neutral-200">
                      {log.event}
                    </span>
                    <span className="text-neutral-400 font-mono text-[11px] ml-auto">{log.timestamp}</span>
                  </div>
                  <div className="p-3 bg-neutral-50/70 border border-neutral-200/70 rounded-xl text-xs text-neutral-700 italic">
                    "{log.message}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="p-4 border-t border-neutral-100 flex items-center justify-center bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
          >
            Close Details
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
