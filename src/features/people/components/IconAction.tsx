import type { ReactNode } from 'react';
import { cn } from '../../../lib/cn';

const TONES = {
  green: 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20',
  blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20',
  slate: 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
  amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20',
} as const;

type IconActionProps = {
  label: string;
  tone: keyof typeof TONES;
  children: ReactNode;
} & (
  | { href: string; external?: boolean; onClick?: never; pressed?: never }
  | { onClick: () => void; pressed?: boolean; href?: never; external?: never }
);

/** Compact square icon button — renders a link or a button depending on props. */
export function IconAction({ label, tone, children, href, external, onClick, pressed }: IconActionProps) {
  const className = cn(
    'relative flex size-8 shrink-0 items-center sm:size-9 justify-center rounded-xl transition active:scale-90',
    TONES[tone],
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        aria-label={label}
        title={label}
        className={className}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={pressed} title={label} className={className}>
      {children}
    </button>
  );
}
