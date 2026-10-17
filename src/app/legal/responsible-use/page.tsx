import { PageHead } from '@/components/PageHead';
import { compliance, markets } from '@/config/compliance';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Age and Responsible Use', description: 'Empire Cigars is an adult tobacco brand. Our approach to age restrictions and health warnings.', path: '/legal/responsible-use/' });

export default function ResponsibleUsePage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Age and responsible use" crumbs={[{ label: 'Age and responsible use' }]} />
      <section className="section">
        <div className="container prose">
          <p>{compliance.generalNotice}</p>
          <h2>Age</h2>
          <p>
            Visitors are asked to confirm that they are at least {compliance.gateMinimumAge}, or the legal smoking age where they live if that is higher. This is a self-declaration, not age verification. Before any online sale, a verified age-check process appropriate to each market will be required.
          </p>
          <h2>Markets configured</h2>
          <table className="spec-table">
            <thead>
              <tr>
                <th scope="col">Market</th>
                <th scope="col">Minimum age</th>
                <th scope="col">Sales</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m) => (
                <tr key={m.code}>
                  <th scope="row">{m.name}</th>
                  <td>{m.minimumAge}</td>
                  <td>Not enabled</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted" style={{ marginTop: 'var(--space-4)' }}>
            These settings are placeholders pending legal review of each market’s rules on advertising, online sales, delivery and health warnings.
          </p>
          <h2>Health</h2>
          <p>We make no health claims. No tobacco product is safe, and cigars are not a safe alternative to cigarettes.</p>
        </div>
      </section>
    </>
  );
}
