import type { Counts, Filter, Person } from './types';

export function countPeople(people: Person[]): Counts {
  const completed = people.filter((p) => p.completed).length;
  return { all: people.length, completed, pending: people.length - completed };
}

const matchesFilter = (person: Person, filter: Filter) =>
  filter === 'all' || (filter === 'completed') === person.completed;

/** Name matches case-insensitively; phone matches on digits so spacing doesn't matter. */
function matchesQuery(person: Person, query: string) {
  const text = query.trim().toLowerCase();
  if (!text) return true;
  if (person.name.toLowerCase().includes(text)) return true;
  const digits = text.replace(/\D/g, '');
  return digits.length > 0 && person.phone.replace(/\D/g, '').includes(digits);
}

export function selectVisiblePeople(people: Person[], filter: Filter, query: string): Person[] {
  return people.filter((p) => matchesFilter(p, filter) && matchesQuery(p, query));
}
