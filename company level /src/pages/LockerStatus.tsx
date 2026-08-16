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
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
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
  const { terminals, showToast, addAuditLog } = useRealtime();
  const [search, setSearch] = useState('');
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [selectedLocker, setSelectedLocker] = useState<SelectedLockerInfo | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPasscodeInDrawer, setShowPasscodeInDrawer] = useState(false);
  const [forceUnlockDoor, setForceUnlockDoor] = useState<{ terminalCode: string; lockName: string } | null>(null);

  // Pagination for fleet scale
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const sizes = ['SMALL', 'MEDIUM', 'LARGE', 'XL', '2 PHONE', '4 PHONE', '8 PHONE'] as const;

  const uniqueStates = useMemo(() => [...new Set(terminals.map(t => t.state))].sort(), [terminals]);

  const filteredTerminals = useMemo(() => {
    return terminals.filter(t => {
      if (stateFilter !== 'ALL' && t.state !== stateFilter) return false;
      if (search && !t.code.toLowerCase().includes(search.toLowerCase()) && !t.siteName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [terminals, search, stateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTerminals.length / itemsPerPage));
  const paginatedTerminals = filteredTerminals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const lockerData = useMemo(() => {
    return paginatedTerminals.map(t => {
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
  }, [paginatedTerminals]);

  const handleLockerClick = (terminal: any, locker: any) => {
    setShowPasscodeInDrawer(false);
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

  const handleToggleDrawerPasscode = () => {
    const next = !showPasscodeInDrawer;
    setShowPasscodeInDrawer(next);
    if (next && selectedLocker) {
      addAuditLog('PII_REVEAL', 'LOCKER_PASSCODE', `${selectedLocker.terminalCode}/${selectedLocker.doorNumber}`, 'Revealed door passcode in locker inspector drawer', 'WARNING');
      showToast('Passcode revealed — Logged in audit trail', 'warning');
    }
  };

  const handleVacate = () => {
    if (!selectedLocker) return;
    addAuditLog('LOCKER_VACATE_MANUAL', 'LOCKER', `${selectedLocker.terminalCode}/${selectedLocker.doorNumber}`, 'Manually vacated and released locker reservation');
    showToast(`Locker ${selectedLocker.doorNumber} at ${selectedLocker.terminalCode} vacated & released`, 'success');
    setSelectedLocker(prev => prev ? { ...prev, status: 'AVAILABLE', occupantName: undefined, occupantPhone: undefined, passcode: undefined } : null);
  };

  const handleToggleMaintenance = () => {
    if (!selectedLocker) return;
    const nextStatus = selectedLocker.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    addAuditLog('LOCKER_MAINTENANCE_TOGGLE', 'LOCKER', `${selectedLocker.terminalCode}/${selectedLocker.doorNumber}`, `Set status to ${nextStatus}`);
    setSelectedLocker(prev => prev ? { ...prev, status: nextStatus } : null);
    showToast(`Locker ${selectedLocker.doorNumber} updated to ${nextStatus}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Interactive Locker Status Grid</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Physical matrix of every hardware locker door across all {terminals.length} live IoT kiosks nationwide
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-zinc-50 px-3.5 py-2 rounded-lg border border-zinc-200 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span className="text-zinc-600">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100" />
            <span className="text-zinc-600">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
            <span className="text-zinc-600">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by terminal code or site..."
              className="w-full pl-9 pr-4 h-9 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={stateFilter}
              onChange={e => {
                setStateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-zinc-900 outline-none transition-colors"
            >
              <option value="ALL">All States ({uniqueStates.length})</option>
              {uniqueStates.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <select
              value={sizeFilter}
              onChange={e => setSizeFilter(e.target.value)}
              className="h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-zinc-900 outline-none transition-colors"
            >
              <option value="ALL">All Door Sizes</option>
              {sizes.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination Navigator */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>
            Showing <strong>{filteredTerminals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong>–
            <strong>{Math.min(filteredTerminals.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong>{filteredTerminals.length}</strong> terminals
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono font-bold text-zinc-800">
              {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Kiosks Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {lockerData.map(({ terminal, lockers }) => (
          <div
            key={terminal.id}
            className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-4 space-y-3.5 hover:border-zinc-300 transition-all"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-zinc-900 text-xs">{terminal.code}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">({terminal.city})</span>
                </div>
                <div className="text-xs font-semibold text-zinc-700 truncate max-w-[200px]">{terminal.siteName}</div>
              </div>
              <StatusBadge status={terminal.connectivityStatus} pulse={terminal.connectivityStatus === 'ONLINE'} />
            </div>

            {/* Visual Doors Grid */}
            <div className="grid grid-cols-6 gap-1.5">
              {lockers
                .filter(l => sizeFilter === 'ALL' || l.size === sizeFilter)
                .map(l => (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => handleLockerClick(terminal, l)}
                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                      l.status === 'AVAILABLE'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        : l.status === 'OCCUPIED'
                        ? 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
                        : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                    }`}
                    title={`${l.name} (${l.size}) — ${l.status}`}
                  >
                    <div className="text-[11px] font-bold font-mono leading-none">
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
            <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">DOOR STATUS</span>
                <span className="text-sm font-bold text-zinc-900">{selectedLocker.status}</span>
              </div>
              <StatusBadge status={selectedLocker.status} />
            </div>

            {/* Hardware Specs */}
            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Locker Size:</span>
                <span className="font-bold text-zinc-900">{selectedLocker.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Terminal Code:</span>
                <span className="font-mono font-bold text-zinc-900">{selectedLocker.terminalCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Lock Relay Channel:</span>
                <span className="font-mono text-zinc-700">CH-{selectedLocker.doorNumber.replace('LKR-', '')}</span>
              </div>
            </div>

            {/* Occupant Details if Occupied */}
            {selectedLocker.status === 'OCCUPIED' && (
              <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-200 space-y-2.5 text-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 uppercase tracking-wider">
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
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Door Passcode:</span>
                    <button
                      type="button"
                      onClick={handleToggleDrawerPasscode}
                      className="text-[10px] text-primary font-bold hover:underline flex items-center gap-0.5"
                    >
                      {showPasscodeInDrawer ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {showPasscodeInDrawer ? 'Mask' : 'Reveal'}
                    </button>
                  </div>
                  <span className="font-mono font-bold text-primary bg-white px-2 py-0.5 rounded-md border border-orange-200">
                    {showPasscodeInDrawer ? selectedLocker.passcode : '••••'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Accrued Amount:</span>
                  <span className="font-bold text-zinc-900">₹{selectedLocker.amount}</span>
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
                className="w-full h-10 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2"
              >
                <Unlock className="h-4 w-4 text-primary" />
                <span>Emergency Force Open Door</span>
              </button>

              {selectedLocker.status === 'OCCUPIED' && (
                <button
                  type="button"
                  onClick={handleVacate}
                  className="w-full h-10 border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Release / Vacate Locker</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleToggleMaintenance}
                className="w-full h-10 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
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
