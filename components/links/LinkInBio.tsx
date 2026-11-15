import ThemeToggle from '@/components/layout/ThemeToggle';
import Icon from '@/components/ui/Icon';
import SmartLink from '@/components/ui/SmartLink';
import type { ContactChannel, Profile } from '@/content/types';

type Props = {
  profile: Pick<Profile, 'name' | 'role' | 'employer' | 'avatarWebp'>;
  channels: ContactChannel[];
};

/** A one-screen "link in bio" page: who I am, then one large button per channel. */
export default function LinkInBio({ profile, channels }: Props) {
  return (
    <main id="main" className="bio">
      <div className="bio__toggle">
        <ThemeToggle />
      </div>
      <BioHeader profile={profile} />
      <ul className="bio__links">
        {channels.map((ch) => (
          <li key={ch.key}>
            <BioLink channel={ch} />
          </li>
        ))}
      </ul>
    </main>
  );
}

function BioHeader({ profile }: Pick<Props, 'profile'>) {
  return (
    <header className="bio__header">
      {/* Plain <img>: static export has no image optimisation (decision D01). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="bio__avatar"
        src={profile.avatarWebp}
        alt={`Portrait of ${profile.name}`}
        width={160}
        height={160}
        fetchPriority="high"
      />
      <h1 className="bio__name">{profile.name}</h1>
      <p className="bio__role">
        {profile.role} at {profile.employer}
      </p>
    </header>
  );
}

function BioLink({ channel }: { channel: ContactChannel }) {
  return (
    <SmartLink href={channel.href} className="bio__link">
      <Icon name={channel.icon} />
      <span className="bio__label">{channel.label}</span>
      <span className="bio__value">{channel.display}</span>
      <Icon name="arrowRight" className="bio__arrow" />
    </SmartLink>
  );
}
