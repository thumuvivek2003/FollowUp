import { useLayoutEffect, useRef } from 'react';

interface NotesFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Auto-growing notes box. Every keystroke is saved — no Save button. */
export function NotesField({ id, label, value, onChange }: NotesFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  // Opening the notes means "I want to type": focus with the cursor at the end.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  return (
    <textarea
      ref={ref}
      id={id}
      aria-label={label}
      rows={1}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Add notes..."
      className="block min-h-10 w-full resize-none overflow-hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:bg-slate-950"
    />
  );
}
