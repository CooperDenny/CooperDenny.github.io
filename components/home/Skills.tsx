import Chips from '@/components/ui/Chips';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/content/sections';
import type { SkillGroup } from '@/content/types';

export default function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <Section section={SECTIONS.skills}>
      <dl className="skills">
        {groups.map((g) => (
          <div key={g.label} className="skills__row">
            <dt>{g.label}</dt>
            <dd>
              <Chips items={g.items} size="lg" />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
