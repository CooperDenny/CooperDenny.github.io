'use client';

import { useEffect, useState } from 'react';
import ActionLink from '@/components/ui/ActionLink';
import { HERO_ACTIONS_ID, CV_HREF, SECTIONS } from '@/content/sections';

// Phone-only sticky action bar. Appears once the hero's own buttons have scrolled away and
// hides again when the Contact section (which has the same actions) is on screen, so the
// two primary actions are always exactly one tap away without ever being duplicated on screen.
// Purely additive: it never hides page content, and the page works the same without JS.
export default function MobileCta({ email }: { email: string }) {
  const shown = useStickyBarVisible(HERO_ACTIONS_ID, SECTIONS.contact.id);
  const tabIndex = shown ? 0 : -1;

  return (
    <div className={`mobile-cta${shown ? ' mobile-cta--shown' : ''}`} aria-hidden={!shown}>
      <ActionLink href={CV_HREF} variant="primary" icon="fileLines" tabIndex={tabIndex}>
        CV
      </ActionLink>
      <ActionLink href={`mailto:${email}`} variant="ghost" icon="envelope" tabIndex={tabIndex}>
        Email
      </ActionLink>
    </div>
  );
}

/** Visible after `afterId` has scrolled up out of view, and while `untilId` is not on screen. */
function useStickyBarVisible(afterId: string, untilId: string) {
  const [pastStart, setPastStart] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const start = document.getElementById(afterId);
    const end = document.getElementById(untilId);
    if (!start || !end || !('IntersectionObserver' in window)) return;

    const startObs = new IntersectionObserver(([e]) => setPastStart(!e.isIntersecting && e.boundingClientRect.top < 0));
    const endObs = new IntersectionObserver(([e]) => setAtEnd(e.isIntersecting), { threshold: 0 });
    startObs.observe(start);
    endObs.observe(end);
    return () => {
      startObs.disconnect();
      endObs.disconnect();
    };
  }, [afterId, untilId]);

  return pastStart && !atEnd;
}
