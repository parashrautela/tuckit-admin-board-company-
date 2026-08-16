import React from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useRealtime();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        // DESIGN.md: hairline border, rounded-lg (12px), minimal shadow, surface-1 bg
        let style = 'bg-white text-ink border-hairline';
        let Icon = Info;
        let iconColor = 'text-blue-500';

        if (toast.type === 'success') {
          style = 'bg-white text-ink border-emerald-200';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'error') {
          style = 'bg-white text-ink border-red-200';
          Icon = AlertCircle;
          iconColor = 'text-red-500';
        } else if (toast.type === 'warning') {
          style = 'bg-white text-ink border-amber-200';
          Icon = AlertTriangle;
          iconColor = 'text-amber-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-card transition-all animate-in slide-in-from-bottom-5 duration-300 ${style}`}
          >
            <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-[13px] font-medium leading-relaxed text-ink">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-ink-subtle hover:text-ink p-0.5 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
