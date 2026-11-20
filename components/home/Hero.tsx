import ChartConsole from '@/components/home/ChartConsole';
import HeroMast from '@/components/home/HeroMast';
import ActionLink from '@/components/ui/ActionLink';
import { CV_HREF, HERO_ACTIONS_ID } from '@/content/sections';
import { contactChannel, nameLines } from '@/content/selectors';
import type { ChartView, HeroShot, Profile, Proof } from '@/content/types';

type HeroProfile = Pick<
  Profile,
  'name' | 'role' | 'employer' | 'location' | 'headline' | 'pitch' | 'proof' | 'coreStack' | 'contact'
>;

type Props = { profile: HeroProfile; shots: HeroShot[]; charts: ChartView[] };

// Designed so that on a phone the first screen holds: who (name, role), the headline and pitch,
// the two actions that matter (CV, email) and the proof tiles (D06). The photo masthead is kept
// short on phones for that reason; the chart console comes after the proof tiles there.
export default function Hero({ profile, shots, charts }: Props) {
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
                <span className="delivery__ball" />
              </span>
            </span>
          </span>
        </h1>
      </HeroMast>
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__headline">{profile.headline}</p>
          <p className="hero__pitch">{profile.pitch}</p>
          <HeroActions contact={profile.contact} />
        </div>
        <ChartConsole views={charts} />
        <ProofTiles proof={profile.proof} />
        <CoreStack items={profile.coreStack} />
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
