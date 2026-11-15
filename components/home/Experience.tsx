import Bullets from '@/components/ui/Bullets';
import Chips from '@/components/ui/Chips';
import Logo from '@/components/ui/Logo';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/content/sections';
import { currentRole, previousRoles, tenure } from '@/content/selectors';
import type { Job, Role } from '@/content/types';
import { dateRange } from '@/lib/format';

/** Experience section: one card per job, most recent first. */
export default function Experience({ jobs }: { jobs: Job[] }) {
  return (
    <Section section={SECTIONS.experience}>
      <ol className="timeline">
        {jobs.map((job) => (
          <JobCard key={job.company} job={job} />
        ))}
      </ol>
    </Section>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <li className="job card">
      <JobHeader job={job} />
      {previousRoles(job).map((role) => (
        <Promotion key={role.title} from={role} />
      ))}
      <p className="job__summary">{job.summary}</p>
      <Bullets items={job.highlights} />
      <Chips items={job.stack} label="Tools used" />
    </li>
  );
}

function JobHeader({ job }: { job: Job }) {
  return (
    <div className="job__head">
      <Logo src={job.logo} alt={job.logoAlt} width={56} height={56} />
      <div className="job__title">
        <h3>{currentRole(job).title}</h3>
        <p className="job__company">{job.company}</p>
        <p className="job__dates">
          {tenure(job)} <span className="job__type">· {job.employmentType}</span>
        </p>
      </div>
    </div>
  );
}

function Promotion({ from }: { from: Role }) {
  return (
    <p className="job__promo">
      <span className="job__promo-badge">Promoted</span>
      from {from.title} ({dateRange(from.start, from.end)})
    </p>
  );
}
