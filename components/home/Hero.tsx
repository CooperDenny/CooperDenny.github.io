import HeroMast from '@/components/home/HeroMast';
import ActionLink from '@/components/ui/ActionLink';
import CricketBall from '@/components/ui/CricketBall';
import { CV_HREF, HERO_ACTIONS_ID } from '@/content/sections';
import { contactChannel, nameLines } from '@/content/selectors';
import type { HeroShot, Profile } from '@/content/types';

type HeroProfile = Pick<Profile, 'name' | 'role' | 'employer' | 'location' | 'headline' | 'pitch' | 'contact'>;

type Props = { profile: HeroProfile; shots: HeroShot[] };

// Designed so that on a phone the first screen holds: who (name, role), the headline and pitch,
// and the two actions that matter (CV, email) (D06, D28). The photo masthead is kept short on phones for that reason.
export default function Hero({ profile, shots }: Props) {
  const [first, rest] = nameLines(profile.name);
  return (
    <header className="hero">
      <HeroMast shots={shots}>
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
      </HeroMast>
      <div className="hero__inner">
        <p className="hero__headline">{profile.headline}</p>
        <div className="hero__body">
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
