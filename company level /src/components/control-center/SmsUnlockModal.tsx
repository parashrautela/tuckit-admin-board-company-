import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { MessageSquare, Send } from 'lucide-react';

interface SmsUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTerminalCode?: string;
  defaultLockerName?: string;
}

export const SmsUnlockModal: React.FC<SmsUnlockModalProps> = ({
  isOpen,
  onClose,
  defaultTerminalCode = 'TCK-KA-001',
  defaultLockerName = 'LKR-A01',
}) => {
  const { terminals, smsUnlockLocker } = useRealtime();
  const [mobile, setMobile] = useState('+91 98450 12345');
  const [terminalCode, setTerminalCode] = useState(defaultTerminalCode);
  const [lockerName, setLockerName] = useState(defaultLockerName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Customer Registered Mobile
          </label>
          <input
            type="text"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="+91 98450 12345"
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Terminal
            </label>
            <select
              value={terminalCode}
              onChange={e => setTerminalCode(e.target.value)}
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
            >
              {terminals.slice(0, 30).map(t => (
                <option key={t.code} value={t.code}>
                  {t.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Locker ID
            </label>
            <input
              type="text"
              value={lockerName}
              onChange={e => setLockerName(e.target.value)}
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
              required
            />
          </div>
        </div>

        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-600">
          Link will expire in <strong>10 minutes</strong>. Customer will receive a direct cryptographic unlock command via Tuckit SMS gateway.
        </div>

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
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Dispatching...' : 'Send SMS Unlock Link'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
