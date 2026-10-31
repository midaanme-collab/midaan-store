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

  const arUrl = `https://midaan-store.midaanme.workers.dev/magazine/ar/articles/${article.id}`;
  const canonicalUrl = `https://midaan-store.midaanme.workers.dev/magazine/en/articles/${article.id}`;

  return {
    title: `${article.titleEn} | Midaan Magazine`,
    description: article.excerptEn,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: arUrl,
        en: canonicalUrl,
        'x-default': arUrl,
      },
    },
    openGraph: {
      title: `${article.titleEn} | Midaan Magazine`,
      description: article.excerptEn,
      url: canonicalUrl,
      siteName: 'Midaan Magazine',
      locale: 'en_US',
      type: 'article',
      images: [
        {
          url: '/magazine/issue-zero-cover-thumb-en.png',
          width: 849,
          height: 1200,
          alt: `${article.titleEn} - Midaan Magazine`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.titleEn} | Midaan Magazine`,
      description: article.excerptEn,
      images: ['/magazine/issue-zero-cover-thumb-en.png'],
    },
  };
}

export default async function EnglishArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);
  if (!article) return notFound();

  return <ArticleDetailView article={article} lang="en" />;
}
