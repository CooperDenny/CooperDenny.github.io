import Section from '@/components/Section';
import { skills } from '@/content/profile';

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="What I work with">
      <dl className="skills">
        {skills.map((g) => (
          <div key={g.label} className="skills__row">
            <dt>{g.label}</dt>
            <dd>
              <ul className="chips">
                {g.items.map((i) => (
                  <li key={i} className="chip chip--lg">
                    {i}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
