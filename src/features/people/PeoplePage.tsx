import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../hooks/useTheme';
import { BulkBar } from './components/BulkBar';
import { EmptyState } from './components/EmptyState';
import { FilterTabs } from './components/FilterTabs';
import { Header } from './components/Header';
import { PersonCard } from './components/PersonCard';
import { PersonFormModal } from './components/PersonFormModal';
import { Toolbar } from './components/Toolbar';
import { usePeople, usePeopleActions } from './PeopleContext';
import { countPeople, selectVisiblePeople } from './selectors';
import type { Filter, Person } from './types';

/** Exactly one overlay can be open at a time. */
type Overlay =
  | { kind: 'add' }
  | { kind: 'edit'; person: Person }
  | { kind: 'delete'; person: Person }
  | { kind: 'deleteAll' }
  | null;

export function PeoplePage() {
  const people = usePeople();
  const actions = usePeopleActions();
  const showToast = useToast();
  const { theme, toggleTheme } = useTheme();

  const [filter, setFilter] = useState<Filter>('pending');
  const [query, setQuery] = useState('');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => countPeople(people), [people]);
  const visible = useMemo(
    () => selectVisiblePeople(people, filter, deferredQuery),
    [people, filter, deferredQuery],
  );
  const visibleCompleted = visible.filter((p) => p.completed).length;

  const closeOverlay = useCallback(() => setOverlay(null), []);
  const openAdd = useCallback(() => setOverlay({ kind: 'add' }), []);
  const openEdit = useCallback((person: Person) => setOverlay({ kind: 'edit', person }), []);
  const openDelete = useCallback((person: Person) => setOverlay({ kind: 'delete', person }), []);

  /** Bulk changes are one tap away from wiping progress, so they get an Undo. */
  const setVisibleCompleted = (completed: boolean) => {
    const previous = people;
    const ids = new Set(visible.map((p) => p.id));
    actions.setCompleted(ids, completed);
    showToast({
      message: completed ? `Marked ${ids.size} as completed` : `Cleared ${ids.size}`,
      action: { label: 'Undo', onClick: () => actions.replaceAll(previous) },
    });
  };

  const confirmDelete = (person: Person) => {
    const previous = people;
    actions.remove(person.id);
    closeOverlay();
    showToast({
      message: `Deleted ${person.name}`,
      action: { label: 'Undo', onClick: () => actions.replaceAll(previous) },
    });
  };

  const confirmDeleteAll = () => {
    const previous = people;
    actions.replaceAll([]);
    closeOverlay();
    showToast({
      message: 'Deleted everyone',
      action: { label: 'Undo', onClick: () => actions.replaceAll(previous) },
    });
  };

  const emptyReason =
    people.length === 0 ? 'empty' : deferredQuery.trim() ? 'no-match' : filter === 'pending' ? 'all-done' : 'no-match';

  return (
    <div className="mx-auto max-w-3xl px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-32 sm:px-6 sm:pt-10">
      <div className="space-y-5">
        <Header
          counts={counts}
          theme={theme}
          onToggleTheme={toggleTheme}
          onDeleteAll={() => setOverlay({ kind: 'deleteAll' })}
        />
        <Toolbar query={query} onQueryChange={setQuery} onAdd={openAdd} />
        <FilterTabs value={filter} counts={counts} onChange={setFilter} />
        {visible.length > 0 && (
          <BulkBar
            total={visible.length}
            completed={visibleCompleted}
            onCheckAll={() => setVisibleCompleted(true)}
            onClearAll={() => setVisibleCompleted(false)}
          />
        )}
      </div>

      <main className="mt-3">
        {visible.length === 0 ? (
          <EmptyState reason={emptyReason} onAdd={openAdd} />
        ) : (
          <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 dark:divide-slate-800 dark:bg-slate-900 dark:ring-slate-800">
            {visible.map((person) => (
              <li key={person.id} className="first:rounded-t-2xl last:rounded-b-2xl">
                <PersonCard person={person} onEdit={openEdit} onDelete={openDelete} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <button
        type="button"
        onClick={openAdd}
        aria-label="Add person"
        className="fixed right-5 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-20 flex size-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 transition hover:bg-blue-700 active:scale-95 sm:right-8 sm:bottom-8"
      >
        <Plus className="size-8" />
      </button>

      {overlay?.kind === 'add' && <PersonFormModal onSubmit={actions.add} onClose={closeOverlay} />}
      {overlay?.kind === 'edit' && (
        <PersonFormModal
          initial={overlay.person}
          onSubmit={(draft) => actions.update(overlay.person.id, draft)}
          onClose={closeOverlay}
        />
      )}
      {overlay?.kind === 'delete' && (
        <ConfirmDialog
          title="Delete Person?"
          message={`Are you sure you want to delete ${overlay.person.name}? Their notes will be removed too.`}
          confirmLabel="Delete"
          onConfirm={() => confirmDelete(overlay.person)}
          onCancel={closeOverlay}
        />
      )}
      {overlay?.kind === 'deleteAll' && (
        <ConfirmDialog
          title="Delete everyone?"
          message={`This removes all ${people.length} people and their notes. Export a backup first if you might need them.`}
          confirmLabel="Delete all"
          onConfirm={confirmDeleteAll}
          onCancel={closeOverlay}
        />
      )}
    </div>
  );
}
