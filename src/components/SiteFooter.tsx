import Link from 'next/link';
import { nav, site } from '@/config/site';
import { compliance, defaultMarket } from '@/config/compliance';

export function SiteFooter() {
  const { email, phone, address } = site.contact;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="site-footer__logo" src="/brand/logos/empire-cigars-primary-full-color.svg" alt="Empire Cigars" width={900} height={680} loading="lazy" />
            <p className="muted" style={{ marginTop: 'var(--space-5)', maxWidth: '22rem' }}>
              {site.tagline}
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/search/">Search</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>The house</h2>
            <ul>
              <li>
                <Link href="/collections/saadian/">The Saadian collection</Link>
              </li>
              <li>
                <Link href="/brand/">Brand assets</Link>
              </li>
              {email && (
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
              {phone && <li>{phone}</li>}
              {address && <li>{address}</li>}
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Legal</h2>
            <ul>
              <li>
                <Link href="/legal/privacy/">Privacy policy</Link>
              </li>
              <li>
                <Link href="/legal/terms/">Terms and conditions</Link>
              </li>
              <li>
                <Link href="/legal/cookies/">Cookies and storage preferences</Link>
              </li>
              <li>
                <Link href="/legal/responsible-use/">Age and responsible use</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="warning" role="note">
          WARNING: {defaultMarket.warning}
        </p>
        <div className="site-footer__legal">
          <p>{compliance.generalNotice}</p>
          <p>
            All collections shown are design concepts. Nothing on this website is offered for sale.
          </p>
        </div>
      </div>
    </footer>
  );
}
