import Icon from '@/components/Icon';
import Section from '@/components/Section';
import { featuredProject as fp, projects } from '@/content/profile';

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      intro="Independent projects with public write-ups, code and data."
      tone="alt"
    >
      {/* The Brownlow model is one consolidated card covering both seasons — keep it that way. */}
      <article className="featured card">
        <p className="kicker">{fp.kicker}</p>
        <h3>{fp.title}</h3>
        <p className="featured__summary">{fp.oneLiner}</p>

        <dl className="metrics" aria-label="Results on the held-out 2024 season">
          {fp.metrics.map((m) => (
            <div key={m.short} className="metric" title={m.label}>
              <dt>{m.short}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
        <p className="metrics__caption">Scored on the 2024 season, which the model never saw in training.</p>

        {/* Native <details>: progressive disclosure that works without JS. Recruiters get the
            headline; hiring managers can open the method. Everything is in the HTML for crawlers. */}
        <details className="disclosure">
          <summary>
            Method, iteration &amp; evaluation <Icon name="chevronDown" className="disclosure__chevron" />
          </summary>
          <div className="disclosure__body">
            <h4>Question</h4>
            <p>{fp.problem}</p>
            <h4>Approach</h4>
            <ul className="bullets">
              {fp.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <h4>Iteration</h4>
            <p>{fp.iteration}</p>
            <h4>Why not accuracy?</h4>
            <p>{fp.evaluationNote}</p>
          </div>
        </details>

        <div className="featured__foot">
          <ul className="chips" aria-label="Tools used">
            {fp.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
          <div className="link-row">
            {fp.links.map((l, i) => (
              <a key={l.href} href={l.href} className={`btn ${i === 0 ? 'btn--primary' : 'btn--ghost'} btn--small`}>
                {l.label} <Icon name="arrowRight" />
              </a>
            ))}
          </div>
        </div>
      </article>

      <ul className="project-grid">
        {projects.map((p) => {
          const link = p.links[0];
          return (
            <li key={p.slug} className="project card">
              <p className="kicker">{p.kicker}</p>
              <h3>
                {/* Stretched link: the whole card is the tap target. */}
                <a
                  href={link.href}
                  className="project__link"
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {p.title}
                </a>
              </h3>
              <p className="project__summary">{p.oneLiner}</p>
              <div className="project__foot">
                <span className="project__stack">{p.stack.join(' · ')}</span>
                <span className="project__cta" aria-hidden="true">
                  <Icon name={link.external ? 'external' : 'arrowRight'} />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
