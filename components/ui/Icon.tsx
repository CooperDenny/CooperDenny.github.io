import { icons, type IconName } from '@/content/icons';

// Inline SVG icons (no icon font). Paths live in content/icons.json, which the
// project-page generator (scripts/project_pages) reads too — one source for both.

export type { IconName };

/** An inline SVG icon; decorative (`aria-hidden`), so label its button or link instead. */
export default function Icon({ name, className }: { name: IconName; className?: string }) {
  const [viewBox, d] = icons[name];
  return (
    <svg className={`icon${className ? ` ${className}` : ''}`} viewBox={viewBox} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={d} />
    </svg>
  );
}
