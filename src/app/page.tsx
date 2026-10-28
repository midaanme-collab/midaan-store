'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import Voice from '@/components/Voice';
import Modals from '@/components/Modals';
import DropShowcase from '@/components/DropShowcase';
import ArticlesSection from '@/components/ArticlesSection';

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <ArticlesSection />
      <DropShowcase lang="ar" />
      <Voice />
      <Modals />
    </PageLayout>
  );
}
