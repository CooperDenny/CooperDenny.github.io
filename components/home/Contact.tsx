import ActionLink from '@/components/ui/ActionLink';
import Icon from '@/components/ui/Icon';
import Section, { SectionHeading } from '@/components/ui/Section';
import SmartLink from '@/components/ui/SmartLink';
import { RESUME_HREF, SECTIONS } from '@/content/sections';
import { contactChannel, contactChannels } from '@/content/selectors';
import type { ContactChannel, ContactLinks } from '@/content/types';

/** Closing call to action plus every contact channel. */
export default function Contact({ contact }: { contact: ContactLinks }) {
  const email = contactChannel(contact, 'email');
  return (
    <Section section={SECTIONS.contact} className="contact" bare>
      <div className="container contact__inner">
        <div>
          <SectionHeading section={SECTIONS.contact} />
          <div className="hero__ctas">
            <ActionLink href={email.href} variant="primary" icon={email.icon}>
              Email me
            </ActionLink>
            <ActionLink href={RESUME_HREF} variant="ghost" icon="fileLines">
              Résumé
            </ActionLink>
          </div>
        </div>
        <ChannelList channels={contactChannels(contact)} />
      </div>
    </Section>
  );
}

function ChannelList({ channels }: { channels: ContactChannel[] }) {
  return (
    <ul className="contact__list">
      {channels.map((ch) => (
        <li key={ch.key}>
          <SmartLink href={ch.href} className="contact__item">
            <Icon name={ch.icon} />
            <span className="contact__label">{ch.label}</span>
            <span className="contact__value">{ch.display}</span>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}
