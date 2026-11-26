import ActionLink from '@/components/ui/ActionLink';
import CricketBall from '@/components/ui/CricketBall';
import { CV_HREF, HERO_ACTIONS_ID } from '@/content/sections';
import { contactChannel, nameLines } from '@/content/selectors';
import type { Profile } from '@/content/types';

type HeroProfile = Pick<
  Profile,
  'name' | 'role' | 'employer' | 'location' | 'portrait' | 'headline' | 'pitch' | 'contact'
>;

// Designed so that on a phone the first screen holds: who (photo, name, role), the headline
// and pitch, and the two actions that matter (CV, email) (D06, D28, D29).
export default function Hero({ profile }: { profile: HeroProfile }) {
  const [first, rest] = nameLines(profile.name);
  return (
    <header className="hero">
      <div className="hero__inner">
        {/* Plain <img>: static export, no next/image optimisation (D01, D04). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero__photo"
          src={profile.portrait.src}
          width={profile.portrait.width}
          height={profile.portrait.height}
          alt={profile.name}
          fetchPriority="high"
        />
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <span className="tag">
              <span className="live" aria-hidden="true" />
              {profile.role} · {profile.employer}
            </span>
            <span className="tag tag--ghost">{profile.location}</span>
          </p>
          <h1 className="hero__name">
            <span className="hero__name-line">{first}</span>
            <span className="hero__name-line">
              <span className="hero__name-ball">
                {rest}
                <span className="delivery" aria-hidden="true">
                  <span className="delivery__trail" />
                  <CricketBall className="delivery__ball" />
                </span>
              </span>
            </span>
          </h1>
          <p className="hero__headline">{profile.headline}</p>
          <p className="hero__pitch">{profile.pitch}</p>
          <HeroActions contact={profile.contact} />
        </div>
      </div>
    </header>
  );
}

function HeroActions({ contact }: { contact: HeroProfile['contact'] }) {
  const email = contactChannel(contact, 'email');
  const iconLinks = [contactChannel(contact, 'linkedin'), contactChannel(contact, 'github')];
  return (
    <div className="hero__ctas" id={HERO_ACTIONS_ID}>
      <ActionLink href={CV_HREF} variant="primary" icon="fileLines">
        <span className="show-mobile">CV</span>
        <span className="hide-mobile">View CV</span>
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
