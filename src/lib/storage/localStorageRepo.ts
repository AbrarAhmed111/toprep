const isBrowser = typeof window !== 'undefined'

export const STORAGE_KEYS = {
  preparations: 'toprep:preparations',
  topics: 'toprep:topics',
} as const

export function readCollection<T>(key: string): T[] {
  if (!isBrowser) return []
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

export function writeCollection<T>(key: string, items: T[]): void {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(items))
  } catch {
    // localStorage unavailable (private mode, quota exceeded) — in-memory
    // state still works for the rest of the session, so fail silently.
  }
}
