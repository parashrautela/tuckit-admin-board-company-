import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('Last 7 Days');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: 'Today', start: 'Aug 16, 2026', end: 'Aug 16, 2026' },
    { label: 'Yesterday', start: 'Aug 15, 2026', end: 'Aug 15, 2026' },
    { label: 'Last 7 Days', start: 'Aug 10, 2026', end: 'Aug 16, 2026' },
    { label: 'Last 30 Days', start: 'Jul 18, 2026', end: 'Aug 16, 2026' },
    { label: 'This Month', start: 'Aug 01, 2026', end: 'Aug 16, 2026' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center gap-2 px-3 bg-white border border-neutral-200 rounded-md text-sm font-medium text-neutral-800 hover:bg-neutral-50 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
      >
        <Calendar className="h-4 w-4 text-primary-500" />
        <span className="text-xs font-medium">{startDate} – {endDate}</span>
        <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-md shadow-md border border-neutral-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1 mb-1">
            Quick Date Presets
          </div>
          <div className="space-y-0.5">
            {presets.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setActivePreset(p.label);
                  onChange(p.start, p.end);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-sm font-medium transition-colors ${
                  activePreset === p.label
                    ? 'bg-primary-50 text-primary-900 font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>{p.label}</span>
                {activePreset === p.label && <Check className="h-3.5 w-3.5 text-primary-500" />}
              </button>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 px-2 flex justify-between text-[11px] text-neutral-500 font-mono">
            <span>2026 Session</span>
            <span className="text-primary-500 font-semibold">IST (UTC+5:30)</span>
          </div>
        </div>
      )}
    </div>
  );
};
