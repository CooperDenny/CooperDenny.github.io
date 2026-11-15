import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { catalogPages, pageHref } from '@/content/catalog';
import { RESUME_HREF } from '@/content/sections';

/**
 * sitemap.xml. Project pages come from content/projects.json, so a new project page
 * is listed automatically. `lastModified` is the build date (= last deploy).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = siteConfig;
  const built = new Date().toISOString().slice(0, 10);

  return [
    { url: `${url}/`, lastModified: built, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${url}${RESUME_HREF}`, lastModified: built, changeFrequency: 'monthly', priority: 0.9 },
    ...catalogPages.map((page) => ({
      url: `${url}${pageHref(page.slug)}`,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
