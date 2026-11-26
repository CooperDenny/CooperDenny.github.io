import Bullets from '@/components/ui/Bullets';
import Logo from '@/components/ui/Logo';
import Section from '@/components/ui/Section';
import Tools from '@/components/ui/Tools';
import { SECTIONS } from '@/content/sections';
import { currentRole, homeHighlights, previousRoles, tenure } from '@/content/selectors';
import type { Job, Role } from '@/content/types';
import { dateRange } from '@/lib/format';

/** Experience section: one ruled row per job, most recent first, dates in the left column. */
export default function Experience({ jobs }: { jobs: Job[] }) {
  return (
    <Section section={SECTIONS.experience}>
      <ol className="ledger">
        {jobs.map((job) => (
          <JobRow key={job.company} job={job} />
        ))}
      </ol>
    </Section>
  );
}

function JobRow({ job }: { job: Job }) {
  return (
    <li className="ledger__row job">
      <p className="ledger__meta">
        <span className="figure">{tenure(job)}</span>
        <span className="ledger__note">{job.employmentType}</span>
      </p>
      <div className="ledger__body">
        <div className="entry__head">
          <Logo src={job.logo} alt={job.logoAlt} width={56} height={56} />
          <div>
            <h3>{currentRole(job).title}</h3>
            <p className="entry__org">{job.company}</p>
          </div>
        </div>
        {previousRoles(job).map((role) => (
          <Promotion key={role.title} from={role} />
        ))}
        <p className="job__summary">{job.summary}</p>
        <Bullets items={homeHighlights(job)} />
        <Tools items={job.stack} />
      </div>
    </li>
  );
}

function Promotion({ from }: { from: Role }) {
  return (
    <p className="job__promo">
      Promoted from {from.title} <span className="figure">({dateRange(from.start, from.end)})</span>
    </p>
  );
}
