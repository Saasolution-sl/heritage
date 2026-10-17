'use client';

import { useSyncExternalStore } from 'react';
import { subscribe, getStored, getServerStored, clearAge } from '@/lib/ageStore';

/** Shows and clears what this site stores on the visitor's device. */
export function StorageControls() {
  const stored = useSyncExternalStore(subscribe, getStored, getServerStored);
  if (stored === undefined) return null;

  return (
    <div className="availability" style={{ maxWidth: 'var(--measure)' }}>
      <p style={{ margin: 0 }}>
        <strong>On this device:</strong> {stored ? `age confirmation stored on ${new Date(stored).toLocaleDateString()}.` : 'nothing is stored.'}
      </p>
      {stored && (
        <div>
          <button type="button" className="btn btn--ghost" onClick={clearAge}>
            Clear stored preferences
          </button>
        </div>
      )}
    </div>
  );
}
