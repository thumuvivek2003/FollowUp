import { memo } from 'react';
import { EllipsisVertical, Pencil, Phone, Trash2 } from 'lucide-react';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Menu } from '../../../components/ui/Menu';
import { cn } from '../../../lib/cn';
import { formatPhone } from '../../../lib/phone';
import { usePeopleActions } from '../PeopleContext';
import type { Person } from '../types';
import { ContactActions } from './ContactActions';
import { NotesField } from './NotesField';

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
}

/** Memoised: typing notes in one card re-renders only that card. */
export const PersonCard = memo(function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
  const { toggle, setNotes } = usePeopleActions();
  const done = person.completed;

  return (
    <article
      className={cn(
        'rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition sm:p-5 dark:bg-slate-900 dark:ring-slate-800',
        done && 'bg-white/70 dark:bg-slate-900/60',
      )}
    >
      <div className="flex items-start gap-3.5">
        <Checkbox
          checked={done}
          onChange={() => toggle(person.id)}
          label={`Mark ${person.name} as ${done ? 'pending' : 'completed'}`}
          className="mt-0.5"
        />
        <div className={cn('min-w-0 flex-1 transition', done && 'opacity-55')}>
          <h2
            className={cn(
              'truncate text-lg font-semibold text-slate-900 dark:text-white',
              done && 'line-through decoration-2',
            )}
          >
            {person.name}
          </h2>
          <p className="mt-0.5 flex items-center gap-2 text-slate-600 tabular-nums dark:text-slate-300">
            <Phone className="size-4 text-slate-400" />
            {formatPhone(person.phone)}
          </p>
        </div>
        <Menu
          label={`More options for ${person.name}`}
          icon={EllipsisVertical}
          items={[
            { label: 'Edit person', icon: Pencil, onSelect: () => onEdit(person) },
            { label: 'Delete person', icon: Trash2, onSelect: () => onDelete(person), danger: true },
          ]}
        />
      </div>

      <div className={cn('mt-4 space-y-3 transition', done && 'opacity-60')}>
        <ContactActions phone={person.phone} name={person.name} />
        <NotesField value={person.notes} onChange={(notes) => setNotes(person.id, notes)} muted={done} />
      </div>
    </article>
  );
});
