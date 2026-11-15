import { profile } from '@/content/profile';

export default function Contact() {
  const { email, linkedin, github, x } = profile.contact;
  const channels = [
    { href: `mailto:${email}`, icon: 'fas fa-envelope', label: 'Email', value: email, external: false },
    { href: linkedin.href, icon: 'fab fa-linkedin', label: 'LinkedIn', value: linkedin.handle, external: true },
    { href: github.href, icon: 'fab fa-github', label: 'GitHub', value: github.handle, external: true },
    { href: x.href, icon: 'fab fa-x-twitter', label: 'X', value: x.handle, external: true },
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
              <i className="fas fa-envelope" aria-hidden="true"></i> {email}
            </a>
            <a href="/resume/" className="btn btn--ghost">
              <i className="fas fa-file-lines" aria-hidden="true"></i> Résumé
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
                <i className={c.icon} aria-hidden="true"></i>
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
