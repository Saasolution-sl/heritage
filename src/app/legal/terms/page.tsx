import { PageHead } from '@/components/PageHead';
import { LegalDraftNotice } from '../LegalDraft';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Terms and Conditions', description: 'Terms for using the Heritage Cigars website.', path: '/legal/terms/' });

export default function TermsPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Terms and conditions" crumbs={[{ label: 'Terms and conditions' }]} />
      <section className="section">
        <div className="container prose">
          <LegalDraftNotice />
          <h2>Trade only</h2>
          <p>Heritage Cigars supplies the tobacco trade and does not sell to consumers. This website is intended only for professionals in the tobacco trade who are of legal smoking age in their country.</p>
          <h2>No offer for sale</h2>
          <p>The collections are in development. Nothing on this website is an offer to sell, and no orders, payments or deliveries are accepted through it. Specifications, images and descriptions are illustrative and may change; trade terms are agreed directly with trade partners.</p>
          <h2>Intellectual property</h2>
          <p>The Heritage Cigars name, logos, emblems, band and packaging designs and website content are the property of their owner. Trademark registration status will be stated here once confirmed.</p>
          <h2>Historical references</h2>
          <p>Collection names refer to historical empires and figures as a source of inspiration. They do not imply any affiliation with, or endorsement by, any state, institution, family or community.</p>
          <h2>Health</h2>
          <p>Tobacco products are harmful to health. Nothing on this website is a health claim or a suggestion that any tobacco product is safe.</p>
          <h2>Operator and governing law</h2>
          <p className="muted">Heritage Cigars is being established in Ceuta (Spain) and Paraguay. [Company legal names, registered addresses, registration numbers and governing law — to be supplied.]</p>
        </div>
      </section>
    </>
  );
}
