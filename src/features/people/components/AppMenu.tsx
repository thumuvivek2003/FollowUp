import { useRef, type ChangeEvent } from 'react';
import { Download, EllipsisVertical, Trash2, Upload } from 'lucide-react';
import { Menu } from '../../../components/ui/Menu';
import { useToast } from '../../../context/ToastContext';
import { usePeople, usePeopleActions } from '../PeopleContext';
import { exportPeople, readPeopleFile } from '../serialization';

/** App-level "⋮" menu: backup export/import and bulk delete. */
export function AppMenu({ onDeleteAll }: { onDeleteAll: () => void }) {
  const people = usePeople();
  const { replaceAll } = usePeopleActions();
  const showToast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow re-importing the same file
    if (!file) return;

    try {
      const imported = await readPeopleFile(file);
      if (imported.length === 0) {
        showToast({ message: 'No people found in that file' });
        return;
      }
      const previous = people;
      replaceAll(imported);
      showToast({
        message: `Imported ${imported.length} people`,
        action: { label: 'Undo', onClick: () => replaceAll(previous) },
      });
    } catch {
      showToast({ message: 'Could not read that file' });
    }
  };

  return (
    <>
      <Menu
        label="More options"
        icon={EllipsisVertical}
        buttonClassName="size-10 bg-slate-100 dark:bg-slate-800"
        items={[
          {
            label: 'Export backup',
            icon: Download,
            onSelect: () => exportPeople(people),
          },
          {
            label: 'Import backup',
            icon: Upload,
            onSelect: () => fileInput.current?.click(),
          },
          ...(people.length > 0
            ? [{ label: 'Delete everyone', icon: Trash2, onSelect: onDeleteAll, danger: true }]
            : []),
        ]}
      />
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImport}
      />
    </>
  );
}
