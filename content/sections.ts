import type { SectionDef } from '@/content/types';

// Single source for home-page sections. Each entry drives the section's anchor id,
// its nav link (label) and its heading. Headings are plain labels, like a scorebook's (D32). Reordering or adding a section
// is a change here, not in Navbar or the section components.
export const SECTIONS = {
  experience: { id: 'experience', label: 'Experience', title: 'Experience' },
  projects: { id: 'projects', label: 'Projects', title: 'Projects' },
  skills: { id: 'skills', label: 'Skills', title: 'Skills' },
  education: { id: 'education', label: 'Education', title: 'Education' },
  contact: {
    id: 'contact',
    label: 'Contact',
    title: 'Contact',
    intro: 'Hiring for data science, analytics or analytics engineering? LinkedIn is the fastest way to reach me.',
  },
} as const satisfies Record<string, SectionDef>;

/** A key of SECTIONS, e.g. `'experience'`. */
export type SectionKey = keyof typeof SECTIONS;

/** In-page anchor, e.g. "#experience". */
export const anchor = (key: SectionKey) => `#${SECTIONS[key].id}`;

/** Nav links are absolute ("/#experience") so they also work from /cv/. */
export const NAV_ITEMS = Object.values(SECTIONS).map((s) => ({ label: s.label, href: `/#${s.id}` }));

/** The hero's action row; the mobile sticky bar appears once it scrolls out of view. */
export const HERO_ACTIONS_ID = 'hero-ctas';

/** Label before the comma-separated tools line under each job and project. */
export const TOOLS_LABEL = 'Tools';

/** The CV route (with the trailing slash every route uses). */
export const CV_HREF = '/cv/';
