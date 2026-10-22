'use client';

import React, { useState } from 'react';
import { useStore } from '@/store';
import { ARTICLES, Article } from '@/constants/articles';
import { X, ArrowUpRight } from 'lucide-react';

export default function ArticlesSection() {
  const { lang, setGarment, setArtMode, setSelectedPreset } = useStore();
  const isRtl = lang === 'ar';
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Hardcoded map to simulate "Click merch link to go to studio preset"
  const handleMerchLinkClick = (linkId: string) => {
    setSelectedArticle(null); // close article modal
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
      <section id="advocacy" className="w-full bg-[#E5E0D0] text-[#111] py-24 px-4 md:px-8 border-t-4 border-[#D80032] font-sans">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between mb-16 pb-8 border-b border-[#111]">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#111]">
            {isRtl ? 'صوت ميدان | الإعلام المستقل' : 'The Voice | Independent Media'}
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Featured Article */}
          <div className="lg:col-span-8 cursor-pointer group" onClick={() => setSelectedArticle(featured)}>
            <div className="inline-flex items-center gap-2 bg-[#D80032] text-white px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
              {isRtl ? 'اختيار المحررين' : 'Editor\'s Pick'}
            </div>
            
            <h3 className="text-4xl md:text-6xl font-black uppercase leading-[1.1] mb-6 group-hover:text-[#D80032] transition-colors">
              {isRtl ? featured.titleAr : featured.titleEn}
            </h3>
            
            <p className="text-lg md:text-xl font-medium leading-relaxed mb-6 font-serif">
              {isRtl ? featured.excerptAr : featured.excerptEn}
            </p>
            
            <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-widest text-[#555] border-t border-[#111]/20 pt-4">
              <span>{isRtl ? featured.authorAr : featured.authorEn}</span>
              <span>|</span>
              <span>{isRtl ? featured.readTimeAr : featured.readTimeEn}</span>
            </div>
          </div>

          {/* Dossier List */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#111]/20 pt-12 lg:pt-0 lg:pl-12 flex flex-col justify-between">
            {dossier.map((article, idx) => (
              <div 
                key={article.id} 
                onClick={() => setSelectedArticle(article)}
                className="cursor-pointer group mb-10 last:mb-0"
              >
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D80032]">
                    {isRtl ? article.categoryAr : article.categoryEn}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#555]">
                    {isRtl ? `${idx + 1} من ${dossier.length}` : `${idx + 1} of ${dossier.length}`}
                  </span>
                </div>
                
                <h4 className="text-xl md:text-2xl font-black uppercase leading-tight group-hover:text-[#D80032] transition-colors mb-3">
                  {isRtl ? article.titleAr : article.titleEn}
                </h4>
                
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#555]">
                  {isRtl ? article.authorAr : article.authorEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[70] bg-[#E5E0D0] overflow-y-auto text-[#111] flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="sticky top-0 bg-[#E5E0D0]/90 backdrop-blur-md border-b border-[#111]/10 px-6 py-4 flex justify-between items-center z-10">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D80032]">
              {isRtl ? selectedArticle.categoryAr : selectedArticle.categoryEn}
            </span>
            <button 
              onClick={() => setSelectedArticle(null)}
              className="text-[#111] hover:text-[#D80032] transition-colors bg-[#E5E0D0] p-2 rounded-full border border-[#111]/20"
            >
              <X size={24} />
            </button>
          </div>

          <article className="max-w-4xl mx-auto px-6 py-16 flex-1">
            <header className="mb-16 border-b border-[#111]/20 pb-12 text-center">
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-[1.1] mb-8">
                {isRtl ? selectedArticle.titleAr : selectedArticle.titleEn}
              </h1>
              <div className="inline-flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-widest text-[#555] bg-white/50 px-6 py-3 rounded-full border border-[#111]/10">
                <span>{isRtl ? selectedArticle.authorAr : selectedArticle.authorEn}</span>
                <span>•</span>
                <span>{isRtl ? selectedArticle.date : selectedArticle.date}</span>
                <span>•</span>
                <span>{isRtl ? selectedArticle.readTimeAr : selectedArticle.readTimeEn}</span>
              </div>
            </header>

            <div className="prose prose-lg md:prose-xl mx-auto font-serif text-[#333] leading-relaxed">
              <p className="text-xl md:text-2xl font-bold mb-12 text-[#111] leading-relaxed">
                {isRtl ? selectedArticle.excerptAr : selectedArticle.excerptEn}
              </p>

              {(isRtl ? selectedArticle.contentAr : selectedArticle.contentEn).map((paragraph, i) => (
                <p key={i} className="mb-8">
                  {paragraph}
                </p>
              ))}

              <blockquote className="my-12 p-8 bg-[#111] text-[#E5E0D0] rounded-xl font-bold text-2xl md:text-3xl border-l-8 border-[#D80032]">
                {isRtl ? selectedArticle.pullQuoteAr : selectedArticle.pullQuoteEn}
              </blockquote>

              {selectedArticle.merchLink && (
                <div className="mt-16 pt-8 border-t-2 border-[#111]">
                  <h4 className="text-sm font-mono font-bold uppercase tracking-widest mb-4">Related Merchandise</h4>
                  <button 
                    onClick={() => handleMerchLinkClick(selectedArticle.merchLink!)}
                    className="bg-[#D80032] hover:bg-[#111] text-white px-8 py-4 text-sm font-black uppercase tracking-[0.2em] transition-colors rounded-xl flex items-center gap-2"
                  >
                    View Official Drop <ArrowUpRight size={18} />
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
