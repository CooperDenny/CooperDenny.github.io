import iconSet from '@/content/icons.json';

// Typed access to content/icons.json (shared with scripts/project_pages).
export const icons = iconSet.icons;
export type IconName = keyof typeof icons;
