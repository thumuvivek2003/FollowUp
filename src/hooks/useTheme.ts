import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS, storage } from '../lib/storage';

export type Theme = 'light' | 'dark';

const initialTheme = (): Theme => {
  const saved = storage.read<Theme | null>(STORAGE_KEYS.theme, null);
  if (saved === 'light' || saved === 'dark') return saved;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      storage.write(STORAGE_KEYS.theme, next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
