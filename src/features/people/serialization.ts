import { createId } from '../../lib/id';
import type { Person } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * Validates untrusted data (localStorage or an imported file) into Person[].
 * Bad entries are dropped instead of crashing the app.
 */
export function parsePeople(data: unknown): Person[] {
  const list = isRecord(data) && Array.isArray(data.people) ? data.people : data;
  if (!Array.isArray(list)) return [];

  const now = Date.now();
  const seen = new Set<string>();

  return list.flatMap((item): Person[] => {
    if (!isRecord(item) || typeof item.name !== 'string' || typeof item.phone !== 'string') {
      return [];
    }
    let id = typeof item.id === 'string' && item.id ? item.id : createId();
    if (seen.has(id)) id = createId();
    seen.add(id);

    return [
      {
        id,
        name: item.name,
        phone: item.phone,
        notes: typeof item.notes === 'string' ? item.notes : '',
        completed: item.completed === true,
        createdAt: typeof item.createdAt === 'number' ? item.createdAt : now,
        updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : now,
      },
    ];
  });
}

export function exportPeople(people: Person[]): void {
  const payload = { app: 'batch-follow-up', version: 1, exportedAt: new Date().toISOString(), people };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `batch-follow-up-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function readPeopleFile(file: File): Promise<Person[]> {
  return parsePeople(JSON.parse(await file.text()));
}
