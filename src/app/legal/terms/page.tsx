import { PageHead } from '@/components/PageHead';
import { LegalDraftNotice } from '../LegalDraft';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Terms and Conditions', description: 'Terms for using the Empire Cigars website.', path: '/legal/terms/' });

export default function TermsPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Terms and conditions" crumbs={[{ label: 'Terms and conditions' }]} />
      <section className="section">
        <div className="container prose">
          <LegalDraftNotice />
          <h2>Adults only</h2>
          <p>This website presents tobacco products and is intended only for adults of legal smoking age in their place of residence.</p>
          <h2>No offer for sale</h2>
          <p>All products shown are design concepts. Nothing on this website is an offer to sell, and no orders, payments or deliveries are accepted. Specifications, images and descriptions are illustrative and may change.</p>
          <h2>Intellectual property</h2>
          <p>The Empire Cigars name, logos, emblems, band and packaging designs and website content are the property of their owner. Trademark registration status will be stated here once confirmed.</p>
          <h2>Historical references</h2>
          <p>Collection names refer to historical empires and figures as a source of inspiration. They do not imply any affiliation with, or endorsement by, any state, institution, family or community.</p>
          <h2>Health</h2>
          <p>Tobacco products are harmful to health. Nothing on this website is a health claim or a suggestion that any tobacco product is safe.</p>
          <h2>Operator and governing law</h2>
          <p className="muted">[Company legal name, registered address, registration number and governing law — to be supplied.]</p>
        </div>
      </section>
    </>
  );
}
