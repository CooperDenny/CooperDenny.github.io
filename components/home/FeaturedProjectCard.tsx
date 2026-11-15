import ActionLink from '@/components/ui/ActionLink';
import Bullets from '@/components/ui/Bullets';
import Chips from '@/components/ui/Chips';
import Icon from '@/components/ui/Icon';
import type { FeaturedProject, Metric } from '@/content/types';

/** The large featured project: metrics up front, method behind a disclosure. */
export default function FeaturedProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <article className="featured card">
      <p className="kicker">{project.kicker}</p>
      <h3>{project.title}</h3>
      <p className="featured__summary">{project.oneLiner}</p>
      <MetricTiles metrics={project.metrics} />
      <p className="metrics__caption">Scored on the 2024 season, which the model never saw in training.</p>
      <MethodDisclosure project={project} />
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

function MetricTiles({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="metrics" aria-label="Results on the held-out 2024 season">
      {metrics.map((m) => (
        <div key={m.short} className="metric" title={m.label}>
          <dt>{m.short}</dt>
          <dd>{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Native <details>: progressive disclosure that works without JS. Recruiters get the
// headline; hiring managers can open the method. Everything is in the HTML for crawlers.
function MethodDisclosure({ project }: { project: FeaturedProject }) {
  return (
    <details className="disclosure">
      <summary>
        Method, iteration &amp; evaluation <Icon name="chevronDown" className="disclosure__chevron" />
      </summary>
      <div className="disclosure__body">
        <h4>Question</h4>
        <p>{project.problem}</p>
        <h4>Approach</h4>
        <Bullets items={project.approach} />
        <h4>Iteration</h4>
        <p>{project.iteration}</p>
        <h4>Why not accuracy?</h4>
        <p>{project.evaluationNote}</p>
      </div>
    </details>
  );
}
