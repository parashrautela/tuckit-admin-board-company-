import React from 'react';
import { Booking } from '@/types';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Clock,
  Smartphone,
  Globe,
  CheckCircle2,
  XCircle,
  Coins,
  Receipt,
  ShieldCheck,
  ChevronDown,
  X,
} from 'lucide-react';

interface PaymentHoverBadgeProps {
  booking: Booking;
}

export const PaymentHoverBadge: React.FC<PaymentHoverBadgeProps> = ({ booking }) => {
  const method = (booking.paymentMethod || 'PAY LATER').toUpperCase();

  // Determine payment history data based on method & booking attributes
  const isPayLater = method === 'PAY LATER' || method === 'CASH' || booking.bookingStatus === 'OVERDUE';
  const isMultiAttempt = booking.id.endsWith('3') || booking.id.endsWith('7');
  const isPaid = !isPayLater && (booking.bookingStatus === 'COMPLETED' || booking.bookingStatus === 'ACTIVE');

  const basePrice = booking.amount || 64.9;
  const attemptsCount = isPayLater ? 0 : isMultiAttempt ? 3 : 1;
  const successfulCount = isPayLater ? 0 : isMultiAttempt ? 2 : 1;
  const totalPaid = isPayLater ? 0 : isMultiAttempt ? 64.9 : basePrice;

  // Mocked itemized transactions for realistic telemetry inspection
  const transactions = isPayLater
    ? []
    : isMultiAttempt
    ? [
        {
          id: 'tx-1',
          amount: 11.8,
          type: 'MID ACCESS PAYMENT',
          status: 'SUCCESS',
        },
        {
          id: 'tx-2',
          amount: 11.8,
          type: 'MID ACCESS PAYMENT',
          status: 'FAILED',
        },
        {
          id: 'tx-3',
          amount: 53.1,
          type: 'STORAGE PAYMENT',
          status: 'SUCCESS',
        },
      ]
    : [
        {
          id: 'tx-1',
          amount: totalPaid,
          type: 'STORAGE PAYMENT',
          status: 'SUCCESS',
        },
      ];

  // High-contrast subtle styling configuration for the trigger pill (passes WCAG AA)
  const getBadgeStyle = () => {
    switch (method) {
      case 'PAY LATER':
        return {
          container: 'bg-amber-50 hover:bg-amber-100/90 text-amber-950 border-amber-300 font-bold',
          icon: <Clock className="size-3.5 text-amber-800" strokeWidth={2.2} />,
          label: 'PAY LATER',
        };
      case 'UPI':
        return {
          container: 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 border-emerald-300 font-bold',
          icon: <Smartphone className="size-3.5 text-emerald-800" strokeWidth={2.2} />,
          label: 'UPI',
        };
      case 'ONLINE':
      case 'WEB':
        return {
          container: 'bg-blue-50 hover:bg-blue-100/90 text-blue-950 border-blue-300 font-bold',
          icon: <Globe className="size-3.5 text-blue-800" strokeWidth={2.2} />,
          label: 'ONLINE',
        };
      case 'CARD':
        return {
          container: 'bg-purple-50 hover:bg-purple-100/90 text-purple-950 border-purple-300 font-bold',
          icon: <CreditCard className="size-3.5 text-purple-800" strokeWidth={2.2} />,
          label: 'CARD',
        };
      default:
        return {
          container: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-300 font-bold',
          icon: <CreditCard className="size-3.5 text-neutral-800" strokeWidth={2.2} />,
          label: method,
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <HoverCard openDelay={120} closeDelay={150}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all duration-150 shadow-2xs select-none cursor-pointer ${badgeStyle.container}`}
          >
            {badgeStyle.icon}
            <span>{badgeStyle.label}</span>
          </button>
        </HoverCardTrigger>

        <HoverCardContent
          align="start"
          side="top"
          sideOffset={8}
          className="w-[380px] sm:w-[400px] p-0 rounded-2xl border border-neutral-300 bg-white shadow-xl shadow-neutral-950/15 overflow-hidden text-neutral-900 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* ── 1. Header ── */}
          <div className="p-4 border-b border-neutral-200 flex items-start justify-between gap-3 bg-white">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CreditCard className="size-5" strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 leading-tight">Payment History</h4>
                <p className="text-xs text-neutral-600 font-medium mt-0.5">View all payment status</p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="text-xs font-mono font-bold uppercase tracking-wider bg-neutral-100 border-neutral-300 text-neutral-900 px-2.5 py-0.5"
            >
              {attemptsCount} {attemptsCount === 1 ? 'ATTEMPT' : 'ATTEMPTS'}
            </Badge>
          </div>

          {/* ── 2. Top Summary Card ── */}
          <div className="p-4 pt-3.5 space-y-3">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-white border border-neutral-300 flex items-center justify-center text-neutral-700 shadow-2xs">
                  <Coins className="size-4.5 text-neutral-800" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider block leading-none">
                    Total Paid
                  </span>
                  <span className="text-base font-extrabold font-mono text-neutral-900 mt-1 block leading-tight">
                    ₹{totalPaid.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div className="size-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
                  <CheckCircle2 className="size-4.5" strokeWidth={2.2} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-emerald-900 block leading-tight">
                    {successfulCount} Successful {successfulCount === 1 ? 'Payment' : 'Payments'}
                  </span>
                  <span className="text-xs text-neutral-600 font-medium block mt-0.5 leading-none">
                    All transactions synced
                  </span>
                </div>
              </div>
            </div>

            {/* ── 3. Transaction Items List or Empty State ── */}
            {isPayLater ? (
              <div className="py-7 px-4 text-center flex flex-col items-center justify-center bg-white rounded-xl">
                <div className="size-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-2.5 text-neutral-500 border border-neutral-200">
                  <Receipt className="size-6 stroke-[1.8]" />
                </div>
                <h5 className="text-xs font-bold text-neutral-900">No Transactions Recorded</h5>
                <p className="text-xs text-neutral-600 font-medium mt-1 max-w-[280px] leading-normal text-center whitespace-normal">
                  Transactions will appear here when payment activity occurs.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                {transactions.map((tx) => {
                  const isSuccess = tx.status === 'SUCCESS';
                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isSuccess ? (
                          <div className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="size-4" strokeWidth={2.4} />
                          </div>
                        ) : (
                          <div className="size-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                            <X className="size-3.5 stroke-[2.8]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-neutral-900">
                              ₹{tx.amount.toFixed(2)}
                            </span>
                            <span className="text-xs font-bold font-mono text-neutral-700 uppercase tracking-tight bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-300">
                              {tx.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${
                            isSuccess
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-rose-50 text-rose-900 border-rose-300'
                          }`}
                        >
                          <span>{isSuccess ? '✓ SUCCESS' : '✕ FAILED'}</span>
                          <ChevronDown className="size-3 opacity-70" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── 4. Bottom Security Footer (High Contrast Reassurance) ── */}
          <div className="p-3.5 px-4 bg-neutral-100 border-t border-neutral-200 flex items-center gap-2.5 text-left">
            <ShieldCheck className="size-4.5 text-emerald-700 shrink-0" strokeWidth={2.2} />
            <div>
              <span className="text-xs font-bold text-neutral-900 block leading-tight">
                Payments are secure
              </span>
              <span className="text-xs text-neutral-700 font-medium block leading-tight mt-0.5">
                All payments are encrypted and processed securely.
              </span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
