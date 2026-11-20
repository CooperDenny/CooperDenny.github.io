// Sections of the printable CV (app/(site)/cv/page.tsx). Each takes only the data it renders.

import type { ReactNode } from 'react';
import Icon from '@/components/ui/Icon';
import PrintButton from '@/components/resume/PrintButton';
import { contactChannel } from '@/content/selectors';
import type { Education, Job, Profile, ResumeEntry, SkillGroup } from '@/content/types';
import { dateRange } from '@/lib/format';
import { prettyUrl } from '@/lib/links';

/** Screen-only bar above the CV: back link and Save as PDF (hidden when printing). */
export function ResumeToolbar() {
  return (
    <div className="container resume-toolbar">
      <a href="/" className="text-link">
        <Icon name="arrowLeft" /> Back to site
      </a>
      <PrintButton />
    </div>
  );
}

function ResumeSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="resume__section">
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

type HeaderProfile = Pick<Profile, 'name' | 'role' | 'location' | 'contact'>;

/** Name, role and contact lines. */
export function ResumeHeader({ profile, siteUrl }: { profile: HeaderProfile; siteUrl: string }) {
  const links = [
    { href: contactChannel(profile.contact, 'email').href, text: profile.contact.email },
    ...(['linkedin', 'github'] as const).map((key) => {
      const { href } = contactChannel(profile.contact, key);
      return { href, text: prettyUrl(href) };
    }),
    { href: siteUrl, text: prettyUrl(siteUrl) },
  ];
  return (
    <header className="resume__header">
      <div>
        <h1>{profile.name}</h1>
        <p className="resume__role">
          {profile.role} · {profile.location}
        </p>
      </div>
      <ul className="resume__contact">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.text}</a>
          </li>
        ))}
      </ul>
    </header>
  );
}

/** The opening paragraph. */
export function ResumeSummary({ text }: { text: string }) {
  return (
    <ResumeSection>
      <p className="resume__summary">{text}</p>
    </ResumeSection>
  );
}

/** Every job, each role with its dates, and highlights. */
export function ResumeExperience({ jobs }: { jobs: Job[] }) {
  return (
    <ResumeSection title="Experience">
      {jobs.map((job) => (
        <div key={job.company} className="resume__item">
          <div className="resume__item-head">
            <h3>
              {job.company} <span className="resume__muted">· {job.employmentType}</span>
            </h3>
          </div>
          {job.roles.map((r) => (
            <div key={r.title} className="resume__role-line">
              <span>{r.title}</span>
              <span className="resume__muted">{dateRange(r.start, r.end)}</span>
            </div>
          ))}
          <BulletList items={job.highlights} />
        </div>
      ))}
    </ResumeSection>
  );
}

/** Prepared project entries (see `resumeProjects()` in content/selectors.ts). */
export function ResumeProjects({ entries }: { entries: ResumeEntry[] }) {
  return (
    <ResumeSection title="Projects">
      {entries.map((e) => (
        <div key={e.title} className="resume__item">
          <div className="resume__item-head">
            <h3>{e.title}</h3>
            <span className="resume__muted">{e.tagline}</span>
          </div>
          <BulletList items={e.bullets} />
        </div>
      ))}
    </ResumeSection>
  );
}

/** The degree, its dates and result. */
export function ResumeEducation({ education }: { education: Education }) {
  return (
    <ResumeSection title="Education">
      <div className="resume__item">
        <div className="resume__role-line">
          <h3>
            {education.degree}, {education.institution}
          </h3>
          <span className="resume__muted">{dateRange(education.start, education.end)}</span>
        </div>
        <p>{education.result}</p>
      </div>
    </ResumeSection>
  );
}

/** Skill groups as comma-separated lines. */
export function ResumeSkills({ groups }: { groups: SkillGroup[] }) {
  return (
    <ResumeSection title="Skills">
      <dl className="resume__skills">
        {groups.map((g) => (
          <div key={g.label}>
            <dt>{g.label}</dt>
            <dd>{g.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </ResumeSection>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
