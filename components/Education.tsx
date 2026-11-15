import Section from '@/components/Section';
import { education as edu } from '@/content/profile';

export default function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Education" tone="alt">
      <article className="edu card">
        <div className="job__logo job__logo--wide">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={edu.logo} alt={`${edu.institution} logo`} loading="lazy" width={120} height={64} />
        </div>
        <div className="edu__body">
          <h3>{edu.degree}</h3>
          <p className="job__company">{edu.institution}</p>
          <p className="job__dates">
            {edu.start} – {edu.end}
          </p>
          <p className="edu__result">{edu.result}</p>
          <p className="edu__detail">{edu.detail}</p>
        </div>
      </article>
    </Section>
  );
}
