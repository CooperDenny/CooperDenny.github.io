import catalog from '@/content/projects.json';

// Typed access to content/projects.json — the canonical, ordered list of /projects/<slug>/
// pages, shared with scripts/project_pages so page titles are defined exactly once.

/**
 * A project-page slug. JSON imports widen strings, so this is plain `string` at compile
 * time; an unknown slug is caught at build time instead (pageTitle throws, failing the build).
 */
export type PageSlug = string;

/** One entry of content/projects.json. */
export type CatalogPage = { slug: PageSlug; title: string; teaser: string };

/** All project pages, in "Next project" order. */
export const catalogPages: readonly CatalogPage[] = catalog.pages;

const bySlug = new Map(catalogPages.map((p) => [p.slug, p]));

function page(slug: PageSlug): CatalogPage {
  const found = bySlug.get(slug);
  if (!found) throw new Error(`Unknown project page "${slug}" — add it to content/projects.json`);
  return found;
}

/** The page's title, as defined in content/projects.json. */
export const pageTitle = (slug: PageSlug) => page(slug).title;

/** The page's URL path, e.g. "/projects/afl-brownlow-2024/". Validates the slug. */
export const pageHref = (slug: PageSlug) => `/projects/${page(slug).slug}/`;
