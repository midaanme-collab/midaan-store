'use client';

import React from 'react';
import { BookOpen, Download, ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';
import Link from 'next/link';
import { content } from '@/locales/dictionary';

export default function Voice() {
  const { lang } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  const coverThumb = isRtl 
    ? '/magazine/issue-zero-cover-thumb.png' 
    : '/magazine/issue-zero-cover-thumb-en.png';

  return (
    <section id="voice" className="w-full bg-[#050505] py-24 px-4 md:px-8 border-t border-[#1F1F1F] relative overflow-hidden scroll-mt-24" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Magazine Description & Badge */}
        <div className="md:w-5/12 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 bg-[#D80032] text-white px-4 py-1.5 text-xs font-bold rounded-full mb-6 shadow-[0_0_15px_rgba(216,0,50,0.4)]">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>{strings.magazine.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 font-sans leading-tight">
            {strings.magazine.heading}
          </h2>

          <p className="text-neutral-300 font-sans text-base md:text-lg leading-relaxed mb-8">
            {strings.magazine.desc}
          </p>

          <div className="w-full border-t border-[#262626] pt-6 flex flex-col gap-3">
            {/* Primary Action: Read Issue Reader */}
            <Link 
              href="/magazine/issue-zero"
              className="w-full bg-white hover:bg-neutral-200 text-black py-4 px-6 rounded-2xl font-sans text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-white/10 active:scale-95"
            >
              <BookOpen size={18} className="text-[#D80032]" />
              <span>{strings.magazine.actionRead}</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>

            {/* Bilingual PDF Downloads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <a 
                href="/magazine/issue-zero.pdf"
                download="Midaan_Magazine_Issue_Zero_AR.pdf"
                className="bg-[#141414] hover:bg-[#1C1C1C] text-neutral-200 hover:text-white border border-[#2A2A2A] py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Download size={14} className="text-[#D80032]" />
                <span>{strings.magazine.actionDownloadAr}</span>
              </a>

              <a 
                href="/magazine/issue-zero-en.pdf"
                download="Midaan_Magazine_Issue_Zero_EN.pdf"
                className="bg-[#141414] hover:bg-[#1C1C1C] text-neutral-200 hover:text-white border border-[#2A2A2A] py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Download size={14} className="text-[#D80032]" />
                <span>{strings.magazine.actionDownloadEn}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Issue Zero Card with Compact Actual Cover Thumbnail */}
        <div className="md:w-7/12 w-full">
          <div className="bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-[#262626] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row gap-6 items-center">
            
            {/* Compact Actual Issue Zero Cover Thumbnail */}
            <div className="w-full sm:w-1/2 max-w-[240px] flex-shrink-0">
              <div className="relative aspect-[1/1.414] rounded-xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.8)] border border-neutral-700/60 group">
                <img 
                  src={coverThumb} 
                  alt={strings.magazine.issueZeroTitle} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 inset-x-3 text-center">
                  <span className="inline-block bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                    {strings.magazine.issueZeroTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Issue Zero Editorial Details */}
            <div className="flex-1 flex flex-col justify-between self-stretch py-2">
              <div>
                <div className="text-xs font-bold text-[#D80032] uppercase mb-2">
                  {isRtl ? 'الإصدار التأسيسي // خريف 2026' : 'FOUNDING ISSUE // AUTUMN 2026'}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-white font-sans leading-tight mb-3">
                  {strings.magazine.issueZeroTitle}
                </h3>
                
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed mb-6">
                  {isRtl 
                    ? 'توثيق سردية الشارع، صراع الأرض والسماء، وسجل وصايا الخالدين. منصة للرواية المستقلة والتعبير المدني الحر.'
                    : 'Documenting the street narrative, the conflict of earth and sky, and the testaments of the immortal.'}
                </p>
              </div>

              <div className="border-t border-[#262626] pt-4 mt-auto">
                <Link
                  href="/magazine"
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors font-semibold"
                >
                  <span>{isRtl ? 'عرض كافة أعداد المجلة والأرشيف' : 'View all magazine issues & archive'}</span>
                  {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
