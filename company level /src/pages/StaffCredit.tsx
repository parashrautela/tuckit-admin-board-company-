import React, { useState } from 'react';
import { WalletCards, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Modal } from '../components/common/Modal';

interface CreditRequest {
  id: string;
  staffName: string;
  phone: string;
  role: string;
  region: string;
  requestedAmount: number;
  reason: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const initialCreditRequests: CreditRequest[] = [
  { id: 'CR-401', staffName: 'Ramesh Verma', phone: '+91 9845012301', role: 'Cash Collector', region: 'Bengaluru Central', requestedAmount: 5000, reason: 'High weekend footfall at Orion Mall kiosks', requestedAt: '16 Aug 2024, 11:30', status: 'PENDING' },
  { id: 'CR-402', staffName: 'Vikas Dubey', phone: '+91 9711002233', role: 'Field Operations', region: 'Delhi Metro Blue Line', requestedAmount: 8000, reason: 'Terminal maintenance cash float & small change', requestedAt: '16 Aug 2024, 14:15', status: 'PENDING' },
  { id: 'CR-403', staffName: 'Pooja Hegde', phone: '+91 9988445566', role: 'Cash Collector', region: 'Mumbai T2 Airport', requestedAmount: 10000, reason: 'Emergency cash float for manual refund backup', requestedAt: '16 Aug 2024, 16:00', status: 'PENDING' },
];

export const StaffCredit: React.FC = () => {
  const [requests, setRequests] = useState<CreditRequest[]>(initialCreditRequests);
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'APPROVE' | 'REJECT'; item: CreditRequest | null }>({ isOpen: false, type: 'APPROVE', item: null });
  const [toast, setToast] = useState('');

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (!actionModal.item) return;
    setRequests(prev => prev.map(r => r.id === actionModal.item!.id ? { ...r, status } : r));
    setToast(`Credit request ${actionModal.item.id} has been ${status.toLowerCase()}!`);
    setActionModal({ isOpen: false, type: 'APPROVE', item: null });
    setTimeout(() => setToast(''), 3500);
  };

  const pending = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
              <WalletCards className="h-5 w-5 text-primary" /> Staff Credit Requests
            </h1>
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full">
              {pending.length} PENDING
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Review and approve operational cash allocations and float allowances for field staff</p>
        </div>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {toast}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">REQ ID</th>
                <th className="py-3 px-4">STAFF MEMBER</th>
                <th className="py-3 px-4">ROLE & REGION</th>
                <th className="py-3 px-4">REQUESTED AMOUNT</th>
                <th className="py-3 px-4">JUSTIFICATION</th>
                <th className="py-3 px-4">REQUESTED AT</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {pending.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400 font-medium">
                    No pending staff credit requests!
                  </td>
                </tr>
              ) : (
                pending.map(r => (
                  <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">{r.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-800">{r.staffName}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{r.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-700">{r.role}</div>
                      <div className="text-[11px] text-zinc-400">{r.region}</div>
                    </td>
                    <td className="py-3 px-4 font-black text-primary text-sm">₹{r.requestedAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-zinc-600 max-w-[240px] truncate" title={r.reason}>
                      {r.reason}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">{r.requestedAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActionModal({ isOpen: true, type: 'APPROVE', item: r })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold rounded-xl shadow-2xs transition-all"
                        >
                          <CheckCircle2 className="size-3.5" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setActionModal({ isOpen: true, type: 'REJECT', item: r })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-xs font-bold rounded-xl transition-all"
                        >
                          <XCircle className="size-3.5" /> Reject
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

      <Modal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: 'APPROVE', item: null })}
        title={actionModal.type === 'APPROVE' ? 'Authorize Staff Credit' : 'Decline Staff Credit'}
        maxWidth="md"
      >
        {actionModal.item && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-600">
              Are you sure you want to {actionModal.type === 'APPROVE' ? 'credit ₹' + actionModal.item.requestedAmount + ' to ' : 'reject the request for '}
              <strong className="text-zinc-900">{actionModal.item.staffName}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal({ isOpen: false, type: 'APPROVE', item: null })}
                className="px-3 py-1.5 border border-zinc-200 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAction(actionModal.type === 'APPROVE' ? 'APPROVED' : 'REJECTED')}
                className={`px-4 py-1.5 text-white text-xs font-bold rounded-lg ${actionModal.type === 'APPROVE' ? 'bg-emerald-600' : 'bg-red-600'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
