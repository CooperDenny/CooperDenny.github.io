import Icon from '@/components/ui/Icon';

/**
 * Light/dark switch. Deliberately stateless: lib/theme.js (inlined in <head>) owns the theme
 * and handles clicks on any [data-theme-toggle] element; CSS shows the sun in dark mode
 * ("switch to light") and the moon in light mode. Works identically on the static project pages.
 */
export default function ThemeToggle() {
  return (
    <button type="button" className="theme-toggle" data-theme-toggle aria-label="Toggle light and dark theme" title="Toggle light and dark theme">
      <Icon name="sun" className="theme-toggle__sun" />
      <Icon name="moon" className="theme-toggle__moon" />
    </button>
  );
}
