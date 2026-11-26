import ActionLink from '@/components/ui/ActionLink';
import Icon from '@/components/ui/Icon';
import Section, { SectionHeading } from '@/components/ui/Section';
import SmartLink from '@/components/ui/SmartLink';
import { CV_HREF, SECTIONS } from '@/content/sections';
import { contactChannel, contactChannels } from '@/content/selectors';
import type { ContactChannel, ContactLinks } from '@/content/types';

/** Closing call to action plus every contact channel. */
export default function Contact({ contact }: { contact: ContactLinks }) {
  const linkedin = contactChannel(contact, 'linkedin');
  return (
    <Section section={SECTIONS.contact} className="contact" bare>
      <div className="container contact__inner">
        <div>
          <SectionHeading section={SECTIONS.contact} />
          <div className="hero__ctas">
            <ActionLink href={linkedin.href} variant="primary" icon={linkedin.icon}>
              Message me on LinkedIn
            </ActionLink>
            <ActionLink href={CV_HREF} variant="ghost" icon="fileLines">
              CV
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
