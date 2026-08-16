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
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 hover:border-zinc-300 shadow-2xs hover:bg-zinc-50/50 transition-all"
      >
        <Calendar className="h-3.5 w-3.5 text-primary" />
        <span>{startDate} – {endDate}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1 mb-1">
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
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                  activePreset === p.label
                    ? 'bg-orange-50 text-orange-700 font-bold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span>{p.label}</span>
                {activePreset === p.label && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-zinc-100 px-2 flex justify-between text-[11px] text-zinc-400 font-mono">
            <span>2026 Live Session</span>
            <span className="text-primary font-bold">IST (UTC+5:30)</span>
          </div>
        </div>
      )}
    </div>
  );
};
