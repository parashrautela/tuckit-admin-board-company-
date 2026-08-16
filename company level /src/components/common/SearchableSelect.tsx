import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Type to search...',
  emptyMessage = 'No matching options found.',
  label,
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(() => options.find(o => o.value === value), [options, value]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const query = search.toLowerCase().trim();
    return options.filter(
      o =>
        o.label.toLowerCase().includes(query) ||
        o.value.toLowerCase().includes(query) ||
        (o.sublabel && o.sublabel.toLowerCase().includes(query))
    );
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative space-y-1" ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-800 flex items-center justify-between gap-2 text-left hover:bg-white hover:border-zinc-300 focus:bg-white focus:border-zinc-900 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="truncate">
          {selectedOption ? (
            <span className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-zinc-900">{selectedOption.value}</span>
              <span className="text-zinc-500 truncate">— {selectedOption.label}</span>
            </span>
          ) : (
            <span className="text-zinc-400 font-normal">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="p-2 border-b border-zinc-100 bg-zinc-50/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 h-8 bg-white border border-zinc-200 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-600 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List (No artificial caps) */}
          <div className="max-h-60 overflow-y-auto p-1 divide-y divide-zinc-50 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-colors ${
                      isSelected
                        ? 'bg-orange-50/60 text-zinc-900 font-bold'
                        : 'hover:bg-zinc-50 text-zinc-700 font-normal'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-zinc-900">{opt.value}</span>
                        {opt.badge && (
                          <span className="px-1.5 py-0.2 bg-zinc-100 text-zinc-600 text-[10px] font-mono rounded">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {opt.label} {opt.sublabel && `(${opt.sublabel})`}
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
