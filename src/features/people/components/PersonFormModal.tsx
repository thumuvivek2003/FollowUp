import { useId, useRef, useState, type ComponentType, type FormEvent, type ReactNode } from 'react';
import { FileText, Phone, User } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { isValidPhone } from '../../../lib/phone';
import type { PersonDraft } from '../types';

type Errors = Partial<Record<'name' | 'phone', string>>;

const EMPTY: PersonDraft = { name: '', phone: '', notes: '' };

function validate(draft: PersonDraft): Errors {
  const errors: Errors = {};
  if (!draft.name.trim()) errors.name = 'Name is required';
  if (!draft.phone.trim()) errors.phone = 'Phone number is required';
  else if (!isValidPhone(draft.phone)) errors.phone = 'Enter a valid phone number';
  return errors;
}

interface PersonFormModalProps {
  /** Present → edit mode; absent → add mode. */
  initial?: PersonDraft;
  onSubmit: (draft: PersonDraft) => void;
  onClose: () => void;
}

export function PersonFormModal({ initial, onSubmit, onClose }: PersonFormModalProps) {
  const isEdit = initial !== undefined;
  const [draft, setDraft] = useState<PersonDraft>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [addedCount, setAddedCount] = useState(0);
  const nameInput = useRef<HTMLInputElement>(null);

  const set = (field: keyof PersonDraft) => (value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
    if (field in errors) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = (addAnother: boolean) => {
    const found = validate(draft);
    if (found.name || found.phone) {
      setErrors(found);
      return;
    }
    onSubmit(draft);
    if (addAnother) {
      // Fast bulk entry: keep the sheet open for the next person.
      setDraft(EMPTY);
      setAddedCount((n) => n + 1);
      nameInput.current?.focus();
    } else {
      onClose();
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(false);
  };

  return (
    <Modal title={isEdit ? 'Edit Person' : 'Add Person'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4 px-6 pt-2">
        <Field label="Name" required icon={User} error={errors.name}>
          {(props) => (
            <input
              {...props}
              ref={nameInput}
              autoFocus
              autoComplete="off"
              value={draft.name}
              onChange={(e) => set('name')(e.target.value)}
              placeholder="Enter name"
            />
          )}
        </Field>

        <Field label="Phone Number" required icon={Phone} error={errors.phone}>
          {(props) => (
            <input
              {...props}
              type="tel"
              inputMode="tel"
              autoComplete="off"
              value={draft.phone}
              onChange={(e) => set('phone')(e.target.value)}
              placeholder="+91 98765 43210"
            />
          )}
        </Field>

        <Field label="Notes" icon={FileText}>
          {(props) => (
            <textarea
              {...props}
              rows={3}
              value={draft.notes}
              onChange={(e) => set('notes')(e.target.value)}
              placeholder="Add notes (optional)..."
              className={`${props.className} resize-none`}
            />
          )}
        </Field>

        <div className="space-y-2 pt-2">
          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.99]"
          >
            {isEdit ? 'Update Person' : 'Add Person'}
          </button>
          {!isEdit && (
            <button
              type="button"
              onClick={() => submit(true)}
              className="h-11 w-full rounded-2xl font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              Save &amp; add another
              {addedCount > 0 && <span className="ml-1 text-slate-400">({addedCount} added)</span>}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

interface FieldControlProps {
  id: string;
  className: string;
  'aria-invalid': boolean;
  'aria-describedby'?: string;
}

interface FieldProps {
  label: string;
  icon: ComponentType<{ className?: string }>;
  required?: boolean;
  error?: string;
  /** Render prop: the field owns label/error wiring, the caller owns the control. */
  children: (props: FieldControlProps) => ReactNode;
}

function Field({ label, icon: Icon, required, error, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-3.5 left-4 size-5 text-slate-400" />
        {children({
          id,
          'aria-invalid': Boolean(error),
          'aria-describedby': error ? errorId : undefined,
          className: `block w-full rounded-xl border bg-white py-3 pr-4 pl-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-950 dark:text-white ${
            error
              ? 'border-red-400 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700'
          }`,
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
