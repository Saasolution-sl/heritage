import { PageHead } from '@/components/PageHead';
import { compliance, countryRules, defaultRule } from '@/config/compliance';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Trade Access and Age', description: 'Heritage Cigars is a trade-only tobacco brand. How access to this website works in each country.', path: '/legal/responsible-use/' });

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' });
  } catch {
    return null;
  }
})();

export default function ResponsibleUsePage() {
  const rows = Object.entries(countryRules)
    .map(([code, rule]) => ({ code, name: regionNames?.of(code) ?? code, rule }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <PageHead eyebrow="Legal" title="Trade access and age" crumbs={[{ label: 'Trade access and age' }]} />
      <section className="section">
        <div className="container prose">
          <p>{compliance.generalNotice}</p>
          <h2>Trade only</h2>
          <p>Heritage Cigars sells only to businesses in the tobacco trade. Visitors are asked to confirm that they work in the trade and meet the minimum legal age of their country.</p>
          <h2>How the country is set</h2>
          <p>
            The site reads the country your connection appears to come from, as reported by the hosting provider, and applies that country’s minimum age. You can change the country in the access dialog. Where the country is unknown or not listed below, a minimum age of {defaultRule.minimumAge} applies.
          </p>
          <p>This is a self-declaration, not age or trade verification. Trade accounts are verified when they are opened.</p>
          <h2>Minimum ages applied</h2>
          <table className="spec-table">
            <thead>
              <tr>
                <th scope="col">Country</th>
                <th scope="col">Minimum age</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.code}>
                  <th scope="row">{r.name}</th>
                  <td>{r.rule.minimumAge}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Other countries</th>
                <td>{defaultRule.minimumAge}</td>
              </tr>
            </tbody>
          </table>
          <h2>Health</h2>
          <p>We make no health claims. No tobacco product is safe, and cigars are not a safe alternative to cigarettes.</p>
        </div>
      </section>
    </>
  );
}
