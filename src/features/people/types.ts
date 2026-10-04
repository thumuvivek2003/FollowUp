export interface Person {
  id: string;
  name: string;
  phone: string;
  notes: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

/** Fields the user can edit through the add/edit form. */
export type PersonDraft = Pick<Person, 'name' | 'phone' | 'notes'>;

export type Filter = 'all' | 'pending' | 'completed';

export interface Counts {
  all: number;
  pending: number;
  completed: number;
}
