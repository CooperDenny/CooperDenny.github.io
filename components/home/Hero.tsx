import ActionLink from '@/components/ui/ActionLink';
import CricketBall from '@/components/ui/CricketBall';
import { CV_HREF, HERO_ACTIONS_ID } from '@/content/sections';
import { contactChannel, nameLines } from '@/content/selectors';
import type { Profile } from '@/content/types';

type HeroProfile = Pick<
  Profile,
  'name' | 'role' | 'employer' | 'location' | 'portrait' | 'headline' | 'pitch' | 'contact'
>;

// Kept short: on a phone the photo sits beside the tags and the name is one line, so the first
// screen holds photo, name, role, headline, pitch and the two actions that matter (D06, D29).
// Every piece is a direct grid item of .hero__inner, which places them per breakpoint.
export default function Hero({ profile }: { profile: HeroProfile }) {
  const [first, rest] = nameLines(profile.name);
  const { portrait } = profile;
  return (
    <header className="hero">
      <div className="hero__inner">
        {/* Plain <img>: static export, no next/image optimisation (D01, D04). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero__photo"
          src={portrait.src}
          srcSet={`${portrait.srcSmall} 160w, ${portrait.src} ${portrait.width}w`}
          sizes="(min-width: 861px) 240px, (min-width: 600px) 88px, 72px"
          width={portrait.width}
          height={portrait.height}
          alt={profile.name}
          fetchPriority="high"
        />
        <p className="hero__eyebrow">
          <span className="tag">
            <span className="live" aria-hidden="true" />
            {profile.role} · {profile.employer}
          </span>
          <span className="tag tag--ghost">{profile.location}</span>
        </p>
        <h1 className="hero__name">
          <span className="hero__name-line">{first}</span>{' '}
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
    </header>
  );
}

function HeroActions({ contact }: { contact: HeroProfile['contact'] }) {
  // LinkedIn is the fastest way to reach Cooper, so it gets the labelled button (D30).
  const linkedin = contactChannel(contact, 'linkedin');
  const iconLinks = [contactChannel(contact, 'email'), contactChannel(contact, 'github')];
  return (
    <div className="hero__ctas" id={HERO_ACTIONS_ID}>
      <ActionLink href={CV_HREF} variant="primary" icon="fileLines">
        <span className="show-mobile">CV</span>
        <span className="hide-mobile">View CV</span>
      </ActionLink>
      <ActionLink href={linkedin.href} variant="ghost" icon={linkedin.icon}>
        {linkedin.label}
      </ActionLink>
      {iconLinks.map((ch) => (
        <ActionLink key={ch.key} href={ch.href} variant="ghost" icon={ch.icon} ariaLabel={ch.label} />
      ))}
    </div>
  );
}
