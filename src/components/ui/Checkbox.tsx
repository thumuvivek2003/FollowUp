import { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
  className?: string;
}

/** Native checkbox (keyboard + screen reader support for free), custom-drawn. */
export function Checkbox({ checked, indeterminate = false, onChange, label, className }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const Mark = indeterminate ? Minus : Check;

  return (
    <span className={`relative inline-flex size-7 shrink-0 ${className ?? ''}`}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        className="peer size-7 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-white transition checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:outline-none dark:border-slate-600 dark:bg-slate-900"
      />
      <Mark
        strokeWidth={3}
        className="pointer-events-none absolute inset-0 m-auto hidden size-4.5 text-white peer-checked:block peer-indeterminate:block"
      />
    </span>
  );
}
