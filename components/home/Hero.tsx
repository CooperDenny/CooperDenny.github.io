import ActionLink from '@/components/ui/ActionLink';
import { HERO_ACTIONS_ID, RESUME_HREF } from '@/content/sections';
import { contactChannel } from '@/content/selectors';
import type { Profile, Proof } from '@/content/types';

type HeroProfile = Pick<
  Profile,
  'name' | 'role' | 'employer' | 'location' | 'photoWebp' | 'avatarWebp' | 'headline' | 'pitch' | 'proof' | 'coreStack' | 'contact'
>;

// Designed so that on a phone the first screen holds: who (name, role), the pitch,
// the two actions that matter (résumé, email) and the first row of proof tiles.
export default function Hero({ profile }: { profile: HeroProfile }) {
  return (
    <header className="hero">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__text">
            <Identity profile={profile} />
            <p className="hero__headline">{profile.headline}</p>
            <p className="hero__pitch">{profile.pitch}</p>
            <HeroActions contact={profile.contact} />
          </div>
        </div>
        <ProofTiles proof={profile.proof} />
        <CoreStack items={profile.coreStack} />
      </div>
    </header>
  );
}

function Identity({ profile }: { profile: HeroProfile }) {
  return (
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
  );
}

function HeroActions({ contact }: { contact: HeroProfile['contact'] }) {
  const email = contactChannel(contact, 'email');
  const iconLinks = [contactChannel(contact, 'linkedin'), contactChannel(contact, 'github')];
  return (
    <div className="hero__ctas" id={HERO_ACTIONS_ID}>
      <ActionLink href={RESUME_HREF} variant="primary" icon="fileLines">
        <span className="show-mobile">Résumé</span>
        <span className="hide-mobile">View résumé</span>
      </ActionLink>
      <ActionLink href={email.href} variant="ghost" icon={email.icon}>
        Email
      </ActionLink>
      {iconLinks.map((ch) => (
        <ActionLink key={ch.key} href={ch.href} variant="ghost" icon={ch.icon} ariaLabel={`${ch.label} profile`} />
      ))}
    </div>
  );
}

function ProofTiles({ proof }: { proof: Proof[] }) {
  return (
    <ul className="proof" aria-label="Highlights">
      {proof.map((p) => (
        <li key={p.label}>
          <a href={p.href} className="proof__item">
            <span className="proof__value">{p.value}</span>
            <span className="proof__label">{p.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function CoreStack({ items }: { items: string[] }) {
  return (
    <p className="hero__stack">
      <span className="hero__stack-label">Core stack</span>
      {items.join(' · ')}
    </p>
  );
}
