'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store';
import { ARTICLES, Article } from '@/constants/articles';
import { content } from '@/locales/dictionary';
import { X, ArrowUpRight } from 'lucide-react';

export default function ArticlesSection() {
  const { lang, setGarment, setArtMode, setSelectedPreset } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  const handleMerchLinkClick = (linkId: string) => {
    setSelectedArticle(null);
    if (linkId === 'drop-elfar3i-01') {
      setGarment('tshirt');
      setArtMode('presets');
      setSelectedPreset('far3i');
      document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
    } else if (linkId === 'drop-core-02') {
      setGarment('hoodie');
      setArtMode('presets');
      setSelectedPreset('calligraphy');
      document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featured = ARTICLES[0];
  const dossier = ARTICLES.slice(1);

  return (
    <>
      <section id="advocacy" className="w-full bg-[#070707] text-[#EDEDED] py-24 px-4 md:px-8 border-t border-[#1F1F1F] font-sans scroll-mt-24" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between mb-16 pb-8 border-b border-[#262626]">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-sans text-center leading-tight">
            {strings.articlesSection.heading}
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Featured Article Card */}
          <Link 
            href={isRtl ? `/magazine/ar/articles/${featured.id}` : `/magazine/en/articles/${featured.id}`}
            className="lg:col-span-7 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-[#262626] hover:border-[#D80032] p-8 md:p-10 rounded-3xl transition-all shadow-2xl group flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D80032] text-white px-3.5 py-1 text-xs font-bold rounded-full mb-6">
                <span>{strings.articlesSection.editorsPick}</span>
              </div>
              
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-5 group-hover:text-[#D80032] transition-colors font-sans">
                {isRtl ? featured.titleAr : featured.titleEn}
              </h3>
              
              <p className="text-base sm:text-lg text-neutral-300 font-sans leading-relaxed mb-6 font-normal">
                {isRtl ? featured.excerptAr : featured.excerptEn}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-400 border-t border-[#262626] pt-4 mt-6">
              <span>{isRtl ? 'مجلة ميدان — العدد صفر (انتحاب)' : 'Midaan Magazine — Issue Zero'}</span>
              <span>•</span>
              <span>{isRtl ? featured.readTimeAr : featured.readTimeEn}</span>
            </div>
          </Link>

          {/* Dossier List */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {dossier.map((article, idx) => (
              <Link 
                key={article.id} 
                href={isRtl ? `/magazine/ar/articles/${article.id}` : `/magazine/en/articles/${article.id}`}
                className="bg-[#0F0F0F] border border-[#222] hover:border-[#D80032] p-6 rounded-2xl transition-all shadow-lg group block"
              >
                <div className="flex justify-between items-center mb-2.5 text-xs">
                  <span className="font-bold text-[#D80032]">
                    {isRtl ? article.categoryAr : article.categoryEn}
                  </span>
                  <span className="text-neutral-400">
                    {isRtl ? `${idx + 1} من ${dossier.length}` : `${idx + 1} of ${dossier.length}`}
                  </span>
                </div>
                
                <h4 className="text-lg sm:text-xl font-black text-white leading-snug group-hover:text-[#D80032] transition-colors mb-3 font-sans">
                  {isRtl ? article.titleAr : article.titleEn}
                </h4>
                
                <div className="text-xs text-neutral-400 font-medium flex items-center gap-2">
                  <span>{isRtl ? 'العدد صفر' : 'Issue Zero'}</span>
                  <span>•</span>
                  <span>{isRtl ? article.readTimeAr : article.readTimeEn}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md overflow-y-auto text-[#EDEDED] flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#262626] px-6 py-4 flex justify-between items-center z-10">
            <span className="text-xs font-bold text-[#D80032]">
              {isRtl ? selectedArticle.categoryAr : selectedArticle.categoryEn}
            </span>
            <button 
              onClick={() => setSelectedArticle(null)}
              className="text-neutral-400 hover:text-white transition-colors bg-[#161616] p-2 rounded-full border border-[#2A2A2A]"
            >
              <X size={20} />
            </button>
          </div>

          <article className="max-w-4xl mx-auto px-6 py-16 flex-1">
            <header className="mb-14 border-b border-[#262626] pb-10 text-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 text-white font-sans">
                {isRtl ? selectedArticle.titleAr : selectedArticle.titleEn}
              </h1>
              <div className="inline-flex items-center gap-4 text-xs font-medium text-neutral-300 bg-[#161616] px-6 py-2.5 rounded-full border border-[#262626]">
                <span>{isRtl ? selectedArticle.authorAr : selectedArticle.authorEn}</span>
                <span>•</span>
                <span dir="ltr">{selectedArticle.date}</span>
                <span>•</span>
                <span>{isRtl ? selectedArticle.readTimeAr : selectedArticle.readTimeEn}</span>
              </div>
            </header>

            <div className="max-w-3xl mx-auto text-neutral-300 text-base md:text-lg leading-relaxed font-sans">
              <p className="text-lg md:text-xl font-bold mb-10 text-white leading-relaxed bg-[#121212] p-6 rounded-2xl border border-[#262626]">
                {isRtl ? selectedArticle.excerptAr : selectedArticle.excerptEn}
              </p>

              {(isRtl ? selectedArticle.contentAr : selectedArticle.contentEn).map((paragraph, i) => (
                <p key={i} className="mb-6 leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <blockquote className="my-12 p-8 bg-[#141414] text-[#F4F4F0] rounded-2xl font-bold text-xl md:text-2xl border-r-8 border-[#D80032]">
                {isRtl ? selectedArticle.pullQuoteAr : selectedArticle.pullQuoteEn}
              </blockquote>

              {selectedArticle.merchLink && (
                <div className="mt-14 pt-8 border-t border-[#262626]">
                  <button 
                    onClick={() => handleMerchLinkClick(selectedArticle.merchLink!)}
                    className="bg-[#D80032] hover:bg-[#B00028] text-white px-8 py-4 text-sm font-bold transition-colors rounded-xl flex items-center gap-2"
                  >
                    <span>View Official Drop</span> <ArrowUpRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>
      )}
    </>
  );
}
