import Icon, { type IconName } from '@/components/Icon';
import { profile } from '@/content/profile';

export default function Contact() {
  const { email, linkedin, github, x } = profile.contact;
  const channels: { href: string; icon: IconName; label: string; value: string; external: boolean }[] = [
    { href: `mailto:${email}`, icon: 'envelope', label: 'Email', value: email, external: false },
    { href: linkedin.href, icon: 'linkedin', label: 'LinkedIn', value: linkedin.handle, external: true },
    { href: github.href, icon: 'github', label: 'GitHub', value: github.handle, external: true },
    { href: x.href, icon: 'x', label: 'X', value: x.handle, external: true },
  ];

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__inner">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Let’s talk</h2>
          <p className="section__intro">
            Hiring for data science, analytics or analytics engineering? Email is the fastest way to reach me.
          </p>
          <div className="hero__ctas">
            <a href={`mailto:${email}`} className="btn btn--primary">
              <Icon name="envelope" /> Email me
            </a>
            <a href="/resume/" className="btn btn--ghost">
              <Icon name="fileLines" /> Résumé
            </a>
          </div>
        </div>
        <ul className="contact__list">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                className="contact__item"
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <Icon name={c.icon} />
                <span className="contact__label">{c.label}</span>
                <span className="contact__value">{c.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
