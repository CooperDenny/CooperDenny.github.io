import type { ReactNode } from 'react';
import type { SectionDef } from '@/content/types';
import { cx } from '@/lib/format';

type SectionProps = {
  section: SectionDef;
  className?: string;
  children: ReactNode;
};

/**
 * A home-page `<section>`: id, accessible name and heading all come from its SectionDef.
 * Every section opens on the same ink rule and plain heading, like a new page of the scorebook (D32).
 */
export default function Section({ section, className, children }: SectionProps) {
  return (
    <section id={section.id} className={cx('section', className)} aria-labelledby={`${section.id}-title`}>
      <div className="container">
        <header className="section__header">
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          {section.intro && <p className="section__intro">{section.intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
