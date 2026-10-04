import { ToastProvider } from './context/ToastContext';
import { PeopleProvider } from './features/people/PeopleContext';
import { PeoplePage } from './features/people/PeoplePage';

export default function App() {
  return (
    <PeopleProvider>
      <ToastProvider>
        <PeoplePage />
      </ToastProvider>
    </PeopleProvider>
  );
}
