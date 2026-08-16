import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { KeyRound, ShieldAlert, Check } from 'lucide-react';

interface ForceUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTerminalCode?: string;
  defaultLockerName?: string;
}

export const ForceUnlockModal: React.FC<ForceUnlockModalProps> = ({
  isOpen,
  onClose,
  defaultTerminalCode = 'TCK-KA-001',
  defaultLockerName = 'LKR-A01',
}) => {
  const { terminals, forceUnlockLocker } = useRealtime();
  const [terminalCode, setTerminalCode] = useState(defaultTerminalCode);
  const [lockerName, setLockerName] = useState(defaultLockerName);
  const [reason, setReason] = useState('Customer physical retrieval emergency (verified ID)');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;
    setIsSubmitting(true);
    await forceUnlockLocker(terminalCode, lockerName, reason);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emergency Force Unlock Locker"
      subtitle="Send instant unlatch signal directly to physical locker solenoid"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-800 text-xs leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Audit Warning:</strong> Force open events are logged with operator timestamp, IP address, and role.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Select Terminal
          </label>
          <select
            value={terminalCode}
            onChange={e => setTerminalCode(e.target.value)}
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
          >
            {terminals.slice(0, 50).map(t => (
              <option key={t.code} value={t.code}>
                {t.code} — {t.siteName} ({t.city})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Locker Name / Number
          </label>
          <input
            type="text"
            value={lockerName}
            onChange={e => setLockerName(e.target.value)}
            placeholder="e.g. LKR-A04"
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Operational Reason
          </label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason for override..."
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:bg-white focus:border-primary outline-none"
            required
          />
        </div>

        <label className="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 cursor-pointer hover:bg-zinc-50">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            className="rounded border-zinc-300 text-primary focus:ring-primary h-4 w-4"
          />
          <span className="text-xs font-medium text-zinc-700">
            I confirm that customer verification or maintenance inspection protocol is fulfilled.
          </span>
        </label>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!confirmed || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 transition-all"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Sending Signal...' : 'Trigger Force Unlock'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
