import Section from '@/components/Section';
import { featuredProject as fp, projects, type ProjectLink } from '@/content/profile';

function LinkRow({ links }: { links: ProjectLink[] }) {
  return (
    <div className="link-row">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="text-link"
          {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {l.label}{' '}
          <i className={`fas ${l.external ? 'fa-arrow-up-right-from-square' : 'fa-arrow-right'}`} aria-hidden="true"></i>
        </a>
      ))}
    </div>
  );
}

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      intro="Independent projects with public write-ups, code and data. The approach and the evaluation are shown, not just the final chart."
      tone="alt"
    >
      {/* The Brownlow model is one consolidated card covering both seasons — keep it that way. */}
      <article className="featured card">
        <div className="featured__main">
          <p className="kicker">{fp.kicker}</p>
          <h3>{fp.title}</h3>
          <p className="featured__summary">{fp.summary}</p>

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

          <ul className="chips" aria-label="Tools used">
            {fp.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
          <LinkRow links={fp.links} />
        </div>

        <aside className="featured__results" aria-label="Results on the held-out 2024 season">
          <p className="featured__results-label">Held-out 2024 season</p>
          <dl className="metrics">
            {fp.metrics.map((m) => (
              <div key={m.label} className="metric">
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
          <p className="featured__note">
            <i className="fas fa-circle-info" aria-hidden="true"></i> {fp.evaluationNote}
          </p>
        </aside>
      </article>

      <div className="project-grid">
        {projects.map((p) => (
          <article key={p.slug} className="project card">
            <p className="kicker">{p.kicker}</p>
            <h3>{p.title}</h3>
            <p className="project__summary">{p.summary}</p>
            <ul className="chips" aria-label="Tools used">
              {p.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
            <LinkRow links={p.links} />
          </article>
        ))}
      </div>
    </Section>
  );
}
