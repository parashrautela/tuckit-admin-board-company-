import React, { useState } from 'react';
import { Users, Search, Plus, Building, Phone, Mail, IndianRupee, ShieldCheck } from 'lucide-react';

interface StaffProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  assignedRegion: string;
  cashInHand: number;
  collectionLimit: number;
  bankAccount: string;
  ifsc: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED';
}

const initialStaff: StaffProfile[] = [
  { id: 'STF-01', name: 'Ramesh Verma', phone: '+91 9845012301', email: 'ramesh.v@tuckit.in', role: 'Cash Collector', assignedRegion: 'Bengaluru Central', cashInHand: 14200, collectionLimit: 50000, bankAccount: '•••• •••• 8812', ifsc: 'HDFC000124', status: 'ACTIVE' },
  { id: 'STF-02', name: 'Vikas Dubey', phone: '+91 9711002233', email: 'vikas.d@tuckit.in', role: 'Field Operations', assignedRegion: 'Delhi Metro', cashInHand: 8400, collectionLimit: 40000, bankAccount: '•••• •••• 4521', ifsc: 'SBIN000892', status: 'ACTIVE' },
  { id: 'STF-03', name: 'Pooja Hegde', phone: '+91 9988445566', email: 'pooja.h@tuckit.in', role: 'Cash Collector', assignedRegion: 'Mumbai Airport', cashInHand: 26500, collectionLimit: 75000, bankAccount: '•••• •••• 9901', ifsc: 'ICIC000045', status: 'ACTIVE' },
  { id: 'STF-04', name: 'Karthik Raja', phone: '+91 9448001122', email: 'karthik.r@tuckit.in', role: 'Field Operations', assignedRegion: 'Chennai Metro', cashInHand: 3100, collectionLimit: 30000, bankAccount: '•••• •••• 1133', ifsc: 'KKBK000192', status: 'ACTIVE' },
  { id: 'STF-05', name: 'Sunil Mehta', phone: '+91 9123884400', email: 'sunil.m@tuckit.in', role: 'Cash Collector', assignedRegion: 'Hyderabad HiTech', cashInHand: 0, collectionLimit: 50000, bankAccount: '•••• •••• 6672', ifsc: 'AXIS000981', status: 'ON_LEAVE' },
];

export const StaffProfiles: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffProfile[]>(initialStaff);
  const [search, setSearch] = useState('');

  const filtered = staffList.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.assignedRegion.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-zinc-700" /> Staff Profiles & Cash Collector Bank
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Field operations profiles, cash custody balances, banking info, and settlement thresholds</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search staff by name or region..."
          className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-zinc-500 uppercase">{s.id}</span>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${s.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'}`}>
                {s.status}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-base font-bold text-zinc-900">{s.name}</h3>
              <p className="text-sm text-zinc-700 font-semibold mt-0.5">{s.role}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.assignedRegion}</p>
            </div>

            <div className="mt-4 p-3.5 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-600 font-medium">Cash in Hand:</span>
                <span className="font-bold text-zinc-900 text-sm">₹{s.cashInHand.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 font-medium">Max Limit:</span>
                <span className="font-semibold text-zinc-800">₹{s.collectionLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-zinc-200/60">
                <span className="text-zinc-600 font-medium">Bank / IFSC:</span>
                <span className="font-mono text-zinc-800 text-xs font-medium">{s.bankAccount} ({s.ifsc})</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-medium">
              <span>{s.phone}</span>
              <span className="truncate max-w-[140px]">{s.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
