import type { ReactNode } from 'react';
import type { SectionDef } from '@/content/types';
import { cx } from '@/lib/format';

/** Eyebrow + heading + optional intro, without a wrapper (used by Section and by Contact's custom layout). */
export function SectionHeading({ section }: { section: SectionDef }) {
  return (
    <>
      <p className="eyebrow">{section.label}</p>
      <h2 id={`${section.id}-title`}>{section.title}</h2>
      {section.intro && <p className="section__intro">{section.intro}</p>}
    </>
  );
}

type SectionProps = {
  section: SectionDef;
  tone?: 'default' | 'alt';
  className?: string;
  /** Render children instead of the standard header + container layout. */
  bare?: boolean;
  children: ReactNode;
};

export default function Section({ section, tone = 'default', className, bare, children }: SectionProps) {
  const classes = cx('section', tone === 'alt' && 'section--alt', className);
  return (
    <section id={section.id} className={classes} aria-labelledby={`${section.id}-title`}>
      {bare ? (
        children
      ) : (
        <div className="container">
          <header className="section__header">
            <SectionHeading section={section} />
          </header>
          {children}
        </div>
      )}
    </section>
  );
}
