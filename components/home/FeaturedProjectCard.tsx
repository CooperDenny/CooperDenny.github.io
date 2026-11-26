import ActionLink from '@/components/ui/ActionLink';
import Chips from '@/components/ui/Chips';
import { cardMetrics, metricPercent } from '@/content/selectors';
import type { FeaturedProject, Metric } from '@/content/types';

/** The large featured project: its headline result up front; the method lives on the write-ups. */
export default function FeaturedProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <article className="featured card">
      <h3>{project.title}</h3>
      <p className="featured__summary">{project.oneLiner}</p>
      <MetricMeters metrics={cardMetrics(project)} />
      <p className="metrics__caption">Scored on the 2024 season, which the model never saw in training.</p>
      <div className="featured__foot">
        <Chips items={project.stack} label="Tools used" />
        <div className="link-row">
          {project.links.map((l, i) => (
            <ActionLink key={l.href} href={l.href} variant={i === 0 ? 'primary' : 'ghost'} size="small" icon="arrowRight" iconEnd>
              {l.label}
            </ActionLink>
          ))}
        </div>
      </div>
    </article>
  );
}

// One row per card metric: label, a bar for percentages, and the value. The full
// description is the visible label, so the figure reads without any jargon.
function MetricMeters({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="metrics" aria-label="Results on the held-out 2024 season">
      {metrics.map((m) => {
        const pct = metricPercent(m);
        return (
          <div key={m.short} className="metric">
            <dt>{m.label}</dt>
            <dd>
              {pct !== undefined && (
                <span className="metric__bar" aria-hidden="true">
                  <span style={{ width: `${pct}%` }} />
                </span>
              )}
              <span className="metric__value">{m.value}</span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
