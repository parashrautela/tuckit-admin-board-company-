import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Key, Save, CheckCircle2, Monitor } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setToast('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" /> Admin Profile & Credentials
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Manage superadmin identity, active session security, and account preferences</p>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Shield className="h-4 w-4 text-primary" /> Superadmin Identity
          </h2>

          <div className="flex items-center gap-3 pt-2">
            <div className="h-14 w-14 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-primary font-black text-xl">
              {user?.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-black text-zinc-900">{user?.name}</div>
              <div className="text-xs text-primary font-mono font-bold">@{user?.username}</div>
              <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-900 text-white text-[10px] font-bold rounded-md">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-3 text-xs">
            <div className="flex justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Email:</span>
              <span className="font-mono text-zinc-800">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Active Session:</span>
              <span className="font-mono text-emerald-600 font-bold">Live Authenticated</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Hardware Access:</span>
              <span className="font-bold text-zinc-800">All 238 Terminals</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Key className="h-4 w-4 text-primary" /> Update Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full h-9 mt-2 bg-primary hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save New Credentials
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
