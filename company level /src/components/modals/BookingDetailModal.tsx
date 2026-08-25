import React, { useState } from 'react';
import { Booking } from '@/types';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Phone,
  Calendar,
  KeyRound,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Building2,
  Lock,
  CreditCard,
  Download,
  Copy,
  Check,
  ShieldAlert,
  Smartphone,
  Globe,
  Monitor,
  MessageSquare,
  QrCode,
  Layers,
  FileText,
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

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    if (showToast) {
      showToast(`Copied ${fieldName} to clipboard`, 'success');
    }
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Touchscreen':
        return <Monitor className="size-3.5 text-neutral-500" />;
      case 'Mobile App':
        return <Smartphone className="size-3.5 text-neutral-500" />;
      case 'Web':
        return <Globe className="size-3.5 text-neutral-500" />;
      case 'WhatsApp':
        return <MessageSquare className="size-3.5 text-neutral-500" />;
      default:
        return <QrCode className="size-3.5 text-neutral-500" />;
    }
  };

  const totalAmount = booking.totalPaid || booking.amount;
  const extraCharges = booking.extraCharges || (booking.bookingStatus === 'OVERDUE' ? 120 : 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reservation Details — ${booking.invoiceNumber}`}
      subtitle={`${booking.terminalCode} • Lock ${booking.lockName} • ${booking.city}, ${booking.state}`}
      maxWidth="lg"
    >
      <div className="flex flex-col gap-5 text-sm">
        {/* ── Top Overview Banner ── */}
        <div className="p-4 bg-neutral-50/80 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-white border border-neutral-200 shadow-2xs flex items-center justify-center text-primary font-mono font-bold text-base shrink-0">
              <Lock className="size-5 text-neutral-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-neutral-900 font-mono">
                  {booking.terminalCode} <span className="text-neutral-400 font-normal">/</span> {booking.lockName}
                </span>
                <StatusBadge status={booking.bookingStatus} pulse={booking.bookingStatus === 'ACTIVE'} />
                <Badge variant="outline" size="sm" className="font-mono text-xs text-neutral-700 bg-white">
                  {booking.bookingType || 'BAGGAGE'}
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">
                {booking.terminalSiteName || `${booking.city} Fleet Node`} • {booking.siteType || 'Commercial'} Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy(booking.invoiceNumber, 'Invoice Number')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            >
              {copiedField === 'Invoice Number' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5 text-neutral-500" />}
              <span>{copiedField === 'Invoice Number' ? 'Copied' : 'Copy Ref'}</span>
            </button>

            {onForceUnlock && (
              <button
                type="button"
                onClick={() => onForceUnlock(booking)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                title="Emergency Force Unlock"
              >
                <ShieldAlert className="size-3.5 text-rose-600" />
                <span>Force Unlock</span>
              </button>
            )}
          </div>
        </div>

        {/* ── 2-Column Section Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 1: Customer Profile & Security Credentials */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 uppercase tracking-wider text-xs">
                <User className="size-4 text-neutral-500" />
                <span>Customer & Access Credentials</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSensitive(!showSensitive)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-md transition-colors"
              >
                {showSensitive ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                <span>{showSensitive ? 'Hide PII' : 'Reveal PII'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Full Name</span>
                <p className="font-bold text-neutral-900 text-sm mt-0.5 truncate">{booking.customerName}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Mobile Number</span>
                <p className="font-mono font-bold text-neutral-900 text-sm mt-0.5">{booking.mobileNumber}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Date of Birth</span>
                <p className="font-mono font-semibold text-neutral-900 text-sm mt-0.5">
                  {booking.dateOfBirth ? (
                    showSensitive ? (
                      booking.dateOfBirth
                    ) : (
                      <span className="text-neutral-400">••••-••-••</span>
                    )
                  ) : (
                    <span className="text-neutral-400">Not provided</span>
                  )}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Door Passcode</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="font-mono font-bold text-neutral-900 text-sm">
                    {showSensitive ? (
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-sm font-mono font-bold">
                        {booking.passcode}
                      </span>
                    ) : (
                      <span className="text-neutral-400">••••</span>
                    )}
                  </p>
                  {showSensitive && (
                    <button
                      type="button"
                      onClick={() => handleCopy(booking.passcode, 'Door Passcode')}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-700"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Session Timestamps & Chronology */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 uppercase tracking-wider text-xs">
                <Clock className="size-4 text-neutral-500" />
                <span>Session Chronology & Duration</span>
              </div>
              <span className="font-mono text-xs font-semibold text-neutral-600">
                {booking.duration || 'Flexible'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Check-In / Start Time</span>
                <p className="font-mono font-semibold text-neutral-900 text-sm mt-0.5">
                  {booking.openDateTime || booking.checkinTime || '—'}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Allocated Duration</span>
                <p className="font-semibold text-neutral-900 text-sm mt-0.5">
                  {booking.duration} {booking.durationHours ? `(${booking.durationHours} hrs)` : ''}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Expected Checkout</span>
                <p className="font-mono font-semibold text-neutral-800 text-sm mt-0.5">
                  {booking.expectedCheckoutTime || 'Standard Schedule'}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Actual Retrieval</span>
                <p className="font-mono font-semibold text-neutral-800 text-sm mt-0.5">
                  {booking.actualCheckoutTime || (booking.bookingStatus === 'ACTIVE' ? 'In Progress' : '—')}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Hardware, Location & Booking Channel */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 uppercase tracking-wider text-xs">
                <Building2 className="size-4 text-neutral-500" />
                <span>Hardware & Geographic Hub</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-600 font-semibold">
                {getSourceIcon(booking.bookingSource || 'Touchscreen')}
                <span>{booking.bookingSource || 'Touchscreen'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Terminal Code</span>
                <p className="font-mono font-bold text-neutral-900 text-sm mt-0.5">{booking.terminalCode}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Locker Unit / Door</span>
                <p className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                  {booking.lockName} {booking.lockerDoorNumber ? `(#${booking.lockerDoorNumber})` : ''}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Facility / Site Type</span>
                <p className="font-semibold text-neutral-900 text-sm mt-0.5">{booking.siteType || 'Commercial'}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Region & City</span>
                <p className="font-semibold text-neutral-900 text-sm mt-0.5">{booking.city}, {booking.state}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Financial Ledger & Settlement */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 uppercase tracking-wider text-xs">
                <CreditCard className="size-4 text-neutral-500" />
                <span>Financial Ledger & Invoice</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                ₹{totalAmount.toLocaleString()} Settled
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Payment Method</span>
                <p className="font-semibold text-neutral-900 text-sm mt-0.5">{booking.paymentMethod}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Base Rate</span>
                <p className="font-mono font-semibold text-neutral-900 text-sm mt-0.5">₹{booking.amount}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Extra / Overdue Fee</span>
                <p className={`font-mono font-semibold text-sm mt-0.5 ${extraCharges > 0 ? 'text-rose-600 font-bold' : 'text-neutral-600'}`}>
                  {extraCharges > 0 ? `+ ₹${extraCharges}` : '₹0 (None)'}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Transaction Ref</span>
                <p className="font-mono text-neutral-700 mt-0.5 truncate text-xs" title={booking.transactionRef || `TXN-${booking.id}`}>
                  {booking.transactionRef || `TXN-${booking.id.slice(0, 10)}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
            <span>UUID: {booking.id}</span>
            {booking.serialNumber && <span>• SN: #{booking.serialNumber}</span>}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => {
                if (showToast) {
                  showToast(`Invoice PDF ${booking.invoiceNumber} generated for download`, 'success');
                }
              }}
              className="text-xs font-semibold h-9 px-3.5"
            >
              <Download className="size-4 mr-1.5" />
              <span>Download Invoice</span>
            </Button>

            <Button
              type="button"
              variant="default"
              size="default"
              onClick={onClose}
              className="text-xs font-semibold h-9 px-4"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
