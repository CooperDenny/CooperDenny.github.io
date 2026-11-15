type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: 'default' | 'alt';
  children: React.ReactNode;
};

export default function Section({ id, eyebrow, title, intro, tone = 'default', children }: SectionProps) {
  return (
    <section id={id} className={`section${tone === 'alt' ? ' section--alt' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <header className="section__header">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
          {intro && <p className="section__intro">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
