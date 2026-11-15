import Logo from '@/components/ui/Logo';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/content/sections';
import type { Education as EducationData } from '@/content/types';
import { dateRange } from '@/lib/format';

export default function Education({ education: edu }: { education: EducationData }) {
  return (
    <Section section={SECTIONS.education} tone="alt">
      <article className="edu card">
        <Logo src={edu.logo} alt={`${edu.institution} logo`} width={120} height={64} wide />
        <div className="edu__body">
          <h3>{edu.degree}</h3>
          <p className="job__company">{edu.institution}</p>
          <p className="job__dates">{dateRange(edu.start, edu.end)}</p>
          <p className="edu__result">{edu.result}</p>
          <p className="edu__detail">{edu.detail}</p>
        </div>
      </article>
    </Section>
  );
}
