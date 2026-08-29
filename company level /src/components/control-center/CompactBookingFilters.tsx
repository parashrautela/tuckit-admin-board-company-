import React, { useState } from 'react';
import { Terminal } from '@/types';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  BookmarkPlus,
  X,
  RotateCcw,
  Calendar,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export interface SavedView {
  id: string;
  name: string;
  isBuiltIn?: boolean;
  params: Record<string, string>;
}

interface CompactBookingFiltersProps {
  mobileFilter: string;
  sourceFilter: string;
  typeFilter: string;
  statusFilter: string;
  stateFilter: string;
  cityFilter: string;
  siteTypeFilter: string;
  terminalFilter: string;
  startDate: string;
  endDate: string;
  activePreset: string;
  updateFilter: (key: string, value: string) => void;
  setDateRange: (s: string, e: string, presetName?: string) => void;
  handleSelectPreset: (preset: string) => void;
  resetFilters: () => void;
  terminals: Terminal[];
  allSavedViews: SavedView[];
  searchParams: URLSearchParams;
  applyView: (view: SavedView) => void;
  handleDeleteSavedView: (id: string, e: React.MouseEvent) => void;
  onOpenSaveView: () => void;
  filteredCount: number;
  totalCount: number;
  activeFiltersCount: number;
}

