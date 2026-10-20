// The visitor's trade-access confirmation (localStorage) and detected country
// (cookie from src/proxy.ts), exposed as external stores for
// useSyncExternalStore. Snapshots are raw strings so they stay referentially stable.
import { compliance } from '@/config/compliance';

export type Access = { at: number; country: string | null };

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

/** Raw stored confirmation, or null. Storage errors read as null. */
export function getStored(): string | null {
  try {
    return localStorage.getItem(compliance.storageKey);
  } catch {
    return null;
  }
}

/** On the server there is no device storage: undefined means "not known yet". */
export const getServerStored = (): string | null | undefined => undefined;

export function parseAccess(raw: string | null | undefined): Access | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    return typeof value?.at === 'number' ? { at: value.at, country: value.country ?? null } : null;
  } catch {
    return null;
  }
}

/** Valid when recent and given for the same country the visitor is in now. */
export const isValid = (access: Access | null, country: string | null) =>
  access !== null && Date.now() - access.at < compliance.rememberDays * 86_400_000 && access.country === country;

export function grantAccess(country: string | null) {
  try {
    localStorage.setItem(compliance.storageKey, JSON.stringify({ at: Date.now(), country }));
  } catch {
    // Not remembered; the gate will ask again next visit.
  }
  emit();
}

export function clearAccess() {
  try {
    localStorage.removeItem(compliance.storageKey);
  } catch {
    // nothing to clear
  }
  emit();
}

/** Country code from the proxy cookie, or null. */
export function getCountryCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${compliance.countryCookie}=([A-Z]{2})`));
  return match ? match[1] : null;
}
export const getServerCountry = (): string | null | undefined => undefined;
export const subscribeNoop = () => () => {};
