import { Checkbox } from '../../../components/ui/Checkbox';

interface BulkBarProps {
  total: number;
  completed: number;
  onCheckAll: () => void;
  onClearAll: () => void;
}

/** "Select All" / "Clear All" — applies to the currently visible (filtered) people. */
export function BulkBar({ total, completed, onCheckAll, onClearAll }: BulkBarProps) {
  const allChecked = total > 0 && completed === total;

  return (
    <div className="flex items-center justify-between">
      <label className="flex cursor-pointer items-center gap-3 font-medium text-slate-700 select-none dark:text-slate-200">
        <Checkbox
          checked={allChecked}
          indeterminate={completed > 0 && !allChecked}
          onChange={allChecked ? onClearAll : onCheckAll}
          label="Mark all visible as completed"
        />
        Select All
      </label>
      <button
        type="button"
        onClick={onClearAll}
        disabled={completed === 0}
        className="h-9 rounded-full px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
      >
        Clear All
      </button>
    </div>
  );
}
