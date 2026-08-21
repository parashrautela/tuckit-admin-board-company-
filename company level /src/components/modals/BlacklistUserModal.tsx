import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserX, UserCheck } from 'lucide-react';

interface BlacklistUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
  onSuccess?: () => void;
}

export const BlacklistUserModal: React.FC<BlacklistUserModalProps> = ({ isOpen, onClose, initialPhone, onSuccess }) => {
  const { blacklistUser, unblockUser } = useRealtime();
  const [actionType, setActionType] = useState<'block' | 'unblock'>('block');
  const [mobile, setMobile] = useState(initialPhone || '');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialPhone) setMobile(initialPhone);
    if (isOpen) {
      setReason('');
      setIsSubmitting(false);
    }
  }, [initialPhone, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) return;
    if (actionType === 'block' && !reason.trim()) return;
    setIsSubmitting(true);
    if (actionType === 'block') {
      await blacklistUser(mobile, reason);
    } else {
      await unblockUser(mobile);
    }
    setIsSubmitting(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Block / Unblock Customer User"
      subtitle="Restrict or restore booking permissions across all Tuckit terminals nationwide"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle between Block / Unblock */}
        <div className="flex rounded-lg p-1 bg-neutral-100 border border-neutral-200">
          <button
            type="button"
            onClick={() => setActionType('block')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              actionType === 'block'
                ? 'bg-error-500 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <UserX className="h-3.5 w-3.5" />
            <span>Blacklist / Block User</span>
          </button>
          <button
            type="button"
            onClick={() => setActionType('unblock')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              actionType === 'unblock'
                ? 'bg-success-500 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Unblock / Restore</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-700">
            Customer Mobile Number <span className="text-error-500">*</span>
          </label>
          <Input
            type="text"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="e.g. 9845012345 or +91 98450 12345"
            required
          />
        </div>

        {actionType === 'block' && (
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700">
              Reason for Blacklisting <span className="text-error-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="State verified security incident or violation reason..."
              rows={2}
              className="flex w-full rounded-md border border-neutral-200 bg-white p-3 text-sm shadow-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              required
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            variant={actionType === 'block' ? 'destructive' : 'default'}
            disabled={isSubmitting || !mobile.trim() || (actionType === 'block' && !reason.trim())}
          >
            <span>{isSubmitting ? 'Processing...' : actionType === 'block' ? 'Confirm Blacklist' : 'Restore Access'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
