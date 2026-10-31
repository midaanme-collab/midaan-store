import React from 'react';
import { ARTICLES } from '@/constants/articles';
import { notFound } from 'next/navigation';
import ArticleDetailView from '@/components/ArticleDetailView';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);
  if (!article) return {};

  const canonicalUrl = `https://midaan-store.midaanme.workers.dev/magazine/ar/articles/${article.id}`;
  const enUrl = `https://midaan-store.midaanme.workers.dev/magazine/en/articles/${article.id}`;

  return {
    title: `${article.titleAr} | مجلة ميدان`,
    description: article.excerptAr,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: canonicalUrl,
        en: enUrl,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      title: `${article.titleAr} | مجلة ميدان`,
      description: article.excerptAr,
      url: canonicalUrl,
      siteName: 'مجلة ميدان',
      locale: 'ar_JO',
      type: 'article',
      images: [
        {
          url: '/magazine/issue-zero-cover-thumb.png',
          width: 849,
          height: 1200,
          alt: `${article.titleAr} - مجلة ميدان`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.titleAr} | مجلة ميدان`,
      description: article.excerptAr,
      images: ['/magazine/issue-zero-cover-thumb.png'],
    },
  };
}

export default async function ArabicArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);
  if (!article) return notFound();

  return <ArticleDetailView article={article} lang="ar" />;
}
