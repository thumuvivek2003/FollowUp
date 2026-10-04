import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** "sheet" slides up from the bottom on phones; "dialog" is always centred. */
  variant?: 'sheet' | 'dialog';
  hideHeader?: boolean;
}

export function Modal({ title, onClose, children, variant = 'sheet', hideHeader = false }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-40 flex justify-center bg-slate-950/50 backdrop-blur-sm',
        variant === 'sheet' ? 'items-end sm:items-center sm:p-4' : 'items-center p-4',
      )}
      onPointerDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'w-full bg-white shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-white/10',
          variant === 'sheet'
            ? 'animate-sheet max-h-[92dvh] overflow-y-auto rounded-t-3xl pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-md sm:rounded-3xl sm:pb-6'
            : 'animate-pop max-w-sm rounded-3xl',
        )}
      >
        {variant === 'sheet' && (
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden dark:bg-slate-700" />
        )}
        {hideHeader ? (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        ) : (
          <div className="flex items-center justify-between px-6 pt-5 pb-2">
            <h2 id={titleId} className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
