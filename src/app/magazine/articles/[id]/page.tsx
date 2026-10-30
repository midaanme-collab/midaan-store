'use client';

import React from 'react';
import { ARTICLES } from '@/constants/articles';
import { useParams, notFound } from 'next/navigation';
import { useStore } from '@/store';
import ArticleDetailView from '@/components/ArticleDetailView';

export default function ArticlePage() {
  const { id } = useParams();
  const { lang } = useStore();
  
  const article = ARTICLES.find(a => a.id === id);
  if (!article) return notFound();

  return <ArticleDetailView article={article} lang={lang === 'en' ? 'en' : 'ar'} />;
}
