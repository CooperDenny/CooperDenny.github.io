import Section from '@/components/ui/Section';
import { SECTIONS } from '@/content/sections';
import type { SkillGroup } from '@/content/types';
import { commaList } from '@/lib/format';

/** Skills section: one ruled row per group, the skills as a plain comma-separated line (keyword-scannable). */
export default function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <Section section={SECTIONS.skills}>
      <dl className="ledger">
        {groups.map((g) => (
          <div key={g.label} className="ledger__row skills__row">
            <dt className="ledger__meta">{g.label}</dt>
            <dd className="ledger__body">{commaList(g.items)}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
