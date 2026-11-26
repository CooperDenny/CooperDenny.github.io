import Logo from '@/components/ui/Logo';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/content/sections';
import type { Education as EducationData } from '@/content/types';
import { dateRange } from '@/lib/format';

/** Education section: the degree as one ruled row, dates in the left column. */
export default function Education({ education: edu }: { education: EducationData }) {
  return (
    <Section section={SECTIONS.education}>
      <div className="ledger">
        <article className="ledger__row edu">
          <p className="ledger__meta">
            <span className="figure">{dateRange(edu.start, edu.end)}</span>
          </p>
          <div className="ledger__body">
            <div className="entry__head">
              <Logo src={edu.logo} alt={`${edu.institution} logo`} width={120} height={64} wide />
              <div>
                <h3>{edu.degree}</h3>
                <p className="entry__org">{edu.institution}</p>
              </div>
            </div>
            <p className="edu__result">{edu.result}</p>
            <p className="edu__detail">{edu.detail}</p>
          </div>
        </article>
      </div>
    </Section>
  );
}
