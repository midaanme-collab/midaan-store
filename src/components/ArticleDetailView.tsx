'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Article } from '@/constants/articles';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Globe, Copy, Check } from 'lucide-react';

interface ArticleDetailViewProps {
  article: Article;
  lang: 'ar' | 'en';
}

export default function ArticleDetailView({ article, lang }: ArticleDetailViewProps) {
  const isAr = lang === 'ar';
  const reciprocalLang = isAr ? 'en' : 'ar';
  const reciprocalUrl = `/magazine/${reciprocalLang}/articles/${article.id}`;
  const pdfUrl = isAr ? '/magazine/issue-zero.pdf' : '/magazine/issue-zero-en.pdf';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        className="w-full bg-[#FAF8F5] text-[#121212] min-h-screen py-12 md:py-20 px-4 md:px-8 font-sans transition-colors"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="max-w-4xl mx-auto">
          
          {/* Top Bar: Navigation, Language Switcher (Preserving current article), PDF Download */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-[#E5E0D0]">
            <Link 
              href="/magazine"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-normal text-[#666] hover:text-[#D80032] transition-colors"
            >
              {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span>{isAr ? 'العودة إلى المجلة' : 'Back to Magazine'}</span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Preserved Language Switcher */}
              <Link
                href={reciprocalUrl}
                className="inline-flex items-center gap-1.5 bg-white border border-[#D5D0C0] hover:border-[#D80032] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#222] transition-colors shadow-sm"
                aria-label={`Switch to ${isAr ? 'English' : 'Arabic'}`}
              >
                <Globe size={14} className="text-[#D80032]" />
                <span>{isAr ? 'English Edition' : 'النسخة العربية'}</span>
              </Link>

              {/* PDF Download */}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 bg-[#121212] hover:bg-[#D80032] text-white px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-colors shadow-sm"
              >
                <Download size={14} />
                <span>{isAr ? 'تحميل PDF' : 'Download PDF'}</span>
              </a>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 bg-[#D80032]/10 border border-[#D80032]/30 text-[#D80032] px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-normal mb-4">
              <span>{category}</span>
              <span>•</span>
              <span>{isAr ? 'العدد صفر' : 'Issue Zero'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.15] text-[#111] mb-6 font-serif">
              {title}
            </h1>

            <div className="inline-flex items-center justify-center gap-3 sm:gap-4 text-xs font-mono font-bold text-[#333] bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full border border-[#D5D0C0] flex-wrap shadow-sm">
              <span>{isAr ? 'مجلة ميدان — العدد صفر (انتحاب)' : 'Midaan Magazine — Issue Zero (Entihab)'}</span>
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
              <span>•</span>
              <span>{readTime}</span>
            </div>
          </header>

          {/* Article Body */}
          <article className="prose prose-lg md:prose-xl mx-auto text-[#222] leading-relaxed max-w-3xl">
            {/* Excerpt Box */}
            <div className="text-lg md:text-xl font-bold mb-12 p-6 md:p-8 bg-white border border-[#E5E0D0] rounded-2xl shadow-sm text-center leading-relaxed text-[#222]">
              {excerpt}
            </div>

            {/* Paragraphs with Section Formatting */}
            <div className="space-y-6 text-[15px] sm:text-[17px] leading-[1.85] text-[#242424]">
              {paragraphs.map((p, idx) => {
                // Check if this paragraph contains a section heading or bullet points
                const lines = p.split('\n');
                return (
                  <div key={idx} className="space-y-3">
                    {lines.map((line, lIdx) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2 ps-4 text-neutral-800">
                            <span className="text-[#D80032] font-black">•</span>
                            <span>{trimmed.replace(/^[•\-]\s*/, '')}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={lIdx} className="leading-relaxed">
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Pull Quote */}
            <blockquote className={`my-14 p-6 sm:p-8 bg-[#141414] text-[#F5F2EB] rounded-2xl font-serif text-xl sm:text-2xl leading-relaxed shadow-xl ${
              isAr ? 'border-r-8 border-[#D80032]' : 'border-l-8 border-[#D80032]'
            }`}>
              {pullQuote}
            </blockquote>

            {/* Bottom Controls */}
            <div className="mt-16 pt-8 border-t border-[#E0DCD0] flex flex-wrap items-center justify-between gap-4">
              <button 
                onClick={handleCopy}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-normal bg-white border border-[#D5D0C0] hover:border-black px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                <span>{isAr ? (copied ? 'تم نسخ الرابط!' : 'نسخ رابط المقال') : (copied ? 'Link Copied!' : 'Copy Link')}</span>
              </button>

              <Link
                href={reciprocalUrl}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#D80032] hover:underline"
              >
                <span>{isAr ? 'اقرأ المقال بالإنجليزية' : 'Read Article in Arabic'}</span>
                {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </Link>
            </div>
          </article>

        </div>
      </div>
    </PageLayout>
  );
}
