import Link from 'next/link';
import { PageHead } from '@/components/PageHead';
import { LegalDraftNotice } from '../LegalDraft';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Privacy Policy', description: 'How the Empire Cigars website handles personal data.', path: '/legal/privacy/' });

export default function PrivacyPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Privacy policy" crumbs={[{ label: 'Privacy policy' }]} />
      <section className="section">
        <div className="container prose">
          <LegalDraftNotice />
          <h2>What this website collects</h2>
          <p>In its current, catalog-only form the website does not ask for, collect or store personal data on a server. It has no accounts, no forms, no shop, no analytics and no advertising or social-media trackers.</p>
          <h2>What is stored on your device</h2>
          <p>
            When you confirm your age, the date of that confirmation is stored in your browser’s local storage so that you are not asked again for a limited period. It never leaves your device. You can view and clear it on the <Link href="/legal/cookies/">cookies and storage</Link> page.
          </p>
          <h2>Hosting</h2>
          <p>Like any website, the hosting provider processes technical data such as IP addresses in server logs to deliver pages and protect the service. The hosting provider and its data-processing terms will be named here before launch.</p>
          <h2>Changes</h2>
          <p>This policy will be rewritten before any feature that processes personal data — such as a contact form, newsletter, account or shop — is introduced.</p>
          <h2>Data controller</h2>
          <p className="muted">[Company legal name, registered address and privacy contact — to be supplied.]</p>
        </div>
      </section>
    </>
  );
}
