'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import { useStore } from '@/store';
import { ARTICLES } from '@/constants/articles';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export default function ArticlePage() {
  const { id } = useParams();
  const { lang } = useStore();
  const isRtl = lang === 'ar';
  
  const article = ARTICLES.find(a => a.id === id);
  if (!article) return notFound();

  return (
    <PageLayout>
      <div className="w-full bg-[#E5E0D0] text-[#111] min-h-screen py-16 px-4 md:px-8 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto">
          
          <Link 
            href="/#advocacy"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase font-bold text-[#555] hover:text-[#D80032] transition-colors mb-12"
          >
            <ArrowLeft size={16} className={isRtl ? 'rotate-180' : ''} />
            {isRtl ? 'العودة إلى المجلة' : 'Back to Magazine'}
          </Link>

          <header className="mb-16 border-b border-[#111]/20 pb-12 text-center">
            <span className="font-mono text-xs font-bold uppercase tracking-normal text-[#D80032] mb-4 block">
              {isRtl ? article.categoryAr : article.categoryEn}
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-[1.1] mb-8">
              {isRtl ? article.titleAr : article.titleEn}
            </h1>
            <div className="inline-flex items-center justify-center gap-4 text-xs font-mono font-bold uppercase tracking-normal text-[#555] bg-white/50 px-6 py-3 rounded-full border border-[#111]/10 flex-wrap">
              <span>{isRtl ? article.authorAr : article.authorEn}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{isRtl ? article.readTimeAr : article.readTimeEn}</span>
            </div>
          </header>

          <article className="prose prose-lg md:prose-xl mx-auto font-serif text-[#333] leading-relaxed max-w-3xl">
            <p className="text-xl md:text-2xl font-bold mb-12 text-[#111] leading-relaxed text-center">
              {isRtl ? article.excerptAr : article.excerptEn}
            </p>

            <div className="my-16 w-full h-[400px] bg-[#111] rounded-2xl flex items-center justify-center">
              <span className="text-[#333] font-mono text-sm uppercase">Editorial Illustration</span>
            </div>

            <div className="space-y-8">
              {(isRtl ? article.contentAr : article.contentEn).map((paragraph, i) => (
                <p key={i}>
                  {paragraph}
                </p>
              ))}
            </div>

            <blockquote className="my-16 p-8 bg-[#111] text-[#E5E0D0] rounded-xl font-bold text-2xl md:text-3xl border-l-8 border-[#D80032] leading-relaxed">
              {isRtl ? article.pullQuoteAr : article.pullQuoteEn}
            </blockquote>

            <div className="mt-24 pt-8 border-t border-[#111]/20 flex justify-between items-center">
              <button 
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="text-[#555] hover:text-[#111] font-mono text-xs font-bold uppercase transition-colors flex items-center gap-2"
              >
                {isRtl ? 'نسخ رابط المقال' : 'Copy Link'}
              </button>
            </div>
          </article>

        </div>
      </div>
    </PageLayout>
  );
}


