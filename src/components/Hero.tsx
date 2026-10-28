'use client';

import React from 'react';
import { Sliders, BookOpen } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';

export default function Hero() {
  const { lang } = useStore();
  const strings = content[lang as keyof typeof content];
  
  return (
    <section className="relative z-10 pt-20 pb-24 px-6 max-w-5xl mx-auto text-center">


      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-normal text-white mb-6 leading-tight uppercase font-sans">
        {strings.heroTitle}
      </h1>

      <p className="max-w-2xl mx-auto text-neutral-400 text-sm md:text-base leading-relaxed mb-10 font-sans">
        {lang === 'ar' ? 'اكتشف أرشيف التعاون وتصفح العدد صفر من المجلة المستقلة.' : 'Discover the collaboration archive and read Issue Zero of our independent magazine.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="/collab"
          className="bg-[#D80032] hover:bg-[#B00028] text-white px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#D80032]/25 font-mono uppercase tracking-normal"
        >
          <Sliders size={16} />
          <span>{lang === 'ar' ? 'اكتشف التعاون' : 'Discover Collaboration'}</span>
        </a>
        <a
          href="#voice"
          className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-neutral-200 px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 font-mono uppercase tracking-normal"
        >
          <BookOpen size={16} className="text-[#D80032]" />
          <span>{lang === 'ar' ? 'اقرأ المجلة' : 'Read the Magazine'}</span>
        </a>
      </div>
    </section>
  );
}
