import Link from 'next/link';
import { site } from '@/config/site';
import { PageHead } from '@/components/PageHead';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Contact',
  description: 'How to reach Empire Cigars.',
  path: '/contact/',
});

export default function ContactPage() {
  const { email, phone, address } = site.contact;
  const hasContact = Boolean(email || phone || address);
  return (
    <>
      <PageHead eyebrow="Contact" title="Contact" lede="Trade, press and partnership enquiries." crumbs={[{ label: 'Contact' }]} />
      <section className="section">
        <div className="container prose">
          {hasContact ? (
            <ul>
              {email && (
                <li>
                  Email: <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
              {phone && <li>Telephone: {phone}</li>}
              {address && <li>Address: {address}</li>}
            </ul>
          ) : (
            <>
              <p>
                Empire Cigars is in development and has not yet published its contact channels. Enquiry details will appear here, and in the footer of every page, as soon as the company confirms them.
              </p>
              <p className="claim-note">
                <strong>Why there is no form here:</strong> a contact form needs a confirmed recipient, a privacy notice and a data-processing arrangement. We will add one when those are in place rather than collect messages no one can answer.
              </p>
            </>
          )}
          <p style={{ marginTop: 'var(--space-6)' }}>
            Meanwhile, explore <Link href="/collections/">the collections</Link> or read <Link href="/journal/introducing-empire-cigars/">our introduction</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
