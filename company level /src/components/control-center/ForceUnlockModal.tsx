import React, { useState, useEffect, useMemo } from 'react';
import { DestructiveActionModal } from '../common/DestructiveActionModal';
import { SearchableSelect, SelectOption } from '../common/SearchableSelect';
import { useRealtime } from '../../context/RealtimeContext';

interface ForceUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTerminalCode?: string;
  defaultLockerName?: string;
  terminalCode?: string;
  lockName?: string;
}

export const ForceUnlockModal: React.FC<ForceUnlockModalProps> = ({
  isOpen,
  onClose,
  defaultTerminalCode = 'HKBKCBELB',
  defaultLockerName = 'LKR-A01',
  terminalCode: initialCode,
  lockName: initialLock,
}) => {
  const { terminals, forceUnlockLocker } = useRealtime();
  const [terminalCode, setTerminalCode] = useState(initialCode || defaultTerminalCode);
  const [lockerName, setLockerName] = useState(initialLock || defaultLockerName);

  useEffect(() => {
    if (initialCode) setTerminalCode(initialCode);
    if (initialLock) setLockerName(initialLock);
  }, [initialCode, initialLock, isOpen]);

  const terminalOptions: SelectOption[] = useMemo(() => {
    return terminals.map(t => ({
      value: t.code,
      label: t.siteName,
      sublabel: `${t.city}, ${t.state}`,
      badge: `${t.totalLockers} Lockers`,
    }));
  }, [terminals]);

  const handleConfirm = async (reason: string) => {
    await forceUnlockLocker(terminalCode, lockerName, reason);
  };

  return (
    <DestructiveActionModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Emergency Force Unlock Locker"
      subtitle={`Send instant solenoid unlatch pulse to ${lockerName} on ${terminalCode}`}
      actionLabel="Trigger Force Unlock"
      severity="single"
      reasonPlaceholder="State verified customer ticket or maintenance reason..."
      checkboxLabel="I confirm that customer verification or maintenance inspection protocol is fulfilled."
      auditWarning="Action will be permanently recorded in the system audit trail with operator timestamp, IP address, and role."
    >
      <div className="space-y-3">
        {/* Searchable Combobox for Terminals (No artificial cap) */}
        <SearchableSelect
          label="Select Terminal"
          required
          options={terminalOptions}
          value={terminalCode}
          onChange={setTerminalCode}
          placeholder="Search and select terminal..."
          searchPlaceholder="Filter by terminal code, site, or city..."
        />

        <div>
          <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Locker Name / Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={lockerName}
            onChange={e => setLockerName(e.target.value)}
            placeholder="e.g. LKR-A04"
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold font-mono text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-colors"
            required
          />
        </div>
      </div>
    </DestructiveActionModal>
  );
};
