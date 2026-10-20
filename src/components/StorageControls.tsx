'use client';

import { useSyncExternalStore } from 'react';
import { subscribe, getStored, getServerStored, parseAccess, clearAccess } from '@/lib/ageStore';

/** Shows and clears what this site stores on the visitor's device. */
export function StorageControls() {
  const stored = useSyncExternalStore(subscribe, getStored, getServerStored);
  if (stored === undefined) return null;
  const access = parseAccess(stored);

  return (
    <div className="availability" style={{ maxWidth: 'var(--measure)' }}>
      <p style={{ margin: 0 }}>
        <strong>On this device:</strong>{' '}
        {access ? `trade-access confirmation stored on ${new Date(access.at).toLocaleDateString()}${access.country ? ` (country ${access.country})` : ''}.` : 'nothing is stored.'}
      </p>
      {access && (
        <div>
          <button type="button" className="btn btn--ghost" onClick={clearAccess}>
            Clear stored preferences
          </button>
        </div>
      )}
    </div>
  );
}
