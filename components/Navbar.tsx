'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';

// Links are absolute ("/#experience") so they work from /resume as well as the home page.
const links = [
  { href: '/#experience', label: 'Experience' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#education', label: 'Education' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`} aria-label="Primary">
      <div className="nav__inner">
        <a href="/" className="nav__brand">
          Cooper Denny
        </a>

        <ul id="nav-menu" className={`nav__links${open ? ' nav__links--open' : ''}`}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li className="nav__resume-mobile">
            <a href="/resume/" onClick={() => setOpen(false)}>
              Résumé
            </a>
          </li>
        </ul>

        <div className="nav__actions">
          <a href="/resume/" className="btn btn--small btn--primary nav__resume">
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
