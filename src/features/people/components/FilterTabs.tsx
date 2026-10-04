import { cn } from '../../../lib/cn';
import type { Counts, Filter } from '../types';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

interface FilterTabsProps {
  value: Filter;
  counts: Counts;
  onChange: (filter: Filter) => void;
}

export function FilterTabs({ value, counts, onChange }: FilterTabsProps) {
  return (
    <div role="tablist" aria-label="Filter people" className="flex gap-2 overflow-x-auto pb-1">
      {FILTERS.map((filter) => {
        const active = filter.value === value;
        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter.value)}
            className={cn(
              'flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition',
              active
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800 dark:hover:bg-slate-800',
            )}
          >
            {filter.label}
            <span
              className={cn(
                'min-w-6 rounded-full px-1.5 py-0.5 text-xs tabular-nums',
                active ? 'bg-white/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
              )}
            >
              {counts[filter.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
