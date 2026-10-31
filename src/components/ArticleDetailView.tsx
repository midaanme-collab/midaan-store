'use client';

import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Article, ARTICLES } from '@/constants/articles';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  Globe, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  Compass 
} from 'lucide-react';

interface ArticleDetailViewProps {
  article: Article;
  lang: 'ar' | 'en';
}

export default function ArticleDetailView({ article, lang }: ArticleDetailViewProps) {
  const isAr = lang === 'ar';
  const reciprocalLang = isAr ? 'en' : 'ar';
  const reciprocalUrl = `/magazine/${reciprocalLang}/articles/${article.id}`;
  const pdfUrl = isAr ? '/magazine/issue-zero.pdf' : '/magazine/issue-zero-en.pdf';
  const [copied, setCopied] = useState(false);

  // Determine Next Article in sequence
  const currentIndex = ARTICLES.findIndex((a) => a.id === article.id);
  const nextIndex = (currentIndex + 1) % ARTICLES.length;
  const nextArticle = ARTICLES[nextIndex];
  const nextArticleUrl = `/magazine/${lang}/articles/${nextArticle.id}`;

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      const shareData = {
        title: isAr ? `${article.titleAr} | مجلة ميدان` : `${article.titleEn} | Midaan Magazine`,
        text: isAr ? article.excerptAr : article.excerptEn,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          // User dismissed or share error, fall back to copy
        }
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {}
    }
  };

  const title = isAr ? article.titleAr : article.titleEn;
  const author = isAr ? article.authorAr : article.authorEn;
  const category = isAr ? article.categoryAr : article.categoryEn;
  const readTime = isAr ? article.readTimeAr : article.readTimeEn;
  const excerpt = isAr ? article.excerptAr : article.excerptEn;
  const pullQuote = isAr ? article.pullQuoteAr : article.pullQuoteEn;
  const paragraphs = isAr ? article.contentAr : article.contentEn;

  return (
    <PageLayout>
      <div 
        className="w-full bg-[#050505] text-[#EDEDED] min-h-screen py-10 md:py-20 px-4 md:px-8 font-sans transition-colors"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="max-w-4xl mx-auto">
          
          {/* Top Bar: Navigation, Language Switcher, PDF Download */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-[#222]">
            <div className="flex items-center gap-3 text-xs font-semibold text-neutral-400">
              <Link 
                href="/magazine/issue-zero"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <BookOpen size={14} className="text-[#D80032]" />
                <span>{isAr ? 'فهرس العدد صفر' : 'Issue Zero Index'}</span>
              </Link>
              <span className="text-neutral-600">/</span>
              <Link 
                href="/magazine"
                className="hover:text-white transition-colors"
              >
                <span>{isAr ? 'المجلة' : 'Magazine'}</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Preserved Language Switcher */}
              <Link
                href={reciprocalUrl}
                className="inline-flex items-center gap-1.5 bg-[#141414] border border-[#2A2A2A] hover:border-[#D80032] px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-200 hover:text-white transition-colors shadow-sm"
                aria-label={`Switch to ${isAr ? 'English' : 'Arabic'}`}
              >
                <Globe size={13} className="text-[#D80032]" />
                <span>{isAr ? 'English Edition' : 'النسخة العربية'}</span>
              </Link>

              {/* PDF Download */}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 bg-[#D80032] hover:bg-[#B00028] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm"
              >
                <Download size={13} />
                <span>{isAr ? 'تحميل PDF' : 'Download PDF'}</span>
              </a>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-14 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#D80032]/10 border border-[#D80032]/30 text-[#D80032] px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-5">
              <span>{category}</span>
              <span>•</span>
              <span>{isAr ? 'العدد صفر: انتحاب' : 'Issue Zero: Entihab'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.25] text-white mb-6 font-sans text-balance">
              {title}
            </h1>

            <div className="inline-flex items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-neutral-300 bg-[#121212] px-5 py-2 rounded-full border border-[#262626] flex-wrap shadow-sm">
              <span>{isAr ? 'مجلة ميدان' : 'Midaan Review'}</span>
              <span>•</span>
              <span>{readTime}</span>
              {author && (
                <>
                  <span>•</span>
                  <span>{author}</span>
                </>
              )}
              {article.date && (
                <>
                  <span>•</span>
                  <span dir="ltr">{article.date}</span>
                </>
              )}
            </div>
          </header>

          {/* Article Body: Optimal Reading Width for Enhanced Legibility */}
          <article className="max-w-2xl mx-auto text-neutral-300 font-sans">
            
            {/* Excerpt Lead Box */}
            <div className="text-lg sm:text-xl font-medium mb-12 p-6 sm:p-8 bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#262626] rounded-2xl shadow-md text-neutral-100 leading-[1.9] border-s-4 border-s-[#D80032]">
              {excerpt}
            </div>

            {/* Paragraphs */}
            <div className={`space-y-7 text-base sm:text-lg text-neutral-300 ${isAr ? 'leading-[2.1]' : 'leading-[1.85]'}`}>
              {paragraphs.map((p, idx) => {
                const lines = p.split('\n');
                return (
                  <div key={idx} className="space-y-3.5">
                    {lines.map((line, lIdx) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2.5 ps-4 text-neutral-200">
                            <span className="text-[#D80032] font-black text-lg leading-none mt-1">•</span>
                            <span className="flex-1">{trimmed.replace(/^[•\-]\s*/, '')}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={lIdx}>
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Pull Quote */}
            <blockquote className={`my-14 p-6 sm:p-8 bg-[#121212] text-white rounded-2xl font-sans text-xl sm:text-2xl leading-relaxed shadow-xl ${
              isAr ? 'border-r-8 border-[#D80032]' : 'border-l-8 border-[#D80032]'
            }`}>
              {pullQuote}
            </blockquote>

            {/* Functional Share & Reciprocal Language Bar */}
            <div className="mt-14 pt-8 border-t border-[#262626] flex flex-wrap items-center justify-between gap-4">
              <button 
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-[#141414] hover:bg-[#1C1C1C] border border-[#2A2A2A] hover:border-neutral-500 text-neutral-200 px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                <span>
                  {isAr 
                    ? (copied ? 'تم نسخ الرابط بنجاح!' : 'مشاركة أو نسخ رابط المقال') 
                    : (copied ? 'Link Copied to Clipboard!' : 'Share or Copy Link')}
                </span>
              </button>

              <Link
                href={reciprocalUrl}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#D80032] hover:underline"
              >
                <span>{isAr ? 'Read in English' : 'اقرأ بالعربية'}</span>
                {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </Link>
            </div>

            {/* Next Article Card (المقال التالي) */}
            <div className="mt-12 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-[#262626] hover:border-[#D80032] rounded-3xl p-6 sm:p-8 transition-all group">
              <span className="text-[11px] font-bold uppercase text-[#D80032] tracking-wider block mb-2">
                {isAr ? 'المقال التالي في العدد صفر ←' : 'Next Article in Issue Zero →'}
              </span>
              
              <Link href={nextArticleUrl} className="block group">
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#D80032] transition-colors leading-snug mb-3">
                  {isAr ? nextArticle.titleAr : nextArticle.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                  {isAr ? nextArticle.excerptAr : nextArticle.excerptEn}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#D80032] transition-colors">
                  <span>{isAr ? 'متابعة القراءة' : 'Continue Reading'}</span>
                  {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </div>
              </Link>
            </div>

          </article>

        </div>
      </div>
    </PageLayout>
  );
}
