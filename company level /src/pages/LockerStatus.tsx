import React, { useState, useMemo } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Drawer } from '../components/common/Drawer';
import { ForceUnlockModal } from '../components/control-center/ForceUnlockModal';
import {
  Grid,
  Search,
  Lock,
  Unlock,
  KeyRound,
  User,
  Phone,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface SelectedLockerInfo {
  terminalCode: string;
  terminalSite: string;
  doorNumber: string;
  size: string;
  status: string;
  occupantName?: string;
  occupantPhone?: string;
  startTime?: string;
  passcode?: string;
  amount?: number;
}

export const LockerStatus: React.FC = () => {
  const { terminals, showToast } = useRealtime();
  const [search, setSearch] = useState('');
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [selectedLocker, setSelectedLocker] = useState<SelectedLockerInfo | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [forceUnlockDoor, setForceUnlockDoor] = useState<{ terminalCode: string; lockName: string } | null>(null);

  const sizes = ['SMALL', 'MEDIUM', 'LARGE', 'XL', '2 PHONE', '4 PHONE', '8 PHONE'] as const;

  const uniqueStates = useMemo(() => [...new Set(terminals.map(t => t.state))].sort(), [terminals]);

  const lockerData = useMemo(() => {
    return terminals
      .filter(t => {
        if (stateFilter !== 'ALL' && t.state !== stateFilter) return false;
        if (search && !t.code.toLowerCase().includes(search.toLowerCase()) && !t.siteName.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        return true;
      })
      .slice(0, 24)
      .map(t => {
        const lockers = Array.from({ length: t.totalLockers }, (_, i) => {
          const idx = i + 1;
          const name = `LKR-${String(idx).padStart(2, '0')}`;
          const size = t.lockerType === 'MOBILE' ? sizes[4 + (i % 3)] : sizes[i % 4];
          const isOccupied = i < t.occupiedLockers;
          const status = isOccupied ? 'OCCUPIED' : (i === t.totalLockers - 1 && t.connectivityStatus === 'OFFLINE' ? 'MAINTENANCE' : 'AVAILABLE');

          const occupantName = isOccupied ? ['Aarav Sharma', 'Pooja Iyer', 'Rahul Verma', 'Sneha Nair', 'Karthik Rao'][i % 5] : undefined;
          const occupantPhone = isOccupied ? `+91 ${9845000000 + i * 1111}` : undefined;
          const startTime = isOccupied ? `${Math.floor(i % 12) + 1} hours ago` : undefined;
          const passcode = isOccupied ? `${1000 + ((i * 357) % 9000)}` : undefined;
          const amount = isOccupied ? (size === 'SMALL' ? 50 : size === 'MEDIUM' ? 80 : 120) : undefined;

          return { name, size, status, occupantName, occupantPhone, startTime, passcode, amount };
        });
        return { terminal: t, lockers };
      });
  }, [terminals, search, stateFilter]);

  const handleLockerClick = (terminal: any, locker: any) => {
    setSelectedLocker({
      terminalCode: terminal.code,
      terminalSite: terminal.siteName,
      doorNumber: locker.name,
      size: locker.size,
      status: locker.status,
      occupantName: locker.occupantName,
      occupantPhone: locker.occupantPhone,
      startTime: locker.startTime,
      passcode: locker.passcode,
      amount: locker.amount,
    });
    setIsDrawerOpen(true);
  };

  const handleVacate = () => {
    if (!selectedLocker) return;
    showToast(`Locker ${selectedLocker.doorNumber} at ${selectedLocker.terminalCode} vacated & released`, 'success');
    setSelectedLocker(prev => prev ? { ...prev, status: 'AVAILABLE', occupantName: undefined, occupantPhone: undefined, passcode: undefined } : null);
  };

  const handleToggleMaintenance = () => {
    if (!selectedLocker) return;
    const nextStatus = selectedLocker.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    setSelectedLocker(prev => prev ? { ...prev, status: nextStatus } : null);
    showToast(`Locker ${selectedLocker.doorNumber} set to ${nextStatus}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <Grid className="h-5 w-5 text-primary" /> Physical Locker Status Matrix
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time visual map of individual physical locker doors across nationwide kiosks
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search terminal code or site name..."
              className="w-full pl-10 pr-4 h-9 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-primary"
            />
          </div>

          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700"
          >
            <option value="ALL">All States</option>
            {uniqueStates.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={sizeFilter}
            onChange={e => setSizeFilter(e.target.value)}
            className="h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700"
          >
            <option value="ALL">All Locker Sizes</option>
            {sizes.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-500 pt-2 border-t border-zinc-100">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-emerald-500" /> Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-red-500" /> Occupied
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-amber-500" /> Maintenance
          </span>
          <span className="text-[11px] text-zinc-400 ml-auto">
            Click any locker box to inspect details and controls
          </span>
        </div>
      </div>

      {/* Visual Terminal Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lockerData.map(({ terminal: t, lockers }) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-black font-mono text-zinc-900">{t.code}</span>
                <span className="text-xs text-zinc-600 font-medium ml-2">{t.siteName}</span>
                <div className="text-[11px] text-zinc-400">{t.city}, {t.state}</div>
              </div>
              <StatusBadge status={t.connectivityStatus} pulse={t.connectivityStatus === 'ONLINE'} />
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 pt-2 border-t border-zinc-100">
              {lockers
                .filter(l => sizeFilter === 'ALL' || l.size === sizeFilter)
                .map(l => (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => handleLockerClick(t, l)}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer hover:scale-105 select-none ${
                      l.status === 'AVAILABLE'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        : l.status === 'OCCUPIED'
                        ? 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
                        : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                    }`}
                    title={`${l.name} (${l.size}) — ${l.status}`}
                  >
                    <div className="text-[11px] font-black font-mono leading-none">
                      {l.name.replace('LKR-', '')}
                    </div>
                    <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter mt-1 truncate">
                      {l.size}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Locker Details Slide-Over Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Locker Door ${selectedLocker?.doorNumber}`}
        subtitle={`Terminal: ${selectedLocker?.terminalCode} (${selectedLocker?.terminalSite})`}
      >
        {selectedLocker && (
          <div className="space-y-5">
            {/* Status Pill */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200">
              <div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">DOOR STATUS</span>
                <span className="text-sm font-black text-zinc-900">{selectedLocker.status}</span>
              </div>
              <StatusBadge status={selectedLocker.status} />
            </div>

            {/* Hardware Specs */}
            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Locker Size:</span>
                <span className="font-bold text-zinc-900">{selectedLocker.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Terminal Code:</span>
                <span className="font-mono font-bold text-primary">{selectedLocker.terminalCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Lock Relay Channel:</span>
                <span className="font-mono text-zinc-700">CH-{selectedLocker.doorNumber.replace('LKR-', '')}</span>
              </div>
            </div>

            {/* Occupant Details if Occupied */}
            {selectedLocker.status === 'OCCUPIED' && (
              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-2.5 text-xs">
                <div className="flex items-center gap-1.5 text-xs font-black text-orange-900 uppercase tracking-wider">
                  <User className="h-3.5 w-3.5 text-primary" /> Active Customer Occupant
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-500">Name:</span>
                  <span className="font-bold text-zinc-900">{selectedLocker.occupantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Mobile:</span>
                  <span className="font-mono font-bold text-zinc-900">{selectedLocker.occupantPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Check-in Duration:</span>
                  <span className="font-bold text-emerald-700">{selectedLocker.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Door Passcode:</span>
                  <span className="font-mono font-black text-primary bg-white px-2 py-0.5 rounded-md border border-orange-200">
                    {selectedLocker.passcode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Accrued Amount:</span>
                  <span className="font-black text-zinc-900">₹{selectedLocker.amount}</span>
                </div>
              </div>
            )}

            {/* Operational Actions */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  setForceUnlockDoor({
                    terminalCode: selectedLocker.terminalCode,
                    lockName: selectedLocker.doorNumber,
                  });
                }}
                className="w-full h-11 bg-primary hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Unlock className="h-4 w-4" />
                <span>Emergency Force Open Door</span>
              </button>

              {selectedLocker.status === 'OCCUPIED' && (
                <button
                  type="button"
                  onClick={handleVacate}
                  className="w-full h-10 border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Release / Vacate Locker</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleToggleMaintenance}
                className="w-full h-10 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Wrench className="h-4 w-4 text-amber-600" />
                <span>{selectedLocker.status === 'MAINTENANCE' ? 'Clear Maintenance Mode' : 'Set to Maintenance Mode'}</span>
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Force Unlock Modal */}
      {forceUnlockDoor && (
        <ForceUnlockModal
          isOpen={!!forceUnlockDoor}
          onClose={() => setForceUnlockDoor(null)}
          terminalCode={forceUnlockDoor.terminalCode}
          lockName={forceUnlockDoor.lockName}
        />
      )}
    </div>
  );
};
