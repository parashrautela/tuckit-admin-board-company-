import React, { useState } from 'react';
import { Booking } from '@/types';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Box,
  MapPin,
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

  if (!booking) return null;

  // Financial calculations matching brand ledger
  const baseAmount = booking.amount || 50;
  const cgst = +(baseAmount * 0.09).toFixed(2);
  const sgst = +(baseAmount * 0.09).toFixed(2);
  const excessFee = booking.extraCharges || (booking.bookingStatus === 'OVERDUE' ? 25 : 0);
  const modifyFee = 0;
  const totalPayable = +(baseAmount + cgst + sgst + excessFee + modifyFee).toFixed(2);
  const isPaid = booking.bookingStatus === 'COMPLETED' || booking.paymentMethod === 'UPI' || booking.paymentMethod === 'CARD' || booking.bookingStatus === 'ACTIVE';
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
      timestamp: `${booking.openDateTime ? booking.openDateTime.split(' ')[0] : '2024-08-16'}, 10:43:04 pm`,
      message: 'Locker door closed. Storage complete.',
    },
    {
      id: 'log-2',
      actor: 'SYSTEM',
      event: 'LOCKER_OPENED',
      timestamp: `${booking.openDateTime ? booking.openDateTime.split(' ')[0] : '2024-08-16'}, 10:43:00 pm`,
      message: 'Locker door opened for storage.',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-neutral-300 shadow-2xl rounded-2xl bg-white focus:outline-none max-h-[90vh] flex flex-col">
        {/* Accessible hidden title elements */}
        <DialogTitle className="sr-only">Booking Details {booking.invoiceNumber}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed view and telemetry for reservation {booking.invoiceNumber}
        </DialogDescription>

        {/* ── Modal Header ── */}
        <div className="p-6 pb-4 border-b border-neutral-200 flex items-start justify-between gap-4 bg-white shrink-0 pr-14">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-neutral-100 flex items-center justify-center border border-neutral-200 shrink-0 shadow-2xs">
              <Box className="size-6 text-neutral-800" strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Booking Details</h2>
                <Badge variant="outline" className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 border-neutral-300 px-2.5 py-0.5">
                  Invoice No.: {booking.invoiceNumber}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium mt-1">
                <MapPin className="size-3.5 text-neutral-500 shrink-0" />
                <span>
                  {booking.terminalSiteName || `${booking.terminalCode} — ${booking.city || 'Bangalore'}`} ({booking.state || 'Karnataka'})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={booking.bookingStatus} pulse={booking.bookingStatus === 'ACTIVE'} />
          </div>
        </div>

        {/* ── Scrollable Body Content ── */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-white">
          {/* ── 1. Top Section: 6 Unified Icon Cards + Refined Dark Grey Card ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 2 cols: 6 Metadata Cards in 2x3 grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Customer Name */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <User className="size-4.5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Customer Name</span>
                    <span className="text-sm font-bold text-neutral-900 truncate block mt-0.5">{booking.customerName}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Number */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Phone className="size-4.5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Mobile Number</span>
                    <span className="text-sm font-bold font-mono text-neutral-900 truncate block mt-0.5">{booking.mobileNumber}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Date of Birth */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Calendar className="size-4.5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Date of Birth</span>
                    <span className="text-sm font-semibold text-neutral-900 block mt-0.5">
                      {booking.dateOfBirth || '02 Apr 2000'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Terminal Code */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Briefcase className="size-4.5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Terminal Code</span>
                    <span className="text-sm font-bold font-mono text-neutral-900 truncate block mt-0.5">{booking.terminalCode}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Locker Name */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Lock className="size-4.5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Locker Name</span>
                    <span className="text-sm font-bold text-neutral-900 truncate block mt-0.5">
                      {booking.lockName} ({booking.bookingType === 'MOBILE' ? 'S' : 'M'})
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Passcode */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                      <Tag className="size-4.5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Passcode</span>
                      <span className="text-sm font-bold font-mono text-neutral-900 tracking-wider block mt-0.5">
                        {showSensitive ? booking.passcode : '••••'}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSensitive(!showSensitive)}
                    className="size-7 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200"
                    title={showSensitive ? 'Hide Passcode' : 'Reveal Passcode'}
                  >
                    {showSensitive ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right col: Refined Charcoal-Grey Payable Card (Soft, subtle & elegant) */}
            <Card className="border border-neutral-700/80 bg-neutral-800 text-white shadow-md flex flex-col justify-between overflow-hidden">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Total Amount Payable
                  </span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-3xl font-extrabold tracking-tight text-white">₹{totalPayable.toFixed(2)}</span>
                    <span className="text-xs text-neutral-300 font-medium">Incl. GST</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-700 mt-5 text-xs">
                  <div>
                    <span className="text-xs font-bold text-neutral-300 block uppercase tracking-wider">Paid Amount</span>
                    <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
                      ₹{paidAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-neutral-300 block uppercase tracking-wider">Pending</span>
                    <span className="text-base font-bold font-mono text-amber-400 mt-0.5 block">
                      ₹{pendingAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── 2. TIMELINE & USAGE ── */}
          <div>
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">Timeline & Usage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Check-in */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Clock className="size-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Check-In Time</span>
                    <span className="text-xs font-bold text-neutral-900 truncate block mt-0.5">
                      {booking.openDateTime || '2024-08-16 08:00'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Check-out Expected */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Clock className="size-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Check-Out (Exp)</span>
                    <span className="text-xs font-bold text-neutral-900 truncate block mt-0.5">
                      {booking.expectedCheckoutTime || '2024-08-16 09:00'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Duration */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Activity className="size-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Total Duration</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-0.5">
                      {booking.duration || '1 Hours'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Overdue Time */}
              <Card className="border border-neutral-200 bg-neutral-50/60 shadow-2xs">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Info className="size-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Overdue Time</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-0.5">
                      {excessFee > 0 ? `${excessFee} mins excess` : 'No Excess'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ── 3. FINANCIAL BREAKDOWN ── */}
          <Card className="border border-neutral-200 bg-neutral-50/40 shadow-2xs">
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 uppercase tracking-wider">
                <CreditCard className="size-4 text-neutral-600" />
                <span>Financial Breakdown</span>
              </div>

              {/* Numeric Stats */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pb-3 border-b border-neutral-200">
                <div>
                  <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Base Fare</span>
                  <span className="text-sm font-bold font-mono text-neutral-900 mt-0.5 block">₹{baseAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Net Amount</span>
                  <span className="text-sm font-bold font-mono text-neutral-900 mt-0.5 block">₹{baseAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">CGST</span>
                  <span className="text-sm font-bold font-mono text-neutral-900 mt-0.5 block">₹{cgst.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">SGST</span>
                  <span className="text-sm font-bold font-mono text-neutral-900 mt-0.5 block">₹{sgst.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Excess Fee</span>
                  <span className="text-sm font-bold font-mono text-rose-700 mt-0.5 block">₹{excessFee.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Modify Fee</span>
                  <span className="text-sm font-bold font-mono text-blue-700 mt-0.5 block">₹{modifyFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Bottom 3 attributes with unified icon chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white border border-neutral-200 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Globe className="size-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Booking Source</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-0.5 uppercase">
                      {booking.bookingSource || 'TOUCHSCREEN'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-neutral-200 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <RotateCcw className="size-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Modification Count</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-0.5 uppercase">
                      0 TIMES
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-neutral-200 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 flex items-center justify-center shrink-0">
                    <Package className="size-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">Stored Items</span>
                    <span className="text-xs font-bold text-neutral-900 block mt-0.5 uppercase truncate">
                      {storedItemText}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── 4. ACTIVITY TIMELINE & REMARKS ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Activity Timeline & Remarks</h3>
              <Badge variant="outline" className="text-xs font-bold text-neutral-800 font-mono bg-neutral-100 border-neutral-300">
                {logs.length} LOGS
              </Badge>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-300">
              {logs.map(log => (
                <div key={log.id} className="relative flex flex-col gap-1.5">
                  <div className="absolute -left-6 top-1.5 size-5 rounded-full bg-white border-2 border-neutral-400 flex items-center justify-center">
                    <Settings className="size-3 text-neutral-700" />
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="font-bold text-neutral-900">{log.actor}</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-200 text-xs font-bold font-mono text-neutral-900 border border-neutral-300">
                      {log.event}
                    </span>
                    <span className="text-neutral-600 font-mono text-xs font-semibold ml-auto">{log.timestamp}</span>
                  </div>
                  <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 italic shadow-2xs">
                    "{log.message}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-center bg-white shrink-0">
          <Button
            type="button"
            variant="default"
            onClick={onClose}
            className="px-8 py-2.5 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
