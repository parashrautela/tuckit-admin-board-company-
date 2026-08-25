import React, { useState } from 'react';
import { ShieldBan, Search, RotateCcw, AlertTriangle } from 'lucide-react';

interface BlacklistRecord {
  id: string;
  phone: string;
  name: string;
  reason: string;
  blockedAt: string;
  blockedBy: string;
  status: 'BLOCKED' | 'UNBLOCKED';
}

const initialBlacklist: BlacklistRecord[] = [
  { id: 'BLK-101', phone: '+91 9988223344', name: 'Venkatesh Rao', reason: 'Attempted physical forced tampering on terminal locker door at Mall-BLR-02', blockedAt: '12 Aug 2024, 11:15', blockedBy: 'Parash R (SuperAdmin)', status: 'BLOCKED' },
  { id: 'BLK-102', phone: '+91 9811002233', name: 'Unknown / Anonymous', reason: 'Repeated fraudulent UPI chargeback claims without locker deposit', blockedAt: '05 Aug 2024, 16:40', blockedBy: 'Rohit V (Operations)', status: 'BLOCKED' },
  { id: 'BLK-103', phone: '+91 9744118822', name: 'Karan Malhotra', reason: 'Excess storage past 7 days without clearing penalty balance', blockedAt: '28 Jul 2024, 09:20', blockedBy: 'Parash R (SuperAdmin)', status: 'UNBLOCKED' },
];

export const BlacklistHistory: React.FC = () => {
  const [records, setRecords] = useState<BlacklistRecord[]>(initialBlacklist);
  const [search, setSearch] = useState('');

  const unblockUser = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'UNBLOCKED' } : r));
  };

  const filtered = records.filter(r => !search || r.phone.includes(search) || r.name.toLowerCase().includes(search.toLowerCase()) || r.reason.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <ShieldBan className="h-5 w-5 text-red-500" /> Security Blacklist & Incident Log
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Registry of blacklisted phone numbers, physical tampering incidents, and unblock actions</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search blacklist by phone number, customer name, or reason..."
          className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
        />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                <th className="py-3 px-4">INCIDENT ID</th>
                <th className="py-3 px-4">PHONE NUMBER</th>
                <th className="py-3 px-4">CUSTOMER NAME</th>
                <th className="py-3 px-4">REASON FOR BLACKLIST</th>
                <th className="py-3 px-4">BLOCKED AT</th>
                <th className="py-3 px-4">AUTHORIZED BY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900 text-xs">{r.id}</td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-700 text-xs">{r.phone}</td>
                  <td className="py-3 px-4 font-semibold text-zinc-900 text-sm">{r.name}</td>
                  <td className="py-3 px-4 text-zinc-700 text-xs max-w-[280px]">{r.reason}</td>
                  <td className="py-3 px-4 text-zinc-500 font-mono text-xs">{r.blockedAt}</td>
                  <td className="py-3 px-4 text-zinc-800 font-medium text-xs">{r.blockedBy}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${r.status === 'BLOCKED' ? 'bg-rose-50 text-rose-700 border border-rose-200/70' : 'bg-zinc-100 text-zinc-700'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {r.status === 'BLOCKED' && (
                      <button
                        type="button"
                        onClick={() => unblockUser(r.id)}
                        className="text-xs font-bold text-primary-700 hover:text-primary-900 flex items-center gap-1.5 ml-auto"
                      >
                        <RotateCcw className="size-3.5" /> <span>Unblock</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
