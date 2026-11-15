import Section from '@/components/Section';
import { experience } from '@/content/profile';

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I’ve worked">
      <ol className="timeline">
        {experience.map((job) => {
          const [current, ...previous] = job.roles;
          const tenure = `${job.roles[job.roles.length - 1].start} – ${current.end}`;
          return (
            <li key={job.company} className="job card">
              <div className="job__head">
                <div className="job__logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={job.logo} alt={job.logoAlt} loading="lazy" />
                </div>
                <div className="job__title">
                  <h3>{current.title}</h3>
                  <p className="job__company">
                    {job.company} <span className="job__type">· {job.employmentType}</span>
                  </p>
                </div>
                <p className="job__dates">{tenure}</p>
              </div>

              {previous.length > 0 && (
                <ul className="ladder" aria-label="Role progression">
                  {job.roles.map((r) => (
                    <li key={r.title}>
                      <span className="ladder__title">{r.title}</span>
                      <span className="ladder__dates">
                        {r.start} – {r.end}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

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
