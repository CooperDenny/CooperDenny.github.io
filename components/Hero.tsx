import Icon from '@/components/Icon';
import { profile } from '@/content/profile';

// Designed so that on a phone the first screen holds: who (name, role), the pitch,
// the two actions that matter (résumé, email) and the first row of proof tiles.
export default function Hero() {
  const { contact } = profile;

  return (
    <header className="hero">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__text">
            <div className="hero__id">
              <picture className="hero__avatar">
                <source media="(min-width: 861px)" srcSet={profile.photoWebp} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatarWebp} alt={`Portrait of ${profile.name}`} width={160} height={160} />
              </picture>
              <div>
                <h1>{profile.name}</h1>
                <p className="hero__role">
                  {profile.role} · {profile.employer} · {profile.location}
                </p>
              </div>
            </div>

            <p className="hero__headline">{profile.headline}</p>
            <p className="hero__pitch">{profile.pitch}</p>

            <div className="hero__ctas" id="hero-ctas">
              <a href="/resume/" className="btn btn--primary">
                <Icon name="fileLines" /> <span className="show-mobile">Résumé</span>
                <span className="hide-mobile">View résumé</span>
              </a>
              <a href={`mailto:${contact.email}`} className="btn btn--ghost">
                <Icon name="envelope" /> Email
              </a>
              <a
                href={contact.linkedin.href}
                className="btn btn--ghost btn--icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                <Icon name="linkedin" />
              </a>
              <a
                href={contact.github.href}
                className="btn btn--ghost btn--icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
              >
                <Icon name="github" />
              </a>
            </div>
          </div>
        </div>

        <ul className="proof" aria-label="Highlights">
          {profile.proof.map((p) => (
            <li key={p.label}>
              <a href={p.href} className="proof__item">
                <span className="proof__value">{p.value}</span>
                <span className="proof__label">{p.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="hero__stack">
          <span className="hero__stack-label">Core stack</span>
          {profile.coreStack.join(' · ')}
        </p>
      </div>
    </header>
  );
}