export const CompactBookingFilters: React.FC<CompactBookingFiltersProps> = ({
  mobileFilter,
  sourceFilter,
  typeFilter,
  statusFilter,
  stateFilter,
  cityFilter,
  siteTypeFilter,
  terminalFilter,
  startDate,
  endDate,
  activePreset,
  updateFilter,
  setDateRange,
  handleSelectPreset,
  resetFilters,
  terminals,
  allSavedViews,
  searchParams,
  applyView,
  handleDeleteSavedView,
  onOpenSaveView,
  filteredCount,
  totalCount,
  activeFiltersCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showViewsDropdown, setShowViewsDropdown] = useState(false);
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);

  // Check if any secondary filter is set
  const secondaryFilterCount = [
    stateFilter !== 'ALL',
    cityFilter !== 'ALL',
    siteTypeFilter !== 'ALL',
    terminalFilter !== 'ALL',
  ].filter(Boolean).length;

  const datePresets = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'This Year'];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-3.5 flex flex-col gap-3">
      {/* ── Primary Row: Quick Search, Inline Selects & Core Actions ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 w-full">
        {/* Left Section: Search Input + High-Frequency Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {/* Global Search Input */}
          <div className="relative flex-1 min-w-[180px] sm:min-w-[220px] max-w-full lg:max-w-xs">
            <Search className="absolute left-3 top-2.5 size-4 text-neutral-400" />
            <input
              type="text"
              value={mobileFilter}
              onChange={e => updateFilter('mobile', e.target.value)}
              placeholder="Search customer, mobile, ID..."
              className="w-full pl-9 pr-8 h-9 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg text-xs font-medium outline-none focus:border-primary transition-all text-neutral-900 placeholder:text-neutral-500"
            />
            {mobileFilter && (
              <button
                type="button"
                onClick={() => updateFilter('mobile', '')}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700"
                title="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Quick Filter: Status */}
          <Select
            value={statusFilter}
            onChange={e => updateFilter('status', e.target.value)}
            className={statusFilter !== 'ALL' ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300/50' : ''}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">● Active</option>
            <option value="COMPLETED">✓ Completed</option>
            <option value="OVERDUE">⚠ Overdue</option>
          </Select>

          {/* Quick Filter: Source */}
          <Select
            value={sourceFilter}
            onChange={e => updateFilter('source', e.target.value)}
            className={sourceFilter !== 'ALL' ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300/50' : ''}
          >
            <option value="ALL">All Sources</option>
            <option value="Touchscreen">Touchscreen (Kiosk)</option>
            <option value="Web">Web Portal</option>
            <option value="Mobile App">Mobile App</option>
            <option value="WhatsApp">WhatsApp Bot</option>
            <option value="Offline Payment / QR">QR / Offline</option>
          </Select>

          {/* Quick Filter: Locker Type */}
          <Select
            value={typeFilter}
            onChange={e => updateFilter('type', e.target.value)}
            className={typeFilter !== 'ALL' ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300/50' : ''}
          >
            <option value="ALL">All Types</option>
            <option value="BAGGAGE">Baggage Locker</option>
            <option value="MOBILE">Mobile Phone Locker</option>
          </Select>

          {/* More Filters Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-semibold transition-all shrink-0 ${
              showAdvanced || secondaryFilterCount > 0
                ? 'bg-neutral-800 text-white border-neutral-800 shadow-2xs'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
            }`}
          >
            <SlidersHorizontal className="size-3.5" />
            <span>More Filters</span>
            {secondaryFilterCount > 0 && (
              <span className="ml-0.5 size-4 rounded-full bg-primary text-neutral-900 text-xs font-bold flex items-center justify-center">
                {secondaryFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Section: Date Range, Presets & Saved Views */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {/* Quick Presets Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowPresetsDropdown(!showPresetsDropdown);
                setShowViewsDropdown(false);
              }}
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-semibold transition-all ${
                activePreset
                  ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300/50'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
              }`}
            >
              <Calendar className="size-3.5 text-neutral-500" />
              <span>{activePreset || 'Presets'}</span>
              <ChevronDown className="size-3.5 text-neutral-400" />
            </button>

            {showPresetsDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg p-1.5 z-40 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-2.5 py-1">Time Presets</span>
                {datePresets.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      handleSelectPreset(preset);
                      setShowPresetsDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      activePreset === preset
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'hover:bg-neutral-50 text-neutral-800'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Picker */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => setDateRange(s, e)}
          />

          {/* Saved Views Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowViewsDropdown(!showViewsDropdown);
                setShowPresetsDropdown(false);
              }}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-semibold transition-colors shadow-2xs shrink-0"
            >
              <Bookmark className="size-3.5 text-neutral-500" />
              <span>Views</span>
              <ChevronDown className="size-3.5 text-neutral-400" />
            </button>

            {showViewsDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 z-40 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2 py-1 border-b border-neutral-100 pb-1.5">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Saved Views</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowViewsDropdown(false);
                      onOpenSaveView();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-800 hover:text-primary-950"
                  >
                    <BookmarkPlus className="size-3.5" />
                    <span>Save Current</span>
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-0.5 pt-1">
                  {allSavedViews.map(view => {
                    const isMatch = Object.entries(view.params).every(([k, v]) => searchParams.get(k) === v);
                    return (
                      <div
                        key={view.id}
                        onClick={() => {
                          applyView(view);
                          setShowViewsDropdown(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          isMatch ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-neutral-50 text-neutral-800'
                        }`}
                      >
                        <span className="truncate">{view.name}</span>
                        {!view.isBuiltIn && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSavedView(view.id, e)}
                            className="p-1 text-neutral-400 hover:text-rose-600 rounded ml-1"
                            title="Delete custom view"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Expandable Secondary Filter Row (Location, City, Facility, Terminal) ── */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-neutral-100 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">State</span>
            <Select
              value={stateFilter}
              onChange={e => updateFilter('state', e.target.value)}
              containerClassName="w-full"
            >
              <option value="ALL">All States</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="West Bengal">West Bengal</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">City</span>
            <Select
              value={cityFilter}
              onChange={e => updateFilter('city', e.target.value)}
              containerClassName="w-full"
            >
              <option value="ALL">All Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Kolkata">Kolkata</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Site Type</span>
            <Select
              value={siteTypeFilter}
              onChange={e => updateFilter('siteType', e.target.value)}
              containerClassName="w-full"
            >
              <option value="ALL">All Facility Types</option>
              <option value="AIRPORT">Airport</option>
              <option value="MALL">Shopping Mall</option>
              <option value="METRO">Metro Station</option>
              <option value="COLLEGE">University / College</option>
              <option value="TEMPLE">Temple / Religious</option>
              <option value="RAILWAY">Railway Junction</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Terminal Node</span>
            <Select
              value={terminalFilter}
              onChange={e => updateFilter('terminal', e.target.value)}
              containerClassName="w-full"
            >
              <option value="ALL">All Terminals ({terminals.length})</option>
              {terminals.map(t => (
                <option key={t.id} value={t.code}>
                  {t.code} — {t.siteName} ({t.city})
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* ── Active Filter Chips Row (Dynamic Dismissible Tags) ── */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-neutral-100 text-xs">
          <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider mr-1 flex items-center gap-1.5 shrink-0 select-none">
            <SlidersHorizontal className="size-3.5 text-neutral-500" /> Active Filters ({activeFiltersCount}):
          </span>

          {mobileFilter && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 text-xs font-medium border border-neutral-200 transition-colors">
              <span>Search: <strong>"{mobileFilter}"</strong></span>
              <button
                type="button"
                onClick={() => updateFilter('mobile', '')}
                className="p-0.5 hover:bg-neutral-300 hover:text-rose-600 rounded-full transition-colors"
                title="Remove search filter"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}

          {statusFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 text-xs font-medium border border-neutral-200 transition-colors">
              <span>Status: <strong>{statusFilter}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter('status', 'ALL')}
                className="p-0.5 hover:bg-neutral-300 hover:text-rose-600 rounded-full transition-colors"
                title="Remove status filter"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}

          {sourceFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 text-xs font-medium border border-neutral-200 transition-colors">
              <span>Source: <strong>{sourceFilter}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter('source', 'ALL')}
                className="p-0.5 hover:bg-neutral-300 hover:text-rose-600 rounded-full transition-colors"
                title="Remove source filter"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}

          {typeFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 text-xs font-medium border border-neutral-200 transition-colors">
              <span>Type: <strong>{typeFilter}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter('type', 'ALL')}
                className="p-0.5 hover:bg-neutral-300 hover:text-rose-600 rounded-full transition-colors"
                title="Remove type filter"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}

          {stateFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 text-xs font-medium border border-neutral-200 transition-colors">
              <span>State: <strong>{stateFilter}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter('state', 'ALL')}
                className="p-0.5 hover:bg-neutral-300 hover:text-rose-600 rounded-full transition-colors"
                title="Remove state filter"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}

          {cityFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 text-xs font-medium border border-neutral-200 transition-colors">
              <span>City: <strong>{cityFilter}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter('city', 'ALL')}
                className="p-0.5 hover:bg-neutral-300 hover:text-rose-600 rounded-full transition-colors"
                title="Remove city filter"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}

          {siteTypeFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 text-xs font-medium border border-neutral-200 transition-colors">
              <span>Facility: <strong>{siteTypeFilter}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter('siteType', 'ALL')}
                className="p-0.5 hover:bg-neutral-300 hover:text-rose-600 rounded-full transition-colors"
                title="Remove facility filter"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}

          {terminalFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 text-xs font-medium border border-neutral-200 transition-colors">
              <span>Node: <strong>{terminalFilter}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter('terminal', 'ALL')}
                className="p-0.5 hover:bg-neutral-300 hover:text-rose-600 rounded-full transition-colors"
                title="Remove terminal filter"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}

          {activePreset && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70 text-xs font-semibold transition-colors">
              <span>Preset: <strong>{activePreset}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter('preset', '')}
                className="p-0.5 hover:bg-amber-100 hover:text-rose-600 rounded-full transition-colors"
                title="Remove preset filter"
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}

          {/* Reset All Action */}
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg border border-rose-200/70 transition-colors shadow-2xs"
          >
            <RotateCcw className="size-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
};
