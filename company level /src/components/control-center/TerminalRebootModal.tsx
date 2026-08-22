import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { SearchableSelect, SelectOption } from '../common/SearchableSelect';
import { useRealtime } from '../../context/RealtimeContext';
import { RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';

interface TerminalRebootModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTerminalCode?: string;
}

export const TerminalRebootModal: React.FC<TerminalRebootModalProps> = ({
  isOpen,
  onClose,
  defaultTerminalCode = 'HKBKCBELB',
}) => {
  const { terminals, rebootTerminal, restartTerminalService, addAuditLog } = useRealtime();
  const [terminalCode, setTerminalCode] = useState(defaultTerminalCode);
  const [rebootType, setRebootType] = useState<'soft' | 'hardware'>('soft');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!reason.trim()) return;
    setIsSubmitting(true);
    if (rebootType === 'hardware') {
      addAuditLog('TERMINAL_HARDWARE_REBOOT', 'TERMINAL', terminalCode, `Full power cycle reboot: ${reason}`, 'WARNING');
      await rebootTerminal(terminalCode);
    } else {
      addAuditLog('TERMINAL_SOFT_RESTART', 'TERMINAL', terminalCode, `Soft kiosk service restart: ${reason}`);
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
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Searchable Terminal Combobox */}
        <SearchableSelect
          label="Select Target Terminal"
          required
          options={terminalOptions}
          value={terminalCode}
          onChange={setTerminalCode}
          placeholder="Search and select terminal..."
          searchPlaceholder="Filter by terminal code, site, or city..."
        />

        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
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

        <div>
          <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Operational Reason <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="State reason for remote reboot..."
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-colors"
            required
          />
        </div>

        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-2 text-xs text-zinc-600">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <span>If active customers are interacting with the kiosk, their session will briefly pause.</span>
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
            disabled={isSubmitting || !reason.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFE5C6] hover:bg-[#FFD7A8] text-neutral-900 border border-[#FFC898]/70 text-xs font-bold rounded-lg shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5 text-neutral-700" />
            <span>{isSubmitting ? 'Sending Signal...' : 'Execute Restart Command'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
