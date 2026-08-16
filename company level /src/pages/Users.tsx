import React, { useState } from 'react';
import { User, Search, ShieldBan, ShieldCheck, Phone, Mail, Calendar, ArrowUpRight } from 'lucide-react';
import { BlacklistUserModal } from '../components/modals/BlacklistUserModal';

interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lastActive: string;
  status: 'ACTIVE' | 'BLACKLISTED';
  joinedDate: string;
}

const initialUsers: CustomerUser[] = [
  { id: 'USR-10921', name: 'Rahul Sharma', phone: '+91 9845011223', email: 'rahul.s@gmail.com', totalBookings: 18, totalSpent: 2840, lastActive: '16 Aug 2024, 19:40', status: 'ACTIVE', joinedDate: '12 Jan 2023' },
  { id: 'USR-10922', name: 'Pooja Nair', phone: '+91 9711889900', email: 'pooja.nair@yahoo.com', totalBookings: 32, totalSpent: 5120, lastActive: '16 Aug 2024, 18:22', status: 'ACTIVE', joinedDate: '04 Mar 2023' },
  { id: 'USR-10923', name: 'Venkatesh Rao', phone: '+91 9988223344', email: 'v.rao@outlook.com', totalBookings: 4, totalSpent: 640, lastActive: '12 Aug 2024, 11:15', status: 'BLACKLISTED', joinedDate: '18 Jun 2023' },
  { id: 'USR-10924', name: 'Ananya Roy', phone: '+91 9123456780', email: 'ananya.roy@gmail.com', totalBookings: 12, totalSpent: 1980, lastActive: '15 Aug 2024, 21:05', status: 'ACTIVE', joinedDate: '09 Sep 2023' },
  { id: 'USR-10925', name: 'Siddharth Jain', phone: '+91 9880123456', email: 'sid.jain@gmail.com', totalBookings: 24, totalSpent: 4100, lastActive: '16 Aug 2024, 15:30', status: 'ACTIVE', joinedDate: '22 Nov 2023' },
];

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<CustomerUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [blacklistModalUser, setBlacklistModalUser] = useState<string | null>(null);

  const toggleBlacklist = (user: CustomerUser) => {
    if (user.status === 'ACTIVE') {
      setBlacklistModalUser(user.phone);
    } else {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'ACTIVE' } : u));
    }
  };

  const handleBlacklistSuccess = () => {
    if (blacklistModalUser) {
      setUsers(prev => prev.map(u => u.phone === blacklistModalUser ? { ...u, status: 'BLACKLISTED' } : u));
      setBlacklistModalUser(null);
    }
  };

  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Customer Directory & User Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Search consumer accounts, inspect lifetime usage history, and handle security flags</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search user by name, phone, or email..."
          className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
        />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">USER ID</th>
                <th className="py-3 px-4">CUSTOMER NAME</th>
                <th className="py-3 px-4">CONTACT INFO</th>
                <th className="py-3 px-4">TOTAL BOOKINGS</th>
                <th className="py-3 px-4">LIFETIME SPENT</th>
                <th className="py-3 px-4">LAST ACTIVE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">SECURITY ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">{u.id}</td>
                  <td className="py-3 px-4 font-bold text-zinc-800">{u.name}</td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-zinc-700">{u.phone}</div>
                    <div className="text-[11px] text-zinc-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-zinc-900">{u.totalBookings}</td>
                  <td className="py-3 px-4 font-black text-primary">₹{u.totalSpent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">{u.lastActive}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleBlacklist(u)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Blacklist User' : 'Remove Flag'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BlacklistUserModal
        isOpen={!!blacklistModalUser}
        onClose={() => setBlacklistModalUser(null)}
        initialPhone={blacklistModalUser || undefined}
        onSuccess={handleBlacklistSuccess}
      />
    </div>
  );
};
