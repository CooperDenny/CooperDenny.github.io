'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';

type Theme = 'light' | 'dark';

// The inline script in app/layout.tsx sets body[data-theme] before hydration;
// this component reads it back on mount rather than guessing, so there's no flash.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
    setTheme(next);
  };

  const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={label} title={label}>
      <Icon name={theme === 'light' ? 'moon' : 'sun'} />
    </button>
  );
}
