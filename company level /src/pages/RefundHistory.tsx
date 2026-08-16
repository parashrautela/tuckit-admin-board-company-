import React, { useState } from 'react';
import { History, Search, Download, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

const initialHistory = [
  { id: 'REF-7998', bookingId: 'BK-98102', customerName: 'Kavita Menon', phone: '+91 9845012399', amount: 180, reason: 'Terminal touchscreen unresponsiveness', status: 'SETTLED', processedAt: '15 Aug 2024, 14:20', processor: 'Parash R (SuperAdmin)', gatewayRef: 'pay_Hh7712kK0' },
  { id: 'REF-7999', bookingId: 'BK-98150', customerName: 'Manoj Kumar', phone: '+91 9711009988', amount: 300, reason: 'Double transaction charge', status: 'SETTLED', processedAt: '15 Aug 2024, 16:45', processor: 'Parash R (SuperAdmin)', gatewayRef: 'pay_Ll3341bB2' },
  { id: 'REF-8000', bookingId: 'BK-98210', customerName: 'Sneha Verma', phone: '+91 9988112233', amount: 120, reason: 'User error: wrong locker size selected', status: 'REJECTED', processedAt: '15 Aug 2024, 18:10', processor: 'Operations Lead', gatewayRef: 'pay_Qq9988vV5' },
  { id: 'REF-8001', bookingId: 'BK-98305', customerName: 'Rajesh Nair', phone: '+91 9123098765', amount: 450, reason: 'Kiosk power disruption during luggage return', status: 'SETTLED', processedAt: '16 Aug 2024, 10:30', processor: 'Parash R (SuperAdmin)', gatewayRef: 'pay_Zz5544mM8' },
  { id: 'REF-8002', bookingId: 'BK-98411', customerName: 'Geetha Patel', phone: '+91 9448011223', amount: 200, reason: 'Exceeded free cancellation window', status: 'REJECTED', processedAt: '16 Aug 2024, 12:00', processor: 'Operations Lead', gatewayRef: 'pay_Pp1122jJ4' },
];

export const RefundHistory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = initialHistory.filter(r => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.customerName.toLowerCase().includes(search.toLowerCase()) && !r.bookingId.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Processed Refund History
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Audit log of all resolved, settled, and rejected transaction refunds</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors">
          <Download className="h-3.5 w-3.5" /> Export History CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search refund ID, booking, customer..."
            className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-10 px-3 bg-white border border-zinc-200 rounded-xl text-xs font-semibold"
        >
          <option value="ALL">All Status</option>
          <option value="SETTLED">Settled</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">REFUND ID</th>
                <th className="py-3 px-4">BOOKING</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">AMOUNT</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">PROCESSED AT</th>
                <th className="py-3 px-4">RESOLVED BY</th>
                <th className="py-3 px-4">GATEWAY REF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">{r.id}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-primary">{r.bookingId}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-zinc-800">{r.customerName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{r.phone}</div>
                  </td>
                  <td className="py-3 px-4 font-black text-zinc-900">₹{r.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'SETTLED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {r.status === 'SETTLED' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">{r.processedAt}</td>
                  <td className="py-3 px-4 text-zinc-700 font-medium">{r.processor}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">{r.gatewayRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
