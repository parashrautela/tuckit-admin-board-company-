import React, { useState } from 'react';
import { UserCheck, Search, Plus, Shield, Mail, Phone } from 'lucide-react';

const initialManagers = [
  { id: 'MGR-001', name: 'Prof. Ramesh K', campus: 'PESIT Ring Road Campus', phone: '+91 9845012345', email: 'ramesh.k@pes.edu', role: 'Chief Warden & Lab In-charge', activeTerminals: 6, status: 'ACTIVE' },
  { id: 'MGR-002', name: 'Dr. Savitha Murthy', campus: 'PESIT Electronic City Campus', phone: '+91 9845098765', email: 'savitha.m@pes.edu', role: 'Hostel Supervisor', activeTerminals: 4, status: 'ACTIVE' },
  { id: 'MGR-003', name: 'Anand Prakash', campus: 'PES University Hanumanth Nagar', phone: '+91 9880011223', email: 'anand.p@pes.edu', role: 'Facility Officer', activeTerminals: 2, status: 'ACTIVE' },
];

export const PESITManagers: React.FC = () => {
  const [managers, setManagers] = useState(initialManagers);
  const [search, setSearch] = useState('');

  const filtered = managers.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.campus.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" /> PESIT Locker Managers
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Campus coordinators and hostel administrators with locker terminal rights</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFE5C6] hover:bg-[#FFD7A8] text-neutral-900 border border-[#FFC898]/70 text-xs font-semibold rounded-lg shadow-xs transition-colors">
          <Plus className="h-4 w-4" /> Add Campus Manager
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search managers or campus..."
          className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black font-mono text-zinc-400 uppercase">{m.id}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700">{m.status}</span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-zinc-900">{m.name}</h3>
              <p className="text-xs text-primary font-medium">{m.role}</p>
              <p className="text-xs text-zinc-500 mt-1">{m.campus}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-zinc-400" /> <span>{m.phone}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-zinc-400" /> <span className="truncate">{m.email}</span></div>
              <div className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-zinc-400" /> <span>{m.activeTerminals} Assigned Terminals</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
