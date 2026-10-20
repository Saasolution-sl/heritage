import Link from 'next/link';
import { site } from '@/config/site';
import { PageHead } from '@/components/PageHead';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Trade Enquiries',
  description: 'Heritage Cigars supplies importers, distributors, retailers and lounges. Based in Ceuta, Spain, and Paraguay.',
  path: '/contact/',
});

export default function ContactPage() {
  const { email, phone, address } = site.contact;
  const hasContact = Boolean(email || phone || address);
  return (
    <>
      <PageHead eyebrow="Contact" title="Trade enquiries" lede="We work with importers, distributors, specialist retailers and cigar lounges." crumbs={[{ label: 'Contact' }]} />
      <section className="section">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>Where we are</h2>
            <ul>
              {site.locations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
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
              <p className="claim-note">
                <strong>Contact details to follow.</strong> Addresses, email and telephone for both offices will be published here and in the footer as soon as they are registered.
              </p>
            )}
          </div>
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>What to include</h2>
            <ul>
              <li>Company name, country and type of business</li>
              <li>Collections and formats of interest</li>
              <li>Expected volumes and the markets you supply</li>
            </ul>
            <p className="muted">
              Trade pricing, minimum orders and availability are shared directly with trade partners. Browse <Link href="/collections/">the collections</Link> in the meantime.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
