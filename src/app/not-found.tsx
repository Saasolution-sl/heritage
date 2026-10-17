import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <p className="not-found__numeral" aria-hidden="true">
          CDIV
        </p>
        <h1 className="title">This page has been lost to history.</h1>
        <p className="lede" style={{ textAlign: 'center' }}>
          The page you were looking for does not exist, or has moved.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link href="/" className="btn btn--primary">
            Return home
          </Link>
          <Link href="/collections/" className="btn btn--ghost">
            The collections
          </Link>
        </div>
      </div>
    </section>
  );
}
