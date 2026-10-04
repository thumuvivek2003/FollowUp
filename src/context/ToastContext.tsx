import { createContext, use, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

interface Toast {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
}

type ShowToast = (toast: Omit<Toast, 'id'>) => void;

const ToastContext = createContext<ShowToast | null>(null);
const DURATION_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const nextId = useRef(0);

  const show = useCallback<ShowToast>((t) => setToast({ ...t, id: ++nextId.current }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4"
      >
        {toast && (
          <div
            key={toast.id}
            className="animate-pop pointer-events-auto flex items-center gap-4 rounded-xl bg-slate-900 py-3 pr-3 pl-4 text-sm text-white shadow-xl dark:bg-slate-100 dark:text-slate-900"
          >
            <span>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  setToast(null);
                }}
                className="rounded-lg px-2 py-1 font-semibold text-blue-400 hover:bg-white/10 dark:text-blue-600 dark:hover:bg-slate-900/10"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext>
  );
}

export function useToast(): ShowToast {
  const value = use(ToastContext);
  if (value === null) throw new Error('useToast must be used inside <ToastProvider>');
  return value;
}
