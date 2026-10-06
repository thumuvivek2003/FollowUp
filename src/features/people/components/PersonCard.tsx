import { memo, useId, useState } from 'react';
import { EllipsisVertical, NotebookPen, Pencil, Trash2 } from 'lucide-react';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Menu } from '../../../components/ui/Menu';
import { cn } from '../../../lib/cn';
import { formatPhone } from '../../../lib/phone';
import { usePeopleActions } from '../PeopleContext';
import type { Person } from '../types';
import { ContactActions } from './ContactActions';
import { IconAction } from './IconAction';
import { NotesField } from './NotesField';

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
}

/**
 * One compact row: ☐ Name · Call · WhatsApp · Message · Notes · ⋮
 * Notes expand under the row on demand. Memoised so typing notes in one
 * row re-renders only that row.
 */
export const PersonCard = memo(function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
  const { toggle, setNotes } = usePeopleActions();
  const [notesOpen, setNotesOpen] = useState(false);
  const notesId = useId();
  const done = person.completed;
  const hasNotes = person.notes.trim().length > 0;

  return (
    <div className={cn('rounded-[inherit] px-3 py-2 sm:px-4', done && 'bg-slate-50/60 dark:bg-slate-950/30')}>
      <div className="flex items-center gap-2 sm:gap-2.5">
        <Checkbox
          checked={done}
          onChange={() => toggle(person.id)}
          label={`Mark ${person.name} as ${done ? 'pending' : 'completed'}`}
          className="scale-90"
        />

        <div className={cn('min-w-0 flex-1', done && 'opacity-50')}>
          <p
            title={person.name}
            className={cn(
              'truncate text-[15px] font-semibold text-slate-900 dark:text-white',
              done && 'line-through',
            )}
          >
            {person.name}
          </p>
          <p className="hidden truncate text-xs text-slate-500 tabular-nums sm:block dark:text-slate-400">
            {formatPhone(person.phone)}
          </p>
        </div>

        <div className={cn('flex items-center gap-1 sm:gap-1.5', done && 'opacity-50 hover:opacity-100')}>
          <ContactActions phone={person.phone} name={person.name} />
          <IconAction
            label={notesOpen ? 'Hide notes' : hasNotes ? 'Show notes' : 'Add notes'}
            tone={hasNotes ? 'amber' : 'slate'}
            pressed={notesOpen}
            onClick={() => setNotesOpen((open) => !open)}
          >
            <NotebookPen className="size-4.5" />
            {hasNotes && !notesOpen && (
              <span className="absolute top-1 right-1 size-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </IconAction>
        </div>

        <Menu
          label={`More options for ${person.name}`}
          icon={EllipsisVertical}
          buttonClassName="h-9 w-5 -mr-1"
          items={[
            { label: 'Edit person', icon: Pencil, onSelect: () => onEdit(person) },
            { label: 'Delete person', icon: Trash2, onSelect: () => onDelete(person), danger: true },
          ]}
        />
      </div>

      {notesOpen && (
        <div className="mt-2 pl-9">
          <NotesField
            id={notesId}
            label={`Notes for ${person.name}`}
            value={person.notes}
            onChange={(notes) => setNotes(person.id, notes)}
          />
        </div>
      )}
    </div>
  );
});
