'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import CampaignVideoSection from '@/components/CampaignVideoSection';
import DropShowcase from '@/components/DropShowcase';
import ArticlesSection from '@/components/ArticlesSection';
import Voice from '@/components/Voice';
import Modals from '@/components/Modals';

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <CampaignVideoSection />
      <DropShowcase lang="ar" />
      <ArticlesSection />
      <Voice />
      <Modals />
    </PageLayout>
  );
}
