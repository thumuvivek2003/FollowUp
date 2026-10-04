import { createContext, use, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { STORAGE_KEYS, storage } from '../../lib/storage';
import { peopleReducer } from './peopleReducer';
import { parsePeople } from './serialization';
import type { Person, PersonDraft } from './types';

export interface PeopleActions {
  add(draft: PersonDraft): void;
  update(id: string, draft: PersonDraft): void;
  setNotes(id: string, notes: string): void;
  toggle(id: string): void;
  setCompleted(ids: ReadonlySet<string>, completed: boolean): void;
  remove(id: string): void;
  replaceAll(people: Person[]): void;
}

// State and actions live in separate contexts: actions never change, so
// components that only dispatch (e.g. memoised cards) don't re-render on
// every list update.
const PeopleStateContext = createContext<Person[] | null>(null);
const PeopleActionsContext = createContext<PeopleActions | null>(null);

const loadPeople = () => parsePeople(storage.read<unknown>(STORAGE_KEYS.people, []));

export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, dispatch] = useReducer(peopleReducer, undefined, loadPeople);

  useEffect(() => {
    storage.write(STORAGE_KEYS.people, people);
  }, [people]);

  const actions = useMemo<PeopleActions>(
    () => ({
      add: (draft) => dispatch({ type: 'add', draft }),
      update: (id, draft) => dispatch({ type: 'update', id, draft }),
      setNotes: (id, notes) => dispatch({ type: 'setNotes', id, notes }),
      toggle: (id) => dispatch({ type: 'toggle', id }),
      setCompleted: (ids, completed) => dispatch({ type: 'setCompleted', ids, completed }),
      remove: (id) => dispatch({ type: 'remove', id }),
      replaceAll: (list) => dispatch({ type: 'replaceAll', people: list }),
    }),
    [],
  );

  return (
    <PeopleActionsContext value={actions}>
      <PeopleStateContext value={people}>{children}</PeopleStateContext>
    </PeopleActionsContext>
  );
}

export function usePeople(): Person[] {
  const value = use(PeopleStateContext);
  if (value === null) throw new Error('usePeople must be used inside <PeopleProvider>');
  return value;
}

export function usePeopleActions(): PeopleActions {
  const value = use(PeopleActionsContext);
  if (value === null) throw new Error('usePeopleActions must be used inside <PeopleProvider>');
  return value;
}
