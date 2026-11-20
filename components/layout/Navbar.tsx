'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { RESUME_HREF } from '@/content/sections';

type NavItem = { label: string; href: string };
type Props = { brand: string; items: NavItem[] };

/** Sticky top bar: brand, section links (a menu on phones), Résumé. */
export default function Navbar({ brand, items }: Props) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(8);
  useEscapeKey(open, () => setOpen(false));
  const close = () => setOpen(false);

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`} aria-label="Primary">
      <div className="nav__inner">
        <a href="/" className="nav__brand">
          {brand}
        </a>

        <ul id="nav-menu" className={`nav__links${open ? ' nav__links--open' : ''}`}>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={close}>
                {item.label}
              </a>
            </li>
          ))}
          <li className="nav__resume-mobile">
            <a href={RESUME_HREF} onClick={close}>
              Résumé
            </a>
          </li>
        </ul>

        <div className="nav__actions">
          <a href={RESUME_HREF} className="btn btn--small btn--primary nav__resume">
            Résumé
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'xmark' : 'bars'} />
          </button>
        </div>
      </div>
    </nav>
  );
}

/** True once the page has scrolled past `threshold` pixels. */
function useScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

/** Calls `onEscape` when Escape is pressed while `active`. */
function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onEscape();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onEscape]);
}
