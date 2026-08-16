import React, { useState } from 'react';
import { Users, Search, GraduationCap, Phone, Mail, Clock } from 'lucide-react';

const students = Array.from({ length: 24 }, (_, i) => ({
  id: `STU-${2024100 + i}`,
  name: ['Arun Kumar', 'Priya Sharma', 'Rohit Verma', 'Sneha Patel', 'Karthik R', 'Meera J', 'Vikram S', 'Anjali D', 'Rahul M', 'Deepa K', 'Suresh B', 'Kavitha L'][i % 12],
  usn: `1PI${20 + Math.floor(i / 8)}CS${100 + i}`,
  phone: `+91 ${9800000000 + Math.floor(Math.random() * 100000000)}`,
  email: `student${i + 1}@pes.edu`,
  totalBookings: Math.floor(Math.random() * 45) + 5,
  lastUsed: `${Math.floor(Math.random() * 28) + 1} Aug 2024`,
  status: i % 7 === 0 ? 'BLOCKED' : 'ACTIVE',
}));

export const PESITStudents: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = students.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.usn.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> PESIT Students</h1>
        <p className="text-xs text-zinc-500 mt-1">Student registrations, usage history, and access management</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or USN..." className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary" />
      </div>
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-3">USN</th>
                <th className="py-3 px-3">NAME</th>
                <th className="py-3 px-3">PHONE</th>
                <th className="py-3 px-3">EMAIL</th>
                <th className="py-3 px-3">BOOKINGS</th>
                <th className="py-3 px-3">LAST USED</th>
                <th className="py-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">{s.usn}</td>
                  <td className="py-2.5 px-3 font-semibold text-zinc-800">{s.name}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-600">{s.phone}</td>
                  <td className="py-2.5 px-3 text-zinc-600">{s.email}</td>
                  <td className="py-2.5 px-3 font-bold text-zinc-900">{s.totalBookings}</td>
                  <td className="py-2.5 px-3 text-zinc-500">{s.lastUsed}</td>
                  <td className="py-2.5 px-3"><span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${s.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
