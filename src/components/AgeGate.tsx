'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { compliance, countryRules, ruleFor } from '@/config/compliance';
import { subscribe, subscribeNoop, getStored, getServerStored, getCountryCookie, getServerCountry, parseAccess, isValid, grantAccess } from '@/lib/ageStore';

// Trade-access gate. Applies the minimum age of the visitor's country, as
// detected by src/proxy.ts; the visitor can correct the country. This is a
// self-declaration, NOT age or trade verification — see docs/launch-checklist.md.
export function AgeGate() {
  const stored = useSyncExternalStore(subscribe, getStored, getServerStored);
  const detected = useSyncExternalStore(subscribeNoop, getCountryCookie, getServerCountry);
  const [chosen, setChosen] = useState<string | null | undefined>(undefined);
  const [denied, setDenied] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const country = chosen !== undefined ? chosen : (detected ?? null);
  const rule = ruleFor(country);
  // Unknown during server render and hydration; then valid, open or denied.
  const state = stored === undefined ? 'checking' : isValid(parseAccess(stored), detected ?? parseAccess(stored)?.country ?? null) ? 'valid' : denied ? 'denied' : 'open';

  const options = useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try {
      names = new Intl.DisplayNames(['en'], { type: 'region' });
    } catch {
      // Older browsers: fall back to codes.
    }
    return Object.keys(countryRules)
      .map((code) => ({ code, name: names?.of(code) ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  const countryName = country ? (options.find((o) => o.code === country)?.name ?? country) : null;

  useEffect(() => {
    const root = document.documentElement;
    if (state !== 'open' && state !== 'denied') {
      delete root.dataset.ageGate;
      return;
    }
    root.dataset.ageGate = 'open';
    confirmRef.current?.focus();
    // Keep keyboard focus inside the dialog.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = document.getElementById('age-gate')?.querySelectorAll<HTMLElement>('button, select, a[href]');
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
  }, [state]);

  if (state === 'checking' || state === 'valid') return null;

  return (
    <div className="age-gate" id="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title" aria-describedby="age-gate-desc">
      <div className="age-gate__panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logos/heritage-cigars-crest-gold.svg" alt="" width={200} height={270} />
        {state === 'open' ? (
          <>
            <p className="eyebrow">Trade access</p>
            <h2 id="age-gate-title">For the tobacco trade</h2>
            <p id="age-gate-desc">
              Heritage Cigars supplies importers, distributors, retailers and lounges. This website is for tobacco-trade professionals of legal smoking age in their country.
            </p>
            <label className="age-gate__country">
              <span>Country</span>
              <select value={country ?? ''} onChange={(e) => setChosen(e.target.value || null)}>
                <option value="">Other country</option>
                {options.map((o) => (
                  <option key={o.code} value={o.code}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="age-gate__rule" aria-live="polite">
              Minimum age {countryName ? `in ${countryName}` : 'applied'}: <strong>{rule.minimumAge}</strong>
            </p>
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <button ref={confirmRef} type="button" className="btn btn--primary" onClick={() => grantAccess(country)}>
                I am {rule.minimumAge}+ and work in the trade
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setDenied(true)}>
                I am not
              </button>
            </div>
            <p className="age-gate__fine">
              {detected ? 'Country detected from your connection. ' : ''}Your answer is remembered on this device for {compliance.rememberDays} days.
            </p>
          </>
        ) : (
          <>
            <h2 id="age-gate-title">This website is for the trade</h2>
            <p id="age-gate-desc" className="age-gate__denied">
              Heritage Cigars does not sell to consumers, and this website is only for tobacco-trade professionals of legal smoking age.
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
