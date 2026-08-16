import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { UserX, ShieldAlert, UserCheck } from 'lucide-react';

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
  const [reason, setReason] = useState('Repeated unpaid booking abandonments');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (initialPhone) setMobile(initialPhone);
  }, [initialPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return;
    setIsSubmitting(true);
    if (actionType === 'block') {
      await blacklistUser(mobile, reason);
    } else {
      await unblockUser(mobile);
    }
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Block / Unblock Customer User"
      subtitle="Restrict or restore booking permissions across all Tuckit terminals nationwide"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex rounded-xl p-1 bg-zinc-100 border border-zinc-200">
          <button
            type="button"
            onClick={() => setActionType('block')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              actionType === 'block'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <UserX className="h-3.5 w-3.5" />
            <span>Blacklist / Block User</span>
          </button>
          <button
            type="button"
            onClick={() => setActionType('unblock')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              actionType === 'unblock'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Unblock / Restore</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Customer Mobile Number
          </label>
          <input
            type="text"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="e.g. 9845012345 or +91 98450 12345"
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 focus:bg-white focus:border-primary outline-none"
            required
          />
        </div>

        {actionType === 'block' && (
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Reason for Blacklisting
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Provide reason for security audit log..."
              rows={2}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:bg-white focus:border-primary outline-none"
              required
            />
          </div>
        )}

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
            className={`flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-lg shadow-sm transition-all ${
              actionType === 'block' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <span>{isSubmitting ? 'Processing...' : actionType === 'block' ? 'Confirm Blacklist' : 'Restore Access'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
