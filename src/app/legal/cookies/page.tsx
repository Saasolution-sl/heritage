import { PageHead } from '@/components/PageHead';
import { StorageControls } from '@/components/StorageControls';
import { LegalDraftNotice } from '../LegalDraft';
import { compliance } from '@/config/compliance';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Cookies and Storage', description: 'What the Heritage Cigars website stores on your device, and how to clear it.', path: '/legal/cookies/' });

export default function CookiesPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Cookies and storage preferences" crumbs={[{ label: 'Cookies and storage' }]} />
      <section className="section">
        <div className="container prose">
          <LegalDraftNotice />
          <p>This website stores two items on your device, both needed to apply the trade-access rules of your country:</p>
          <table className="spec-table">
            <caption className="visually-hidden">Items stored on your device</caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Purpose and duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <code>{compliance.countryCookie}</code> (cookie)
                </th>
                <td>Two-letter code of the country your connection appears to come from, used to apply that country’s minimum age. Expires after 24 hours.</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>{compliance.storageKey}</code> (local storage)
                </th>
                <td>The date and country of your trade-access confirmation. Treated as valid for {compliance.rememberDays} days, or until your country changes.</td>
              </tr>
            </tbody>
          </table>
          <h2>Your preferences</h2>
          <StorageControls />
          <p className="muted" style={{ marginTop: 'var(--space-5)' }}>
            If analytics, marketing or embedded third-party content are ever added, a consent choice will appear here before anything is stored.
          </p>
        </div>
      </section>
    </>
  );
}
