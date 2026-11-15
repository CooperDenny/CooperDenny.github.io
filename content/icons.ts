import iconSet from '@/content/icons.json';

// Typed access to content/icons.json (shared with scripts/project_pages).
export const icons = iconSet.icons;
/** Name of an icon in content/icons.json, e.g. `'arrowRight'`. */
export type IconName = keyof typeof icons;
