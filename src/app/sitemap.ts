import { MetadataRoute } from 'next';
import { ARTICLES } from '@/constants/articles';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://midaan.net';
  const now = new Date('2026-10-01T00:00:00.000Z');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ar: `${baseUrl}/`,
          en: `${baseUrl}/`,
          'x-default': `${baseUrl}/`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/about`,
          en: `${baseUrl}/about`,
          'x-default': `${baseUrl}/about`,
        },
      },
    },
    {
      url: `${baseUrl}/products/drop-helmet-white`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          ar: `${baseUrl}/products/drop-helmet-white`,
          en: `${baseUrl}/products/drop-helmet-white`,
          'x-default': `${baseUrl}/products/drop-helmet-white`,
        },
      },
    },
    {
      url: `${baseUrl}/products/drop-poster-white`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          ar: `${baseUrl}/products/drop-poster-white`,
          en: `${baseUrl}/products/drop-poster-white`,
          'x-default': `${baseUrl}/products/drop-poster-white`,
        },
      },
    },
    {
      url: `${baseUrl}/magazine`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          ar: `${baseUrl}/magazine`,
          en: `${baseUrl}/magazine`,
          'x-default': `${baseUrl}/magazine`,
        },
      },
    },
    {
      url: `${baseUrl}/magazine/issue-zero`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/magazine/issue-zero`,
          en: `${baseUrl}/magazine/issue-zero`,
          'x-default': `${baseUrl}/magazine/issue-zero`,
        },
      },
    },
  ];

  const articleRoutes: MetadataRoute.Sitemap = [];

  for (const art of ARTICLES) {
    const arUrl = `${baseUrl}/magazine/ar/articles/${art.id}`;
    const enUrl = `${baseUrl}/magazine/en/articles/${art.id}`;

    articleRoutes.push({
      url: arUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          ar: arUrl,
          en: enUrl,
          'x-default': arUrl,
        },
      },
    });

    articleRoutes.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          ar: arUrl,
          en: enUrl,
          'x-default': arUrl,
        },
      },
    });
  }

  return [...staticRoutes, ...articleRoutes];
}
