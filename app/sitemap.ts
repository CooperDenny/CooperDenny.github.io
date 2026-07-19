import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = siteConfig;

  return [
    {
      url: `${url}/`,
      lastModified: '2026-06-04',
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${url}/projects/afl-brownlow-2024/`,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${url}/projects/afl-brownlow-2023/`,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${url}/projects/eildon-park-cricket-club/`,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${url}/projects/h2h-arbitrage-finder/`,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${url}/projects/melbourne-pedestrian-counting/`,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${url}/projects/victorian-property-prices-dashboard/`,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];
}
