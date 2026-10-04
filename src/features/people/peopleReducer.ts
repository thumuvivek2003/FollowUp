import { createId } from '../../lib/id';
import type { Person, PersonDraft } from './types';

export type PeopleAction =
  | { type: 'add'; draft: PersonDraft }
  | { type: 'update'; id: string; draft: PersonDraft }
  | { type: 'setNotes'; id: string; notes: string }
  | { type: 'toggle'; id: string }
  | { type: 'setCompleted'; ids: ReadonlySet<string>; completed: boolean }
  | { type: 'remove'; id: string }
  | { type: 'replaceAll'; people: Person[] };

const touch = (person: Person, patch: Partial<Person>): Person => ({
  ...person,
  ...patch,
  updatedAt: Date.now(),
});

const clean = (draft: PersonDraft): PersonDraft => ({
  name: draft.name.trim(),
  phone: draft.phone.trim(),
  notes: draft.notes,
});

export function peopleReducer(state: Person[], action: PeopleAction): Person[] {
  switch (action.type) {
    case 'add': {
      const now = Date.now();
      return [
        ...state,
        { id: createId(), ...clean(action.draft), completed: false, createdAt: now, updatedAt: now },
      ];
    }
    case 'update':
      return state.map((p) => (p.id === action.id ? touch(p, clean(action.draft)) : p));
    case 'setNotes':
      return state.map((p) => (p.id === action.id ? touch(p, { notes: action.notes }) : p));
    case 'toggle':
      return state.map((p) => (p.id === action.id ? touch(p, { completed: !p.completed }) : p));
    case 'setCompleted':
      return state.map((p) =>
        action.ids.has(p.id) && p.completed !== action.completed
          ? touch(p, { completed: action.completed })
          : p,
      );
    case 'remove':
      return state.filter((p) => p.id !== action.id);
    case 'replaceAll':
      return action.people;
  }
}
