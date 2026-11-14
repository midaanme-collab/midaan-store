'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, BookOpen } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';

export default function Hero() {
  const { lang } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  return (
    <section className="relative z-10 pt-14 pb-18 md:pt-16 md:pb-20 px-6 max-w-4xl mx-auto text-center" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-8 leading-tight font-sans tracking-normal text-balance">
        {strings.hero.title}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/#drops"
          className="bg-[#D80032] hover:bg-[#B00028] text-white px-8 py-3.5 text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#D80032]/25 font-sans"
        >
          <ShoppingBag size={16} />
          <span>{strings.campaign.shopBtn}</span>
        </Link>
        <Link
          href="/magazine"
          className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-neutral-100 hover:text-white px-8 py-3.5 text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 font-sans"
        >
          <BookOpen size={16} className="text-[#D80032]" />
          <span>{strings.hero.btnMagazine}</span>
        </Link>
      </div>
    </section>
  );
}
