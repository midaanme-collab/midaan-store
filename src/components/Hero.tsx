'use client';

import React from 'react';
import { Sliders, BookOpen } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';

export default function Hero() {
  const { lang } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  return (
    <section className="relative z-10 pt-20 pb-24 px-6 max-w-5xl mx-auto text-center" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight font-sans tracking-normal text-balance">
        {strings.hero.title}
      </h1>

      <p className="max-w-2xl mx-auto text-neutral-300 text-base md:text-lg leading-relaxed mb-10 font-sans font-normal">
        {strings.hero.desc}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="/collab"
          className="bg-[#D80032] hover:bg-[#B00028] text-white px-8 py-3.5 text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#D80032]/25 font-sans"
        >
          <Sliders size={16} />
          <span>{strings.hero.btnCollab}</span>
        </a>
        <a
          href="/magazine"
          className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-neutral-100 hover:text-white px-8 py-3.5 text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 font-sans"
        >
          <BookOpen size={16} className="text-[#D80032]" />
          <span>{strings.hero.btnMagazine}</span>
        </a>
      </div>
    </section>
  );
}
