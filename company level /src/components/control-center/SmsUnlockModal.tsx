import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { SearchableSelect, SelectOption } from '../common/SearchableSelect';
import { useRealtime } from '../../context/RealtimeContext';
import { MessageSquare, Send } from 'lucide-react';

interface SmsUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTerminalCode?: string;
  defaultLockerName?: string;
  initialMobile?: string;
}

export const SmsUnlockModal: React.FC<SmsUnlockModalProps> = ({
  isOpen,
  onClose,
  defaultTerminalCode = 'HKBKCBELB',
  defaultLockerName = 'LKR-A01',
  initialMobile = '',
}) => {
  const { terminals, smsUnlockLocker } = useRealtime();
  const [mobile, setMobile] = useState(initialMobile);
  const [terminalCode, setTerminalCode] = useState(defaultTerminalCode);
  const [lockerName, setLockerName] = useState(defaultLockerName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMobile(initialMobile);
      setIsSubmitting(false);
    }
  }, [isOpen, initialMobile]);

  const terminalOptions: SelectOption[] = useMemo(() => {
    return terminals.map(t => ({
      value: t.code,
      label: t.siteName,
      sublabel: `${t.city}, ${t.state}`,
      badge: t.connectivityStatus,
    }));
  }, [terminals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) return;
    setIsSubmitting(true);
    await smsUnlockLocker(mobile, terminalCode, lockerName);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unlock via SMS Fallback Link"
      subtitle="Dispatches a signed one-time unlock token link to customer mobile"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Customer Registered Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="+91 98000 00000"
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold font-mono text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-colors"
            required
            autoFocus
          />
        </div>

        {/* Searchable Terminal Combobox */}
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
            Locker Door Name / ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={lockerName}
            onChange={e => setLockerName(e.target.value)}
            placeholder="e.g. LKR-A01"
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold font-mono text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-colors"
            required
          />
        </div>

        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-600">
          Link will expire in <strong>10 minutes</strong>. Customer will receive a direct cryptographic unlock command via Tuckit SMS gateway.
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !mobile.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFE5C6] hover:bg-[#FFD7A8] text-neutral-900 border border-[#FFC898]/70 text-xs font-bold rounded-lg shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-3.5 w-3.5 text-neutral-700" />
            <span>{isSubmitting ? 'Dispatching...' : 'Send SMS Unlock Link'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
