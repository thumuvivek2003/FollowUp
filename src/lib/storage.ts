/**
 * Thin, failure-tolerant wrapper around localStorage.
 * Storage can throw (private mode, quota, disabled site data) — the app
 * must keep working in memory when it does.
 */
export const storage = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },

  write<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore: state stays in memory for this session.
    }
  },
};

export const STORAGE_KEYS = {
  people: 'batch-followups',
  theme: 'batch-followups:theme',
} as const;
