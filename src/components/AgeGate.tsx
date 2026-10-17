'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { compliance } from '@/config/compliance';
import { subscribe, getStored, getServerStored, isConfirmed, confirmAge } from '@/lib/ageStore';

// Self-declared age confirmation for a catalog-only site. It is NOT age
// verification and is not sufficient for online sales — see
// docs/launch-checklist.md. Bots and no-JS visitors receive the page content,
// which contains no offer to sell.
export function AgeGate() {
  const stored = useSyncExternalStore(subscribe, getStored, getServerStored);
  const [denied, setDenied] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  // Unknown during server render and hydration; then confirmed, open or denied.
  const state = stored === undefined ? 'checking' : isConfirmed(stored) ? 'confirmed' : denied ? 'denied' : 'open';

  useEffect(() => {
    const root = document.documentElement;
    if (state === 'open' || state === 'denied') {
      root.dataset.ageGate = 'open';
      confirmRef.current?.focus();
      // Keep keyboard focus inside the dialog.
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        const dialog = document.getElementById('age-gate');
        const items = dialog?.querySelectorAll<HTMLElement>('button, a[href]');
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    delete root.dataset.ageGate;
  }, [state]);

  if (state === 'checking' || state === 'confirmed') return null;

  return (
    <div className="age-gate" id="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title" aria-describedby="age-gate-desc">
      <div className="age-gate__panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logos/empire-cigars-crest-gold.svg" alt="" width={200} height={270} />
        {state === 'open' ? (
          <>
            <h2 id="age-gate-title">Are you of legal smoking age?</h2>
            <p id="age-gate-desc">
              This website presents tobacco products and is intended only for adults aged {compliance.gateMinimumAge} or over, or the legal smoking age where you live if that is higher.
            </p>
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <button ref={confirmRef} type="button" className="btn btn--primary" onClick={confirmAge}>
                Yes, I am {compliance.gateMinimumAge} or over
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setDenied(true)}>
                No
              </button>
            </div>
            <p className="age-gate__fine">
              Your answer is remembered on this device for {compliance.rememberDays} days. No cookies are used.
            </p>
          </>
        ) : (
          <>
            <h2 id="age-gate-title">Sorry, you cannot enter</h2>
            <p id="age-gate-desc" className="age-gate__denied">
              This website is only for adults of legal smoking age.
            </p>
            <button ref={confirmRef} type="button" className="btn btn--ghost" onClick={() => setDenied(false)}>
              I answered incorrectly
            </button>
          </>
        )}
      </div>
    </div>
  );
}
