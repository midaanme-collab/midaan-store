'use client';

import React from 'react';
import { ShoppingBag, Play, BookOpen } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import MidaanLogo from './MidaanLogo';

export default function Hero() {
  const { lang } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  return (
    <section className="relative z-10 pt-16 md:pt-24 pb-20 px-6 max-w-5xl mx-auto text-center">
      {/* Enlarged Bold Midaan Logo in Hero */}
      <div className="flex justify-center mb-8">
        <MidaanLogo size="hero" />
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#262626] bg-[#0A0A0A] text-xs font-medium text-neutral-300 mb-8 font-mono tracking-normal">
        <span className="text-[#D80032] font-bold">●</span>
        <span>{strings.tagline}</span>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-normal text-white mb-6 leading-tight font-sans">
        {isRtl ? "ميدان: مساحة التعبير، الفنون والمناصرة" : "MIDAAN: SPACE FOR EXPRESSION, ARTS & ADVOCACY"}
      </h1>

      <p className="max-w-2xl mx-auto text-neutral-400 text-sm md:text-base leading-relaxed mb-10 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
        {isRtl 
          ? "مؤسسة مجتمعية رائدة تجمع بين الاقتصاد الإبداعي والعمل المدني في الأردن. تمكين الشباب والمبدعين من خلال المناصرة عبر الأزياء، السرديات البصرية، والنشر المستقل."
          : "A pioneering social enterprise merging creative culture with civic action in Jordan. Empowering youth and activists through wearable advocacy, visual storytelling, and independent publishing."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="#drops"
          className="bg-[#D80032] hover:bg-[#B00028] text-white px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#D80032]/25 font-mono tracking-normal"
        >
          <ShoppingBag size={16} />
          <span>{isRtl ? "استعراض الإصدارات المحدودة" : "Shop Archive Drops"}</span>
        </a>
        <a
          href="#collab"
          className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-neutral-200 px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 font-mono tracking-normal"
        >
          <Play size={16} className="text-[#D80032]" />
          <span>{isRtl ? "فيديو الحملة (صوت وسردية)" : "Campaign Video"}</span>
        </a>
        <a
          href="#advocacy"
          className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-neutral-200 px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 font-mono tracking-normal"
        >
          <BookOpen size={16} className="text-[#D80032]" />
          <span>{isRtl ? "صوت ميدان" : "The Voice"}</span>
        </a>
      </div>
    </section>
  );
}
