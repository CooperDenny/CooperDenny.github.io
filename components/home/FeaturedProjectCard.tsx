import Icon from '@/components/ui/Icon';
import SmartLink from '@/components/ui/SmartLink';
import Tools from '@/components/ui/Tools';
import { resultRows } from '@/content/selectors';
import type { FeaturedProject, Metric } from '@/content/types';

/**
 * The one featured project (the Brownlow model, one entry for every season, D11): the claim,
 * a small results table and a link to each season's write-up. Never headline accuracy.
 */
export default function FeaturedProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <article className="featured">
      <div className="featured__copy">
        <h3>{project.title}</h3>
        <p className="featured__summary">{project.oneLiner}</p>
        <Tools items={project.stack} />
        <ul className="featured__links">
          {project.links.map((l) => (
            <li key={l.href}>
              <SmartLink href={l.href} className="text-link">
                {l.label} <Icon name="arrowRight" />
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
      <ResultsTable metrics={resultRows(project)} caption={project.resultsCaption} />
    </article>
  );
}

// A scorebook table: what was measured on the left, the figure on the right in tabular numerals.
function ResultsTable({ metrics, caption }: { metrics: Metric[]; caption: string }) {
  return (
    <table className="results">
      <caption>{caption}</caption>
      <tbody>
        {metrics.map((m) => (
          <tr key={m.short}>
            <th scope="row">{m.label}</th>
            <td className="figure">{m.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
