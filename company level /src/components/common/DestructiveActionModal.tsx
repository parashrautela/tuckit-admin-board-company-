import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ShieldAlert, AlertTriangle, KeyRound, Check } from 'lucide-react';

export type DestructiveSeverity = 'single' | 'bulk' | 'fleet';

export interface DestructiveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  severity?: DestructiveSeverity;
  targetCode?: string;
  affectedCountText?: string;
  auditWarning?: string;
  checkboxLabel?: string;
  reasonPlaceholder?: string;
  children?: React.ReactNode;
}

export const DestructiveActionModal: React.FC<DestructiveActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  actionLabel = 'Execute Action',
  severity = 'single',
  targetCode,
  affectedCountText,
  auditWarning = 'Action is permanent and recorded in the system audit trail with operator timestamp, IP address, and role.',
  checkboxLabel = 'I confirm that customer verification or maintenance inspection protocol is fulfilled.',
  reasonPlaceholder = 'State operational reason for manual override...',
  children,
}) => {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(severity === 'fleet' ? 3 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setConfirmed(false);
      setTypedConfirmation('');
      setCooldownSeconds(severity === 'fleet' ? 3 : 0);
      setIsSubmitting(false);
    }
  }, [isOpen, severity]);

  useEffect(() => {
    if (!isOpen || severity !== 'fleet' || cooldownSeconds <= 0) return;
    const timer = setTimeout(() => {
      setCooldownSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [isOpen, severity, cooldownSeconds]);

  const isTypedValid = !targetCode || typedConfirmation.trim().toUpperCase() === targetCode.trim().toUpperCase();
  const isReasonValid = reason.trim().length > 0;
  const isCooldownOver = cooldownSeconds === 0;
  const canSubmit = isReasonValid && confirmed && isTypedValid && isCooldownOver && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle} maxWidth={severity === 'single' ? 'md' : 'lg'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Audit Warning Banner */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Security Audit Protocol:</strong> {auditWarning}
          </div>
        </div>

        {/* Affected Count / Blast Radius Notice for Bulk & Fleet */}
        {affectedCountText && (
          <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl flex items-start gap-2.5 text-red-900 text-xs">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Affected Scope:</strong>
              {affectedCountText}
            </div>
          </div>
        )}

        {/* Custom Form Fields Passed In (e.g. Target Lock / Terminal Selector) */}
        {children}

        {/* Required Empty Reason Field */}
        <div>
          <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Operational Justification / Reason <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder={reasonPlaceholder}
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-900 outline-none transition-colors"
            required
            autoFocus
          />
        </div>

        {/* Typed Target Code Confirmation for Bulk & Fleet */}
        {targetCode && (severity === 'bulk' || severity === 'fleet') && (
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-zinc-900">
              Type <span className="font-mono bg-zinc-200/80 px-1.5 py-0.5 rounded text-zinc-900 font-black">{targetCode}</span> to confirm:
            </label>
            <input
              type="text"
              value={typedConfirmation}
              onChange={e => setTypedConfirmation(e.target.value)}
              placeholder={`Enter "${targetCode}"`}
              className="w-full h-10 px-3 bg-white border border-zinc-200 rounded-lg text-xs font-mono font-bold text-zinc-900 placeholder:font-sans placeholder:font-normal focus:border-red-500 outline-none uppercase"
            />
          </div>
        )}

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-2.5 p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50 cursor-pointer hover:bg-zinc-50 select-none">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            className="mt-0.5 rounded border-zinc-300 text-primary focus:ring-primary h-4 w-4"
          />
          <span className="text-xs font-medium text-zinc-700 leading-relaxed">
            {checkboxLabel}
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>
              {isSubmitting
                ? 'Executing...'
                : cooldownSeconds > 0
                ? `${actionLabel} (${cooldownSeconds}s)`
                : actionLabel}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
