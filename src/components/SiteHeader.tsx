'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav } from '@/config/site';
import { commerce } from '@/config/commerce';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const setOpen = (value: boolean) => setMenuPath(value ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the menu; the page behind it does not scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuPath(null);
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(href) ? 'page' : undefined);
  const solid = scrolled || open || pathname !== '/';

  return (
    <header className="site-header" data-solid={solid}>
      <div className="container site-header__inner">
        <Link href="/" className="site-header__logo" aria-label="Empire Cigars, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logos/empire-cigars-horizontal-gold.svg" alt="" width={1120} height={220} />
        </Link>
        <nav className="site-nav" aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <Link href="/search/" className="header-icon" aria-label="Search" aria-current={current('/search/')}>
            <SearchIcon />
          </Link>
          {commerce.enabled && (
            <Link href="/bag/" className="header-icon" aria-label="Shopping bag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 8h14l-1 12H6L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </Link>
          )}
          <button
            type="button"
            className="header-icon menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span />
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <nav aria-label="Main">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={current(item.href)}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/search/" aria-current={current('/search/')}>
                  Search
                </Link>
              </li>
            </ul>
          </nav>
          <p className="mobile-menu__note">All collections are concepts in development and are not offered for sale.</p>
        </div>
      )}
    </header>
  );
}
