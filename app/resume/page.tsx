import type { Metadata } from 'next';
import Icon from '@/components/Icon';
import PrintButton from '@/components/PrintButton';
import { education, experience, featuredProject, profile, projects, skills } from '@/content/profile';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Résumé — ${profile.name}, ${profile.role}`,
  description: `One-page résumé for ${profile.name}, ${profile.role} at ${profile.employer} in ${profile.location}.`,
  alternates: { canonical: '/resume/' },
};

// A print-optimised, single-column résumé rendered from the same content as the home page.
// "Save as PDF" uses the browser's print dialog; @media print in globals.css hides site chrome.
export default function ResumePage() {
  const { contact } = profile;
  const siteHost = siteConfig.url.replace(/^https?:\/\//, '');
  const resumeProjects = projects.slice(0, 1);

  return (
    <div className="resume-page">
      <div className="container resume-toolbar">
        <a href="/" className="text-link">
          <Icon name="arrowLeft" /> Back to site
        </a>
        <PrintButton />
      </div>

      <article className="resume">
        <header className="resume__header">
          <div>
            <h1>{profile.name}</h1>
            <p className="resume__role">
              {profile.role} · {profile.location}
            </p>
          </div>
          <ul className="resume__contact">
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <a href={contact.linkedin.href}>linkedin.com/{contact.linkedin.handle}</a>
            </li>
            <li>
              <a href={contact.github.href}>github.com/{contact.github.handle}</a>
            </li>
            <li>
              <a href={siteConfig.url}>{siteHost}</a>
            </li>
          </ul>
        </header>

        <section className="resume__section">
          <p className="resume__summary">{profile.resumeSummary}</p>
        </section>

        <section className="resume__section">
          <h2>Experience</h2>
          {experience.map((job) => (
            <div key={job.company} className="resume__item">
              <div className="resume__item-head">
                <h3>
                  {job.company} <span className="resume__muted">· {job.employmentType}</span>
                </h3>
              </div>
              {job.roles.map((r) => (
                <div key={r.title} className="resume__role-line">
                  <span>{r.title}</span>
                  <span className="resume__muted">
                    {r.start} – {r.end}
                  </span>
                </div>
              ))}
              <ul>
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="resume__section">
          <h2>Projects</h2>
          <div className="resume__item">
            <div className="resume__item-head">
              <h3>{featuredProject.title}</h3>
              <span className="resume__muted">R · ordinal regression</span>
            </div>
            <ul>
              <li>{featuredProject.summary}</li>
              <li>
                Held-out 2024 season: r = 0.93 between predicted and actual season tallies, MAE of 2.0 votes per
                player, and the 3-vote player identified in 56% of games.
              </li>
              <li>{featuredProject.iteration}</li>
            </ul>
          </div>
          {resumeProjects.map((p) => (
            <div key={p.slug} className="resume__item">
              <div className="resume__item-head">
                <h3>{p.title}</h3>
                <span className="resume__muted">{p.stack.join(' · ')}</span>
              </div>
              <ul>
                <li>{p.summary}</li>
              </ul>
            </div>
          ))}
        </section>

        <section className="resume__section">
          <h2>Education</h2>
          <div className="resume__item">
            <div className="resume__role-line">
              <h3>
                {education.degree}, {education.institution}
              </h3>
              <span className="resume__muted">
                {education.start} – {education.end}
              </span>
            </div>
            <p>{education.result}</p>
          </div>
        </section>

        <section className="resume__section">
          <h2>Skills</h2>
          <dl className="resume__skills">
            {/* Tooling (Jira, VS Code, …) is low-signal on paper; it stays on the web page only. */}
            {skills.filter((g) => g.label !== 'Tooling').map((g) => (
              <div key={g.label}>
                <dt>{g.label}</dt>
                <dd>{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </div>
  );
}
