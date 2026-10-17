import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, getArticle } from '@/lib/journal';
import { PageHead } from '@/components/PageHead';
import { BreadcrumbJsonLd } from '@/components/Breadcrumbs';
import { pageMeta } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return pageMeta({ title: a.title, description: a.excerpt, path: `/journal/${a.slug}/` });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  return (
    <article>
      <BreadcrumbJsonLd items={[{ name: 'Journal', path: '/journal/' }, { name: a.title, path: `/journal/${a.slug}/` }]} />
      <PageHead eyebrow={a.category} title={a.title} lede={a.excerpt} crumbs={[{ href: '/journal/', label: 'Journal' }, { label: a.title }]}>
        <p className="muted" style={{ fontSize: 'var(--step--1)', margin: 0, display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {a.status === 'draft' && <span className="badge">Draft — editorial review pending</span>}
          <span>
            Updated <time dateTime={a.updated}>{new Date(a.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
          </span>
        </p>
      </PageHead>
      <section className="section">
        <div className="container prose">
          {a.body.map((b, i) => {
            if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
            if (b.type === 'list')
              return (
                <ul key={i}>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              );
            if (b.type === 'note')
              return (
                <p key={i} className="claim-note">
                  {b.text}
                </p>
              );
            return <p key={i}>{b.text}</p>;
          })}
          {a.sources.length > 0 && (
            <div className="article-sources">
              <h2 style={{ fontSize: 'var(--step-1)', marginTop: 0 }}>Sources</h2>
              <ol>
                {a.sources.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} rel="noopener noreferrer" target="_blank">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <p style={{ marginTop: 'var(--space-7)' }}>
            <Link href="/journal/" className="text-link text-link--back">
              All journal entries
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
