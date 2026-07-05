import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep the authenticated product and auth screens out of the index.
      disallow: ['/dashboard', '/sites', '/alerts', '/settings', '/onboarding', '/login', '/signup', '/api/'],
    },
    sitemap: 'https://workguardai.com/sitemap.xml',
  };
}
