'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import { profile } from '@/content/profile';

// Phone-only sticky action bar. Appears once the hero's own buttons have scrolled away and
// hides again when the Contact section (which has the same actions) is on screen, so the
// two primary actions are always exactly one tap away without ever being duplicated on screen.
// Purely additive: it never hides page content, and the page works the same without JS.
export default function MobileCta() {
  const [heroGone, setHeroGone] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero-ctas');
    const contact = document.getElementById('contact');
    if (!hero || !contact || !('IntersectionObserver' in window)) return;

    const heroObs = new IntersectionObserver(([e]) => setHeroGone(!e.isIntersecting && e.boundingClientRect.top < 0));
    const contactObs = new IntersectionObserver(([e]) => setContactVisible(e.isIntersecting), { threshold: 0 });
    heroObs.observe(hero);
    contactObs.observe(contact);
    return () => {
      heroObs.disconnect();
      contactObs.disconnect();
    };
  }, []);

  const shown = heroGone && !contactVisible;

  return (
    <div className={`mobile-cta${shown ? ' mobile-cta--shown' : ''}`} aria-hidden={!shown}>
      <a href="/resume/" className="btn btn--primary" tabIndex={shown ? 0 : -1}>
        <Icon name="fileLines" /> Résumé
      </a>
      <a href={`mailto:${profile.contact.email}`} className="btn btn--ghost" tabIndex={shown ? 0 : -1}>
        <Icon name="envelope" /> Email
      </a>
    </div>
  );
}
