import React, { useState, useMemo } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Grid, Search } from 'lucide-react';

export const LockerStatus: React.FC = () => {
  const { terminals } = useRealtime();
  const [search, setSearch] = useState('');
  const [sizeFilter, setSizeFilter] = useState('ALL');

  const sizes = ['SMALL', 'MEDIUM', 'LARGE', 'XL', '2 PHONE', '4 PHONE', '8 PHONE'] as const;
  const statuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'BLOCKED'] as const;

  const lockerData = useMemo(() => {
    return terminals.filter(t => !search || t.code.toLowerCase().includes(search.toLowerCase()) || t.siteName.toLowerCase().includes(search.toLowerCase())).slice(0, 30).map(t => {
      const lockers = Array.from({ length: t.totalLockers }, (_, i) => {
        const idx = i + 1;
        const name = `LKR-${String.fromCharCode(65 + Math.floor(i / 8))}${String(idx % 8 || 8).padStart(2, '0')}`;
        const size = t.lockerType === 'MOBILE' ? sizes[4 + (i % 3)] : sizes[i % 4];
        const status = i < t.occupiedLockers ? 'OCCUPIED' : (i === t.totalLockers - 1 && t.connectivityStatus === 'OFFLINE' ? 'MAINTENANCE' : 'AVAILABLE');
        return { name, size, status };
      });
      return { terminal: t, lockers };
    });
  }, [terminals, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2"><Grid className="h-5 w-5 text-primary" /> Locker Status</h1>
        <p className="text-xs text-zinc-500 mt-1">Visual locker grid per terminal with real-time occupancy status</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search terminal code or site..." className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary" />
        </div>
        <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)} className="h-10 px-3 bg-white border border-zinc-200 rounded-xl text-xs font-semibold">
          <option value="ALL">All Sizes</option>
          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {lockerData.slice(0, 12).map(({ terminal: t, lockers }) => (
        <div key={t.id} className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-black font-mono text-zinc-900">{t.code}</span>
              <span className="text-xs text-zinc-500 ml-2">{t.siteName}</span>
            </div>
            <StatusBadge status={t.connectivityStatus} pulse={t.connectivityStatus === 'ONLINE'} />
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5">
            {lockers.filter(l => sizeFilter === 'ALL' || l.size === sizeFilter).map(l => (
              <div key={l.name} className={`p-1.5 rounded-lg text-center text-[10px] font-bold border transition-all cursor-default ${l.status === 'AVAILABLE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : l.status === 'OCCUPIED' ? 'bg-red-50 border-red-200 text-red-700' : l.status === 'MAINTENANCE' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-zinc-100 border-zinc-300 text-zinc-500'}`} title={`${l.name} (${l.size}) — ${l.status}`}>
                {l.name.split('-').pop()}
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-[10px] font-semibold text-zinc-500">
            <span><span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-1" />Available</span>
            <span><span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1" />Occupied</span>
            <span><span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-1" />Maintenance</span>
          </div>
        </div>
      ))}
    </div>
  );
};
