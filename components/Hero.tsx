import { profile } from '@/content/profile';

export default function Hero() {
  const { contact } = profile;

  return (
    <header className="hero">
      <div className="container hero__grid">
        <div className="hero__text">
          <p className="eyebrow">
            {profile.role} · {profile.employer} · {profile.location}
          </p>
          <h1>{profile.name}</h1>
          <p className="hero__headline">{profile.headline}</p>
          <p className="hero__pitch">{profile.pitch}</p>

          <div className="hero__ctas">
            <a href="/resume/" className="btn btn--primary">
              <i className="fas fa-file-lines" aria-hidden="true"></i> View résumé
            </a>
            <a href={`mailto:${contact.email}`} className="btn btn--ghost">
              <i className="fas fa-envelope" aria-hidden="true"></i> Email me
            </a>
            <a href={contact.linkedin.href} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin" aria-hidden="true"></i> LinkedIn
            </a>
            <a href={contact.github.href} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github" aria-hidden="true"></i> GitHub
            </a>
          </div>
        </div>

        <div className="hero__photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={576} height={576} />
        </div>
      </div>

      <div className="container">
        <dl className="facts">
          {profile.quickFacts.map((f) => (
            <div key={f.label} className="facts__item">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
