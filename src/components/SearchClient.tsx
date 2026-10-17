'use client';

import Link from 'next/link';
import { useMemo, useSyncExternalStore } from 'react';

export type SearchEntry = { href: string; title: string; kind: string; text: string };

const normalise = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// The query lives in the URL (?q=), so searches can be linked to and survive reloads.
const QUERY_EVENT = 'ec-search-query';
const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb);
  window.addEventListener(QUERY_EVENT, cb);
  return () => {
    window.removeEventListener('popstate', cb);
    window.removeEventListener(QUERY_EVENT, cb);
  };
};
const getQuery = () => new URLSearchParams(window.location.search).get('q') ?? '';
const setQuery = (value: string) => {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set('q', value);
  else url.searchParams.delete('q');
  window.history.replaceState(null, '', url);
  window.dispatchEvent(new Event(QUERY_EVENT));
};

export function SearchClient({ index }: { index: SearchEntry[] }) {
  const query = useSyncExternalStore(subscribe, getQuery, () => '');

  const results = useMemo(() => {
    const terms = normalise(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return index
      .map((entry) => {
        const title = normalise(entry.title);
        const hay = `${title} ${normalise(entry.text)}`;
        if (!terms.every((t) => hay.includes(t))) return null;
        return { entry, score: terms.reduce((s, t) => s + (title.includes(t) ? 3 : 1), 0) };
      })
      .filter((x): x is { entry: SearchEntry; score: number } => Boolean(x))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.entry);
  }, [index, query]);

  return (
    <div>
      <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q" className="visually-hidden">
          Search collections and journal
        </label>
        <input
          id="q"
          type="search"
          name="q"
          value={query}
          autoComplete="off"
          placeholder="Search by collection, empire, vitola…"
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <p aria-live="polite" className="muted" style={{ marginTop: 'var(--space-4)' }}>
        {query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Try “Saadian”, “robusto” or “storage”.'}
      </p>
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((r) => (
            <li key={r.href}>
              <Link href={r.href}>
                <small>{r.kind}</small>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-1)', fontWeight: 500 }}>{r.title}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
