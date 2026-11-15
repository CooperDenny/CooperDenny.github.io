import catalog from '@/content/projects.json';

// Typed access to content/projects.json — the canonical list of /projects/<slug>/
// pages, shared with scripts/project_pages so page titles are defined exactly once.

export type PageSlug = (typeof catalog.pages)[number]['slug'];

const bySlug = new Map(catalog.pages.map((p) => [p.slug, p]));

function page(slug: PageSlug) {
  const found = bySlug.get(slug);
  if (!found) throw new Error(`Unknown project page: ${slug}`);
  return found;
}

export const pageTitle = (slug: PageSlug) => page(slug).title;
export const pageHref = (slug: PageSlug) => `/projects/${slug}/`;
