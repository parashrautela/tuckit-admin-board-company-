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
    <div className="relative space-y-1.5" ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-neutral-700">
          {label} {required && <span className="text-error-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-md text-sm text-neutral-800 flex items-center justify-between gap-2 text-left hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="truncate">
          {selectedOption ? (
            <span className="flex items-center gap-1.5">
              <span className="font-mono font-semibold text-neutral-900 text-xs">{selectedOption.value}</span>
              <span className="text-neutral-500 truncate text-xs">— {selectedOption.label}</span>
            </span>
          ) : (
            <span className="text-neutral-400 text-sm font-normal">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-neutral-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-neutral-200 rounded-md shadow-md overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="p-2 border-b border-neutral-100 bg-neutral-50/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 h-8 bg-white border border-neutral-200 rounded-md text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-2 text-neutral-400 hover:text-neutral-600 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 divide-y divide-neutral-50 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
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
                    className={`w-full p-2 rounded-sm text-left text-xs flex items-center justify-between gap-2 transition-colors ${
                      isSelected
                        ? 'bg-primary-50 text-primary-900 font-semibold'
                        : 'hover:bg-neutral-100 text-neutral-800 font-normal'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-neutral-900">{opt.value}</span>
                        {opt.badge && (
                          <span className="px-1.5 py-0.2 bg-neutral-100 text-neutral-600 text-[10px] font-mono rounded">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {opt.label} {opt.sublabel && `(${opt.sublabel})`}
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary-500 shrink-0" />}
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
