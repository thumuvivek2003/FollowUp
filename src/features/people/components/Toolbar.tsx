import { Plus, Search, X } from 'lucide-react';

interface ToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onAdd: () => void;
}

export function Toolbar({ query, onQueryChange, onAdd }: ToolbarProps) {
  return (
    <div className="flex gap-3">
      <label className="relative flex-1">
        <span className="sr-only">Search by name or phone</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search people..."
          className="h-12 w-full rounded-2xl border border-transparent bg-white pr-10 pl-12 text-slate-900 shadow-sm ring-1 ring-slate-200 transition outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-white dark:ring-slate-800 dark:focus:ring-blue-500 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="size-4" />
          </button>
        )}
      </label>
      <button
        type="button"
        onClick={onAdd}
        className="flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-blue-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98]"
      >
        <Plus className="size-5" />
        Add
      </button>
    </div>
  );
}
