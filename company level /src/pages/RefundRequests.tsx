import React, { useState } from 'react';
import { CreditCard, Search, CheckCircle2, XCircle, AlertCircle, Eye, ArrowUpRight } from 'lucide-react';
import { Modal } from '../components/common/Modal';

interface RefundRequest {
  id: string;
  bookingId: string;
  customerName: string;
  phone: string;
  terminalCode: string;
  amount: number;
  reason: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentGatewayRef: string;
}

const initialRequests: RefundRequest[] = [
  { id: 'REF-8012', bookingId: 'BK-99412', customerName: 'Arjun Rao', phone: '+91 9845012345', terminalCode: 'MALL-BLR-01', amount: 240, reason: 'Door failed to open after payment, locker was empty', requestedAt: '16 Aug 2024, 18:30', status: 'PENDING', paymentGatewayRef: 'pay_Nz9823kLm1' },
  { id: 'REF-8013', bookingId: 'BK-99418', customerName: 'Divya N', phone: '+91 9711223344', terminalCode: 'METRO-DEL-04', amount: 150, reason: 'Accidental double payment via UPI', requestedAt: '16 Aug 2024, 19:15', status: 'PENDING', paymentGatewayRef: 'pay_Kp8821aBb2' },
  { id: 'REF-8014', bookingId: 'BK-99425', customerName: 'Sanjay Gupta', phone: '+91 9988776655', terminalCode: 'MALL-MUM-02', amount: 350, reason: 'Cancelled booking within 5 minutes', requestedAt: '16 Aug 2024, 20:00', status: 'PENDING', paymentGatewayRef: 'pay_Mm5431xZz9' },
  { id: 'REF-8015', bookingId: 'BK-99430', customerName: 'Ananya Roy', phone: '+91 9123456780', terminalCode: 'AIRP-HYD-01', amount: 480, reason: 'Terminal rebooted during checkout', requestedAt: '16 Aug 2024, 21:10', status: 'PENDING', paymentGatewayRef: 'pay_Tt1290pQq3' },
];

export const RefundRequests: React.FC = () => {
  const [requests, setRequests] = useState<RefundRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'APPROVE' | 'REJECT'; item: RefundRequest | null }>({ isOpen: false, type: 'APPROVE', item: null });
  const [adminNote, setAdminNote] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (!actionModal.item) return;
    setRequests(prev => prev.map(r => r.id === actionModal.item!.id ? { ...r, status } : r));
    setToastMessage(`Refund ${actionModal.item.id} has been ${status.toLowerCase()} successfully.`);
    setActionModal({ isOpen: false, type: 'APPROVE', item: null });
    setAdminNote('');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Refund Requests Queue
            </h1>
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full">
              {pendingRequests.length} PENDING
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Review, approve, or decline customer refund claims and transaction reversals</p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {toastMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">REFUND ID</th>
                <th className="py-3 px-4">BOOKING</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">TERMINAL</th>
                <th className="py-3 px-4">AMOUNT</th>
                <th className="py-3 px-4">REASON</th>
                <th className="py-3 px-4">REQUESTED</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-400 font-medium">
                    No pending refund requests in queue!
                  </td>
                </tr>
              ) : (
                pendingRequests.map(r => (
                  <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">{r.id}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-primary">{r.bookingId}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-800">{r.customerName}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{r.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-700 font-semibold">{r.terminalCode}</td>
                    <td className="py-3 px-4 font-black text-zinc-900">₹{r.amount}</td>
                    <td className="py-3 px-4 text-zinc-600 max-w-[220px] truncate" title={r.reason}>
                      {r.reason}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">{r.requestedAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActionModal({ isOpen: true, type: 'APPROVE', item: r })}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setActionModal({ isOpen: true, type: 'REJECT', item: r })}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <XCircle className="h-3 w-3" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: 'APPROVE', item: null })}
        title={actionModal.type === 'APPROVE' ? 'Approve Refund Request' : 'Decline Refund Request'}
        maxWidth="md"
      >
        {actionModal.item && (
          <div className="space-y-4">
            <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-zinc-500">Refund ID:</span><span className="font-mono font-bold text-zinc-900">{actionModal.item.id}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Customer:</span><span className="font-bold text-zinc-900">{actionModal.item.customerName}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Refund Amount:</span><span className="font-black text-primary text-sm">₹{actionModal.item.amount}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Gateway Ref:</span><span className="font-mono text-zinc-600">{actionModal.item.paymentGatewayRef}</span></div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Admin Audit Note</label>
              <textarea
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder={actionModal.type === 'APPROVE' ? 'e.g. Verified sensor anomaly on terminal door 4' : 'e.g. Customer checkout was normal, luggage retrieved'}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-primary h-20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal({ isOpen: false, type: 'APPROVE', item: null })}
                className="px-3.5 py-2 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAction(actionModal.type === 'APPROVE' ? 'APPROVED' : 'REJECTED')}
                className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-sm ${
                  actionModal.type === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {actionModal.type === 'APPROVE' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
