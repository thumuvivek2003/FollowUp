import { useCallback, useRef, useState, type ComponentType } from 'react';
import { useDismiss } from '../../hooks/useDismiss';
import { cn } from '../../lib/cn';

export interface MenuItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onSelect: () => void;
  danger?: boolean;
}

interface MenuProps {
  label: string;
  icon: ComponentType<{ className?: string }>;
  items: MenuItem[];
  buttonClassName?: string;
}

/** Overflow ("⋮") menu: a trigger button plus a dismissable dropdown. */
export function Menu({ label, icon: Icon, items, buttonClassName }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
          buttonClassName ?? 'size-9',
        )}
      >
        <Icon className="size-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-pop absolute top-full right-0 z-30 mt-1 min-w-48 origin-top-right overflow-hidden rounded-2xl bg-white py-1.5 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10"
        >
          {items.map(({ label: itemLabel, icon: ItemIcon, onSelect, danger }) => (
            <button
              key={itemLabel}
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                onSelect();
              }}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition',
                danger
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/60',
              )}
            >
              <ItemIcon className="size-4.5" />
              {itemLabel}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
