import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert, AlertTriangle, KeyRound } from 'lucide-react';

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
        <div className="p-3.5 bg-warning-50 border border-warning-100 rounded-lg flex items-start gap-2.5 text-warning-700 text-sm leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-warning-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-neutral-900">Security Audit Protocol:</strong> {auditWarning}
          </div>
        </div>

        {/* Affected Count / Blast Radius Notice for Bulk & Fleet */}
        {affectedCountText && (
          <div className="p-3 bg-error-50 border border-error-100 rounded-lg flex items-start gap-2.5 text-error-700 text-sm">
            <AlertTriangle className="h-4 w-4 text-error-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-neutral-900">Affected Scope:</strong>
              {affectedCountText}
            </div>
          </div>
        )}

        {/* Custom Form Fields Passed In */}
        {children}

        {/* Required Empty Reason Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-700">
            Operational Justification / Reason <span className="text-error-500">*</span>
          </label>
          <Input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder={reasonPlaceholder}
            required
            autoFocus
          />
        </div>

        {/* Typed Target Code Confirmation for Bulk & Fleet */}
        {targetCode && (severity === 'bulk' || severity === 'fleet') && (
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2">
            <label className="block text-xs font-medium text-neutral-900">
              Type <span className="font-mono bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-900 font-bold">{targetCode}</span> to confirm:
            </label>
            <Input
              type="text"
              value={typedConfirmation}
              onChange={e => setTypedConfirmation(e.target.value)}
              placeholder={`Enter "${targetCode}"`}
              className="font-mono font-bold uppercase focus-visible:ring-error-500"
            />
          </div>
        )}

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 cursor-pointer hover:bg-neutral-50 select-none">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            className="mt-0.5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500 h-4 w-4"
          />
          <span className="text-xs font-medium text-neutral-700 leading-relaxed">
            {checkboxLabel}
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={!canSubmit}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>
              {isSubmitting
                ? 'Executing...'
                : cooldownSeconds > 0
                ? `${actionLabel} (${cooldownSeconds}s)`
                : actionLabel}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
