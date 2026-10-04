import { Trash2 } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} variant="dialog" hideHeader>
      <div className="p-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
          <Trash2 className="size-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{message}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="h-11 rounded-xl bg-slate-100 font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-xl bg-red-500 font-semibold text-white hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
