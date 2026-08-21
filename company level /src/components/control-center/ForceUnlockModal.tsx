import React, { useState, useEffect, useMemo } from 'react';
import { DestructiveActionModal } from '../common/DestructiveActionModal';
import { SearchableSelect, SelectOption } from '../common/SearchableSelect';
import { useRealtime } from '../../context/RealtimeContext';
import { Input } from '@/components/ui/input';

interface ForceUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTerminalCode?: string;
  defaultLockerName?: string;
  terminalCode?: string;
  lockName?: string;
  initialCode?: string;
  initialLock?: string;
}

export const ForceUnlockModal: React.FC<ForceUnlockModalProps> = ({
  isOpen,
  onClose,
  defaultTerminalCode = 'HKBKCBELB',
  defaultLockerName = 'LKR-A01',
  terminalCode: propTerminalCode,
  lockName: propLockName,
  initialCode,
  initialLock,
}) => {
  const effectiveCode = initialCode || propTerminalCode || defaultTerminalCode;
  const effectiveLock = initialLock || propLockName || defaultLockerName;
  const { terminals, forceUnlockLocker } = useRealtime();
  const [terminalCode, setTerminalCode] = useState(effectiveCode);
  const [lockerName, setLockerName] = useState(effectiveLock);

  useEffect(() => {
    if (effectiveCode) setTerminalCode(effectiveCode);
    if (effectiveLock) setLockerName(effectiveLock);
  }, [effectiveCode, effectiveLock, isOpen]);

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
        <SearchableSelect
          label="Select Terminal"
          required
          options={terminalOptions}
          value={terminalCode}
          onChange={setTerminalCode}
          placeholder="Search and select terminal..."
          searchPlaceholder="Filter by terminal code, site, or city..."
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-700">
            Locker Name / Number <span className="text-error-500">*</span>
          </label>
          <Input
            type="text"
            value={lockerName}
            onChange={e => setLockerName(e.target.value)}
            placeholder="e.g. LKR-A04"
            className="font-mono font-semibold"
            required
          />
        </div>
      </div>
    </DestructiveActionModal>
  );
};
