import { Moon, Sun, Users } from 'lucide-react';
import type { Theme } from '../../../hooks/useTheme';
import type { Counts } from '../types';
import { AppMenu } from './AppMenu';

interface HeaderProps {
  counts: Counts;
  theme: Theme;
  onToggleTheme: () => void;
  onDeleteAll: () => void;
}

export function Header({ counts, theme, onToggleTheme, onDeleteAll }: HeaderProps) {
  const percent = counts.all === 0 ? 0 : Math.round((counts.completed / counts.all) * 100);
  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <header className="flex items-start gap-3.5">
      <div className="flex size-13 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
        <Users className="size-6" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Batch Follow-up
            </h1>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{counts.completed}</span> /{' '}
              {counts.all} Completed
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
            >
              <ThemeIcon className="size-5" />
            </button>
            <AppMenu onDeleteAll={onDeleteAll} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div
            role="progressbar"
            aria-label="Completion"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-[width] duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="w-10 text-right text-sm font-medium tabular-nums text-slate-500 dark:text-slate-400">
            {percent}%
          </span>
        </div>
      </div>
    </header>
  );
}
