import React, { useState } from 'react';
import { Shield, Plus, Search, Mail, Phone, Lock, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/common/Modal';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'OPERATIONS' | 'SUPPORT_AGENT' | 'FINANCE';
  lastLogin: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

const initialAdmins: AdminUser[] = [
  { id: 'ADM-01', username: 'parash', name: 'Parash Rautela', email: 'parash@tuckit.in', role: 'SUPERADMIN', lastLogin: 'Just now', status: 'ACTIVE' },
  { id: 'ADM-02', username: 'rohit_ops', name: 'Rohit Verma', email: 'rohit.v@tuckit.in', role: 'OPERATIONS', lastLogin: '16 Aug 2024, 17:30', status: 'ACTIVE' },
  { id: 'ADM-03', username: 'sneha_sup', name: 'Sneha Patel', email: 'sneha.p@tuckit.in', role: 'SUPPORT_AGENT', lastLogin: '16 Aug 2024, 18:45', status: 'ACTIVE' },
  { id: 'ADM-04', username: 'kavita_fin', name: 'Kavita Iyer', email: 'kavita.i@tuckit.in', role: 'FINANCE', lastLogin: '15 Aug 2024, 11:20', status: 'ACTIVE' },
];

export const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', name: '', email: '', role: 'OPERATIONS', password: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.username || !newAdmin.email) return;
    const added: AdminUser = {
      id: `ADM-${String(admins.length + 1).padStart(2, '0')}`,
      username: newAdmin.username,
      name: newAdmin.name || newAdmin.username,
      email: newAdmin.email,
      role: newAdmin.role as any,
      lastLogin: 'Never',
      status: 'ACTIVE',
    };
    setAdmins(prev => [added, ...prev]);
    setCreateModal(false);
    setNewAdmin({ username: '', name: '', email: '', role: 'OPERATIONS', password: '' });
  };

  const filtered = admins.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.username.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Internal Admin Accounts
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Manage system administrators, role assignments, and dashboard access credentials</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create New Admin
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search admin name, username or email..."
          className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
        />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">ADMIN ID</th>
                <th className="py-3 px-4">USERNAME / NAME</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4">LAST LOGIN</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">{a.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-zinc-900">{a.name}</div>
                    <div className="text-[11px] text-primary font-mono font-semibold">@{a.username}</div>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 font-mono">{a.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 bg-zinc-900 text-white rounded-md font-mono text-[10px] font-bold">
                      {a.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">{a.lastLogin}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button type="button" className="text-zinc-400 hover:text-zinc-700 p-1">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Provision New Admin Account" maxWidth="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Username *</label>
            <input
              type="text"
              required
              value={newAdmin.username}
              onChange={e => setNewAdmin(p => ({ ...p, username: e.target.value }))}
              placeholder="e.g. anand_ops"
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Full Name</label>
            <input
              type="text"
              value={newAdmin.name}
              onChange={e => setNewAdmin(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Anand Sharma"
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={newAdmin.email}
              onChange={e => setNewAdmin(p => ({ ...p, email: e.target.value }))}
              placeholder="e.g. anand.s@tuckit.in"
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Role Permission Preset</label>
            <select
              value={newAdmin.role}
              onChange={e => setNewAdmin(p => ({ ...p, role: e.target.value }))}
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold"
            >
              <option value="OPERATIONS">OPERATIONS</option>
              <option value="SUPPORT_AGENT">SUPPORT_AGENT</option>
              <option value="FINANCE">FINANCE</option>
              <option value="SUPERADMIN">SUPERADMIN</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Temporary Password *</label>
            <input
              type="password"
              required
              value={newAdmin.password}
              onChange={e => setNewAdmin(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="px-3.5 py-2 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
