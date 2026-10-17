import { PageHead } from '@/components/PageHead';
import { StorageControls } from '@/components/StorageControls';
import { LegalDraftNotice } from '../LegalDraft';
import { compliance } from '@/config/compliance';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Cookies and Storage', description: 'What the Empire Cigars website stores on your device, and how to clear it.', path: '/legal/cookies/' });

export default function CookiesPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Cookies and storage preferences" crumbs={[{ label: 'Cookies and storage' }]} />
      <section className="section">
        <div className="container prose">
          <LegalDraftNotice />
          <p>This website sets no cookies. It stores one item in your browser’s local storage:</p>
          <table className="spec-table">
            <caption className="visually-hidden">Items stored on your device</caption>
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>
                  <code>{compliance.storageKey}</code>
                </td>
              </tr>
              <tr>
                <th scope="row">Purpose</th>
                <td>Remembers that you confirmed you are of legal smoking age (strictly necessary for the age notice).</td>
              </tr>
              <tr>
                <th scope="row">Contents</th>
                <td>The date and time of your confirmation.</td>
              </tr>
              <tr>
                <th scope="row">Duration</th>
                <td>Treated as valid for {compliance.rememberDays} days; stays until you clear it.</td>
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
