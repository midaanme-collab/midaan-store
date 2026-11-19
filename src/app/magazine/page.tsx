'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Download, ArrowLeft, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { trackDownloadPdf } from '@/utils/analytics';
import { FOUNDING_MANIFESTO, ARTICLES } from '@/constants/articles';

export default function MagazineLanding() {
  const { lang } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  const coverThumb = isRtl 
    ? '/magazine/issue-zero-cover-thumb.png' 
    : '/magazine/issue-zero-cover-thumb-en.png';

  return (
    <PageLayout>
      <div className="w-full bg-[#050505] min-h-screen py-20 px-4 md:px-8 font-sans border-t border-[#1A1A1A] relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-[#D80032] text-white px-3.5 py-1 text-xs font-bold rounded-full mb-4">
              <span>{strings.magazine.badge}</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-normal mb-4 font-sans leading-tight">
              {strings.magazine.heading}
            </h1>
            
            <p className="text-neutral-300 font-sans text-base md:text-lg max-w-2xl leading-relaxed">
              {strings.magazine.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Issue Zero Card */}
            <div className="md:col-span-8 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-[#262626] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row gap-6 items-center">
              {/* Cover Thumbnail */}
              <div className="w-full sm:w-1/2 max-w-[220px] flex-shrink-0">
                <div className="relative aspect-[1/1.414] rounded-xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.8)] border border-neutral-700/60 group">
                  <Image 
                    src={coverThumb} 
                    alt={strings.magazine.issueZeroTitle} 
                    width={400}
                    height={565}
                    priority
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Card Body & Actions */}
              <div className="flex-1 flex flex-col justify-between self-stretch py-2">
                <div>
                  <div className="text-xs font-bold text-[#D80032] uppercase mb-2 font-mono">
                    {isRtl ? 'الإصدار التأسيسي // خريف ٢٠٢٦' : 'FOUNDING ISSUE // AUTUMN 2026'}
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-sans leading-tight mb-3">
                    {isRtl ? 'العدد صفر: انتحاب' : 'Issue Zero: Entihab'}
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed mb-6">
                    {isRtl 
                      ? 'توثيق سردية الشارع، صراع الأرض والسماء، وسجل وصايا الخالدين. منصة للرواية المستقلة والتعبير المدني الحر.' 
                      : 'Documenting the street narrative, the conflict of earth and sky, and the testaments of the immortal.'}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-[#262626]">
                  <Link 
                    href="/magazine/issue-zero"
                    className="w-full bg-white hover:bg-neutral-200 text-black py-3.5 px-4 font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <BookOpen size={16} className="text-[#D80032]" />
                    <span>{strings.magazine.actionRead}</span>
                    {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </Link>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a 
                      href="/magazine/issue-zero.pdf"
                      download="Midaan_Magazine_Issue_Zero_AR.pdf"
                      onClick={() => trackDownloadPdf('ar')}
                      className="bg-[#141414] hover:bg-[#1C1C1C] text-neutral-200 hover:text-white border border-[#2A2A2A] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                    >
                      <Download size={13} className="text-[#D80032]" />
                      <span>{strings.magazine.actionDownloadAr}</span>
                    </a>

                    <a 
                      href="/magazine/issue-zero-en.pdf"
                      download="Midaan_Magazine_Issue_Zero_EN.pdf"
                      onClick={() => trackDownloadPdf('en')}
                      className="bg-[#141414] hover:bg-[#1C1C1C] text-neutral-200 hover:text-white border border-[#2A2A2A] py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                    >
                      <Download size={13} className="text-[#D80032]" />
                      <span>{strings.magazine.actionDownloadEn}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue One (Upcoming) */}
            <div className="md:col-span-4 bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-[#262626] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between opacity-70">
              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase mb-2">
                  {isRtl ? 'الإصدار القادم' : 'UPCOMING ISSUE'}
                </div>
                
                <h2 className="text-2xl font-black text-neutral-400 font-sans leading-tight mb-3">
                  {strings.magazine.comingSoonHeading}
                </h2>
                
                <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed mb-6">
                  {strings.magazine.comingSoonDesc}
                </p>
              </div>

              <button 
                disabled
                className="w-full bg-[#161616] text-neutral-500 border border-[#262626] cursor-not-allowed py-3 font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 mt-auto"
              >
                <span>{strings.magazine.comingSoonBtn}</span>
              </button>
            </div>

          </div>

          {/* Founding Manifesto: Entihab */}
          <div className="mt-16 bg-gradient-to-br from-[#141414] via-[#0F0F0F] to-[#0A0A0A] border border-[#262626] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 start-0 w-2 h-full bg-[#D80032]" />
            
            <div className="flex items-center gap-2.5 text-xs font-bold text-[#D80032] uppercase tracking-wider mb-3">
              <Sparkles size={14} />
              <span>{isRtl ? 'وثيقة الإطلاق والعهد' : 'Founding Covenant'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight mb-8">
              {isRtl ? FOUNDING_MANIFESTO.titleAr : FOUNDING_MANIFESTO.titleEn}
            </h2>

            <div className="space-y-6 text-neutral-300 font-sans leading-relaxed text-sm sm:text-base border-s-2 border-neutral-800 ps-6">
              {(isRtl ? FOUNDING_MANIFESTO.paragraphsAr : FOUNDING_MANIFESTO.paragraphsEn).map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "text-white font-semibold text-base sm:text-lg italic" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#222] flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
              <span className="font-medium">
                {isRtl ? 'هيئة تحرير مجلة ميدان — تشرين الأول / أكتوبر ٢٠٢٦' : 'Midaan Editorial Collective — October 2026'}
              </span>
              <Link 
                href="/magazine/issue-zero" 
                className="inline-flex items-center gap-1.5 text-white hover:text-[#D80032] font-bold transition-colors"
              >
                <span>{isRtl ? 'تصفح المجلة التفاعلية الكاملة' : 'Browse Full Interactive Reader'}</span>
                {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
              </Link>
            </div>
          </div>

          {/* Issue Zero Articles Directory */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#222]">
              <div>
                <h3 className="text-xl sm:text-3xl font-black text-white font-sans">
                  {isRtl ? 'مقالات وأبحاث العدد صفر' : 'Issue Zero Articles & Research'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  {isRtl ? '٤ أبحاث فكرية وتاريخية موثقة متوفرة باللغتين العربية والإنجليزية' : '4 documented intellectual & historical essays available in Arabic & English'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ARTICLES.map((art) => (
                <Link
                  key={art.id}
                  href={isRtl ? `/magazine/ar/articles/${art.id}` : `/magazine/en/articles/${art.id}`}
                  className="bg-[#0E0E0E] hover:bg-[#141414] border border-[#222] hover:border-[#D80032] rounded-2xl p-6 transition-all group flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-[#D80032] font-bold">
                        {isRtl ? art.categoryAr : art.categoryEn}
                      </span>
                      <span className="text-neutral-500 font-mono text-[11px]">
                        {isRtl ? art.readTimeAr : art.readTimeEn}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-white group-hover:text-[#D80032] transition-colors font-sans mb-3 leading-snug">
                      {isRtl ? art.titleAr : art.titleEn}
                    </h4>

                    <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed line-clamp-3 mb-4">
                      {isRtl ? art.excerptAr : art.excerptEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-xs text-neutral-300 font-medium">
                    <span className="text-neutral-500">{isRtl ? 'قراءة البحث كاملاً' : 'Read full essay'}</span>
                    <span className="text-white group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold">
                      <FileText size={13} className="text-[#D80032]" />
                      <span>{isRtl ? 'عرض المقال' : 'View Article'}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
