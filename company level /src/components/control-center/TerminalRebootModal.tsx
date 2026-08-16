import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface TerminalRebootModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTerminalCode?: string;
}

export const TerminalRebootModal: React.FC<TerminalRebootModalProps> = ({
  isOpen,
  onClose,
  defaultTerminalCode = 'TCK-KA-001',
}) => {
  const { terminals, rebootTerminal, restartTerminalService } = useRealtime();
  const [terminalCode, setTerminalCode] = useState(defaultTerminalCode);
  const [rebootType, setRebootType] = useState<'soft' | 'hardware'>('soft');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (rebootType === 'hardware') {
      await rebootTerminal(terminalCode);
    } else {
      await restartTerminalService(terminalCode);
    }
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remote Terminal Reboot / Restart"
      subtitle="Issue low-level systemd or kernel restart signals to IoT kiosk"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Select Terminal Target
          </label>
          <select
            value={terminalCode}
            onChange={e => setTerminalCode(e.target.value)}
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
          >
            {terminals.slice(0, 50).map(t => (
              <option key={t.code} value={t.code}>
                {t.code} — {t.siteName} [{t.connectivityStatus}]
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Reboot Level
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRebootType('soft')}
              className={`p-3 text-left rounded-xl border transition-all ${
                rebootType === 'soft'
                  ? 'border-primary bg-orange-50/50 text-orange-950 ring-1 ring-primary'
                  : 'border-zinc-200 bg-white hover:bg-zinc-50'
              }`}
            >
              <div className="text-xs font-bold">Restart Kiosk App</div>
              <div className="text-[11px] text-zinc-500 mt-1">Soft restart of electron/touch app (~5s)</div>
            </button>
            <button
              type="button"
              onClick={() => setRebootType('hardware')}
              className={`p-3 text-left rounded-xl border transition-all ${
                rebootType === 'hardware'
                  ? 'border-red-500 bg-red-50/50 text-red-950 ring-1 ring-red-500'
                  : 'border-zinc-200 bg-white hover:bg-zinc-50'
              }`}
            >
              <div className="text-xs font-bold text-red-600">Full System Reboot</div>
              <div className="text-[11px] text-zinc-500 mt-1">Power cycle Linaro/SBC board (~45s)</div>
            </button>
          </div>
        </div>

        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-2 text-xs text-zinc-600">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <span>If active customers are interacting with the kiosk, their session will briefly pause.</span>
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
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Sending Signal...' : 'Execute Restart Command'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
