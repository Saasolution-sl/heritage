import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

type Crumb = { href?: string; label: string };

export function PageHead({ eyebrow, title, lede, crumbs, accent, children }: { eyebrow?: string; title: string; lede?: ReactNode; crumbs?: Crumb[]; accent?: string; children?: ReactNode }) {
  return (
    <header className="page-head" style={accent ? ({ '--accent': accent } as CSSProperties) : undefined}>
      <div className="container page-head__inner">
        {crumbs && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </header>
  );
}

export function Rule() {
  return (
    <div className="rule" aria-hidden="true">
      <span />
    </div>
  );
}
