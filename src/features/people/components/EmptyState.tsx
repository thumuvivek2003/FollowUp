import { PartyPopper, SearchX, UserPlus } from 'lucide-react';

type Reason = 'empty' | 'all-done' | 'no-match';

const CONTENT = {
  empty: { icon: UserPlus, title: 'No one added yet', text: 'Add your batch mates to start following up.' },
  'all-done': { icon: PartyPopper, title: 'All caught up!', text: 'Everyone in this view has been followed up.' },
  'no-match': { icon: SearchX, title: 'No matches', text: 'Try a different name, number or filter.' },
} as const;

export function EmptyState({ reason, onAdd }: { reason: Reason; onAdd: () => void }) {
  const { icon: Icon, title, text } = CONTENT[reason];

  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 px-6 py-14 text-center dark:border-slate-800">
      <div className="flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
        <Icon className="size-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{text}</p>
      {reason === 'empty' && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
        >
          Add first person
        </button>
      )}
    </div>
  );
}
