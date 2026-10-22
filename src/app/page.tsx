'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import Studio from '@/components/Studio';
import Hub from '@/components/Hub';
import Voice from '@/components/Voice';
import Modals from '@/components/Modals';
import DropShowcase from '@/components/DropShowcase';
import ArticlesSection from '@/components/ArticlesSection';
import { useStore } from '@/store';

export default function Home() {
  const { hasEntered, setHasEntered } = useStore();

  if (!hasEntered) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-50 text-white" dir="ltr">
        <div className="text-center">
          <div className="text-sm font-mono text-[#D80032] mb-4 tracking-widest">[ SYSTEM BOOT ]</div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase font-sans">
            MIDAAN COLLECTIVE
          </h1>
          <button
            onClick={() => setHasEntered(true)}
            className="border border-[#262626] hover:border-white px-8 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-colors rounded-xl"
          >
            Enter Platform
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <Hero />
      <ArticlesSection />
      <DropShowcase lang="ar" />
      <Studio />
      <Hub />
      <Voice />
      <Modals />
    </PageLayout>
  );
}
