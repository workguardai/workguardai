import type { MetadataRoute } from 'next';

const BASE = 'https://workguardai.com';

/** Public marketing routes only — app and auth routes are noindexed. */
const ROUTES = ['', '/how-it-works', '/features', '/pricing', '/about', '/iot', '/demo', '/contact', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
