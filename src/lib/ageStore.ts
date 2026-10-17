// The visitor's age confirmation, kept in localStorage and exposed as an
// external store so components read it with useSyncExternalStore.
import { compliance } from '@/config/compliance';

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

/** Timestamp (ms) of the stored confirmation, or null. Storage errors read as null. */
export function getStored(): number | null {
  try {
    const raw = localStorage.getItem(compliance.storageKey);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

/** On the server there is no device storage: undefined means "not known yet". */
export const getServerStored = (): number | null | undefined => undefined;

export const isConfirmed = (stored: number | null) => stored !== null && Date.now() - stored < compliance.rememberDays * 86_400_000;

export function confirmAge() {
  try {
    localStorage.setItem(compliance.storageKey, String(Date.now()));
  } catch {
    // Not remembered; the gate will ask again next visit.
  }
  emit();
}

export function clearAge() {
  try {
    localStorage.removeItem(compliance.storageKey);
  } catch {
    // nothing to clear
  }
  emit();
}
