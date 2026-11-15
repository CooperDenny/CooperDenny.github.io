import Section from '@/components/Section';
import { experience } from '@/content/profile';

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I’ve worked">
      <ol className="timeline">
        {experience.map((job) => {
          const [current, ...previous] = job.roles;
          const first = job.roles[job.roles.length - 1];
          return (
            <li key={job.company} className="job card">
              <div className="job__head">
                <div className="job__logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={job.logo} alt={job.logoAlt} loading="lazy" width={56} height={56} />
                </div>
                <div className="job__title">
                  <h3>{current.title}</h3>
                  <p className="job__company">
                    {job.company}
                  </p>
                  <p className="job__dates">
                    {first.start} – {current.end} <span className="job__type">· {job.employmentType}</span>
                  </p>
                </div>
              </div>

              {previous.map((r) => (
                <p key={r.title} className="job__promo">
                  <span className="job__promo-badge">Promoted</span>
                  from {r.title} ({r.start} – {r.end})
                </p>
              ))}

              <p className="job__summary">{job.summary}</p>
              <ul className="bullets">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <ul className="chips" aria-label="Tools used">
                {job.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
