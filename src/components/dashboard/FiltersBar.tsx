import React, { useState, useEffect } from 'react';
import { ApplicationStatus, DashboardFilters, SortOption } from '../../types';
import { SORT_OPTIONS, STATUS_LIST } from '../../constants';
import { Search, X, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export interface FiltersBarProps {
  filters: DashboardFilters;
  onQueryChange: (q: string) => void;
  onStatusChange: (status: 'All' | ApplicationStatus) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
  globalShowPan: boolean;
  onToggleGlobalShowPan: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onQueryChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
  isFiltered,
  globalShowPan,
  onToggleGlobalShowPan,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.q);
  const debouncedSearch = useDebounce(localSearch, 350);

  // Sync debounced search to parent URL filter handler
  useEffect(() => {
    onQueryChange(debouncedSearch);
  }, [debouncedSearch, onQueryChange]);

  // Keep local search input in sync if URL changes externally (e.g. browser back button)
  useEffect(() => {
    setLocalSearch(filters.q);
  }, [filters.q]);

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ID, Name or PAN..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder:text-slate-400"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                onQueryChange('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <select
            value={filters.status}
            onChange={(e) => onStatusChange(e.target.value as 'All' | ApplicationStatus)}
            className="text-xs font-bold py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            aria-label="Filter by application status"
          >
            <option value="All">All Statuses</option>
            {STATUS_LIST.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Sort Select */}
          <select
            value={filters.sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-xs font-bold py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            aria-label="Sort applications"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Global PAN toggle button */}
          <button
            type="button"
            onClick={onToggleGlobalShowPan}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              globalShowPan
                ? 'bg-brand-50 text-brand-700 border-brand-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title="Toggle masking for all PANs"
          >
            {globalShowPan ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{globalShowPan ? 'Mask All PANs' : 'Reveal All PANs'}</span>
          </button>

          {/* Clear Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                onClearFilters();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
