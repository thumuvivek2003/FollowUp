import { useId, useLayoutEffect, useRef } from 'react';
import { cn } from '../../../lib/cn';

interface NotesFieldProps {
  value: string;
  onChange: (value: string) => void;
  muted: boolean;
}

/** Auto-growing notes box. Every keystroke is saved — no Save button. */
export function NotesField({ value, onChange, muted }: NotesFieldProps) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
        Notes
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Add notes..."
        className={cn(
          'block min-h-12 w-full resize-none overflow-hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:bg-slate-950',
          muted && 'line-through decoration-slate-400/70 focus:no-underline',
        )}
      />
    </div>
  );
}
