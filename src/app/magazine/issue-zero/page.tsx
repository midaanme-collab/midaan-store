'use client';

import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Download, 
  ArrowLeft, 
  ArrowRight, 
  Globe, 
  Sparkles, 
  FileText, 
  Compass,
  ArrowUp,
  Share2,
  Check
} from 'lucide-react';
import { useStore } from '@/store';
import { trackDownloadPdf } from '@/utils/analytics';
import { FOUNDING_MANIFESTO, ARTICLES, Article } from '@/constants/articles';
import EditorialCommerceCrossLink from '@/components/EditorialCommerceCrossLink';
import MidaanDispatchNewsletter from '@/components/MidaanDispatchNewsletter';

export default function IssueZeroReader() {
  const { lang, setLang } = useStore();
  const isRtl = lang === 'ar';
  const isAr = isRtl;
  const [copied, setCopied] = useState(false);

  const pdfSrc = isRtl ? '/magazine/issue-zero.pdf' : '/magazine/issue-zero-en.pdf';
  const coverThumb = isRtl 
    ? '/magazine/issue-zero-cover-thumb.png' 
    : '/magazine/issue-zero-cover-thumb-en.png';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: isAr ? 'مجلة ميدان — العدد صفر (انتحاب)' : 'Midaan Magazine — Issue Zero (Entihab)',
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    "issueNumber": "0",
    "name": isAr ? "مجلة ميدان — العدد صفر (انتحاب)" : "Midaan Magazine — Issue Zero (Entihab)",
    "headline": isAr ? "العدد صفر: انتحاب" : "Issue Zero: Entihab",
    "datePublished": "2026-10-01",
    "inLanguage": ["ar", "en"],
    "description": isAr 
      ? "إصدار فكري وثقافي مستقل يبحث في قضايا الهوية والذاكرة والاشتباك والمناصرة الفنية من عمّان وفلسطين." 
      : "An independent cultural and intellectual publication exploring identity, memory, and civic expression from Amman and Palestine.",
    "publisher": {
      "@type": "Organization",
      "name": "Midaan Collective | ميدان",
      "url": "https://midaan.net",
      "logo": {
        "@type": "ImageObject",
        "url": "https://midaan.net/logo.png"
      }
    },
    "hasPart": [
      {
        "@type": "Article",
        "headline": FOUNDING_MANIFESTO.titleAr,
        "datePublished": "2026-10-01",
        "author": { "@type": "Organization", "name": "Midaan Editorial Collective" }
      },
      ...ARTICLES.map(art => ({
        "@type": "Article",
        "headline": isAr ? art.titleAr : art.titleEn,
        "datePublished": "2026-10-01",
        "author": { "@type": "Organization", "name": "Midaan Collective" }
      }))
    ]
  };

  const tableOfContents = [
    {
      index: '01',
      id: 'section-manifesto',
      category: isAr ? 'وثيقة الإطلاق والعهد' : 'Founding Covenant',
      title: isAr ? FOUNDING_MANIFESTO.titleAr : FOUNDING_MANIFESTO.titleEn,
      readTime: isAr ? '٤ دقائق' : '4 min read',
    },
    {
      index: '02',
      id: 'section-art-1',
      category: isAr ? ARTICLES[0].categoryAr : ARTICLES[0].categoryEn,
      title: isAr ? ARTICLES[0].titleAr : ARTICLES[0].titleEn,
      readTime: isAr ? ARTICLES[0].readTimeAr : ARTICLES[0].readTimeEn,
    },
    {
      index: '03',
      id: 'section-art-2',
      category: isAr ? ARTICLES[1].categoryAr : ARTICLES[1].categoryEn,
      title: isAr ? ARTICLES[1].titleAr : ARTICLES[1].titleEn,
      readTime: isAr ? ARTICLES[1].readTimeAr : ARTICLES[1].readTimeEn,
    },
    {
      index: '04',
      id: 'section-art-3',
      category: isAr ? ARTICLES[2].categoryAr : ARTICLES[2].categoryEn,
      title: isAr ? ARTICLES[2].titleAr : ARTICLES[2].titleEn,
      readTime: isAr ? ARTICLES[2].readTimeAr : ARTICLES[2].readTimeEn,
    },
    {
      index: '05',
      id: 'section-art-4',
      category: isAr ? ARTICLES[3].categoryAr : ARTICLES[3].categoryEn,
      title: isAr ? ARTICLES[3].titleAr : ARTICLES[3].titleEn,
      readTime: isAr ? ARTICLES[3].readTimeAr : ARTICLES[3].readTimeEn,
    },
  ];

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <div className="w-full bg-[#050505] min-h-screen font-sans border-t border-[#1A1A1A] text-neutral-200" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Editorial Top Colophon Header */}
        <header className="border-b border-[#222] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-20 md:top-24 z-30 py-3.5 px-4 md:px-8">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 text-neutral-400 font-mono tracking-wider">
              <Link 
                href="/magazine" 
                className="text-white hover:text-[#D80032] transition-colors flex items-center gap-1.5 font-bold"
              >
                {isRtl ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                <span>{isRtl ? 'المجلة' : 'Magazine'}</span>
              </Link>
              <span>/</span>
              <span className="text-neutral-500 hidden sm:inline">MIDAAN ISSUE ZERO // HKJ-PAL-2026-ZERO</span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setLang(isRtl ? 'en' : 'ar')}
                className="bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-neutral-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                aria-label="Switch Language"
              >
                <Globe size={13} className="text-[#D80032]" />
                <span>{isRtl ? 'English Edition' : 'النسخة العربية'}</span>
              </button>

              {/* Share button */}
              <button
                type="button"
                onClick={handleShare}
                className="bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                aria-label="Share Issue"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                <span className="hidden sm:inline">{copied ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'مشاركة' : 'Share')}</span>
              </button>

              {/* Download PDF button */}
              <a 
                href={pdfSrc} 
                download={isRtl ? "Midaan_Magazine_Issue_Zero_AR.pdf" : "Midaan_Magazine_Issue_Zero_EN.pdf"}
                onClick={() => trackDownloadPdf(isRtl ? 'ar' : 'en')}
                className="bg-[#D80032] hover:bg-[#B00028] text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Download size={13} />
                <span>{isRtl ? 'تحميل PDF' : 'Download PDF'}</span>
              </a>
            </div>
          </div>
        </header>

        {/* Issue Cover & Hero Section */}
        <section className="py-14 md:py-20 px-4 md:px-8 border-b border-[#1F1F1F] bg-gradient-to-b from-[#0A0A0A] via-[#050505] to-[#050505]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Cover Column */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative aspect-[1/1.414] w-full max-w-[320px] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-neutral-700/60 group">
                <Image
                  src={coverThumb}
                  alt={isAr ? "مجلة ميدان — غلاف العدد صفر (انتحاب)" : "Midaan Magazine — Issue Zero Cover"}
                  width={600}
                  height={848}
                  priority
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 inset-x-4 flex justify-between items-center text-[11px] text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 font-mono">
                  <span>HKJ-PAL-2026-ZERO</span>
                  <span className="text-[#D80032] font-bold">{isAr ? 'الإصدار التأسيسي' : 'Issue Zero'}</span>
                </div>
              </div>
            </div>

            {/* Text & Meta Column */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-[#D80032] text-white px-3.5 py-1 text-xs font-bold rounded-full mb-5 self-start">
                <Sparkles size={12} />
                <span>{isAr ? 'الإصدار التأسيسي // خريف ٢٠٢٦' : 'FOUNDING ISSUE // AUTUMN 2026'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-sans mb-5">
                {isAr ? 'العدد صفر: انتحاب' : 'Issue Zero: Entihab'}
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 font-sans leading-relaxed mb-6 font-normal">
                {isAr 
                  ? 'إصدار فكري وثقافي مستقل يبحث في قضايا الهوية، الذاكرة، صراع الأرض والسماء، وسجل وصايا الخالدين. خمسة نصوص موثقة صُممت لتقرأ بعمق وتُحفظ كأرشيف حي.'
                  : 'An independent cultural and intellectual publication exploring identity, memory, the conflict of earth and sky, and the testaments of martyrs. Five documented texts designed for contemplative reading.'}
              </p>

              {/* Colophon Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#222] text-xs font-sans mb-8">
                <div>
                  <span className="text-neutral-500 block mb-1">{isAr ? 'المكان' : 'Location'}</span>
                  <span className="text-white font-semibold">{isAr ? 'عمّان وفلسطين' : 'Amman & Palestine'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">{isAr ? 'التاريخ' : 'Date'}</span>
                  <span className="text-white font-semibold">{isAr ? 'تشرين الأول ٢٠٢٦' : 'October 2026'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">{isAr ? 'عدد النصوص' : 'Contents'}</span>
                  <span className="text-white font-semibold">{isAr ? '٥ أبحاث ونصوص' : '5 Core Texts'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">{isAr ? 'الناشر' : 'Publisher'}</span>
                  <span className="text-white font-semibold">{isAr ? 'هيئة تحرير ميدان' : 'Midaan Collective'}</span>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('toc')}
                  className="bg-white hover:bg-neutral-200 text-black py-3 px-6 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <Compass size={14} className="text-[#D80032]" />
                  <span>{isAr ? 'تصفح فهرس النصوص' : 'View Table of Contents'}</span>
                </button>

                <a
                  href={pdfSrc}
                  download={isAr ? "Midaan_Magazine_Issue_Zero_AR.pdf" : "Midaan_Magazine_Issue_Zero_EN.pdf"}
                  onClick={() => trackDownloadPdf(isAr ? 'ar' : 'en')}
                  className="bg-[#141414] hover:bg-[#1E1E1E] text-neutral-200 hover:text-white border border-[#2A2A2A] py-3 px-5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Download size={14} className="text-[#D80032]" />
                  <span>{isAr ? 'تحميل النسخة الكاملة (PDF)' : 'Download Full PDF'}</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Interactive Table of Contents */}
        <section id="toc" className="py-16 px-4 md:px-8 border-b border-[#222] bg-[#080808] scroll-mt-28">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#222]">
              <div>
                <span className="text-[#D80032] text-xs font-bold uppercase tracking-wider block mb-1">
                  {isAr ? 'هيكل الإصدار' : 'Issue Structure'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-sans">
                  {isAr ? 'فهرس العدد التأسيسي' : 'Table of Contents'}
                </h2>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {isAr ? 'انقر على أي نص للانتقال الفوري إليه' : 'Click any title to jump directly to text'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-start bg-[#0E0E0E] hover:bg-[#141414] border border-[#222] hover:border-[#D80032] rounded-2xl p-5 md:p-6 transition-all group flex items-center justify-between gap-4 shadow-md"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#D80032] shrink-0">
                      {item.index}
                    </span>
                    <div>
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1 font-semibold">
                        {item.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#D80032] transition-colors font-sans">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
                      {item.readTime}
                    </span>
                    <span className="p-2 rounded-xl bg-[#161616] group-hover:bg-[#D80032] text-neutral-400 group-hover:text-white transition-colors">
                      {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 01. Full Founding Manifesto Reader */}
        <article id="section-manifesto" className="py-20 px-4 md:px-8 border-b border-[#222] scroll-mt-28">
          <div className="max-w-4xl mx-auto">
            <div className="border-s-4 border-[#D80032] ps-5 mb-8">
              <span className="text-[#D80032] font-mono text-xs font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'النص ٠١ // وثيقة الإطلاق' : 'TEXT 01 // FOUNDING COVENANT'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight">
                {isAr ? FOUNDING_MANIFESTO.titleAr : FOUNDING_MANIFESTO.titleEn}
              </h2>
            </div>

            <div className="bg-[#0C0C0C] border border-[#222] rounded-3xl p-8 sm:p-12 shadow-2xl relative mb-10">
              <div className="space-y-6 text-neutral-300 font-sans text-base sm:text-lg leading-relaxed">
                {(isAr ? FOUNDING_MANIFESTO.paragraphsAr : FOUNDING_MANIFESTO.paragraphsEn).map((paragraph, idx) => (
                  <p 
                    key={idx}
                    className={idx === 0 ? "text-white font-semibold text-lg sm:text-xl border-b border-neutral-800 pb-4 italic" : ""}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#222] flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>{isAr ? 'هيئة تحرير ميدان — تشرين الأول ٢٠٢٦' : 'Midaan Editorial Collective — Autumn 2026'}</span>
                <span>HKJ-PAL-2026-ZERO</span>
              </div>
            </div>

            {/* Next Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => scrollToSection('section-art-1')}
                className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#D80032] text-neutral-200 hover:text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <span>{isAr ? 'النص التالي: صراع الأرض والسماء' : 'Next: Conflict of Earth and Sky'}</span>
                {isRtl ? <ArrowLeft size={14} className="text-[#D80032]" /> : <ArrowRight size={14} className="text-[#D80032]" />}
              </button>
            </div>
          </div>
        </article>

        {/* 02. Article 1 Reader: Conflict of Earth and Sky */}
        <article id="section-art-1" className="py-20 px-4 md:px-8 border-b border-[#222] bg-[#070707] scroll-mt-28">
          <div className="max-w-4xl mx-auto">
            <div className="border-s-4 border-[#D80032] ps-5 mb-8">
              <span className="text-[#D80032] font-mono text-xs font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'النص ٠٢ // افتتاحية العدد' : 'TEXT 02 // EDITORIAL'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight mb-2">
                {isAr ? ARTICLES[0].titleAr : ARTICLES[0].titleEn}
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {isAr ? ARTICLES[0].readTimeAr : ARTICLES[0].readTimeEn}
              </span>
            </div>

            {/* Pull Quote */}
            <blockquote className="my-8 p-6 rounded-2xl bg-[#0E0E0E] border-s-4 border-[#D80032] text-white font-sans text-lg sm:text-xl font-semibold leading-relaxed shadow-lg">
              {isAr ? ARTICLES[0].pullQuoteAr : ARTICLES[0].pullQuoteEn}
            </blockquote>

            {/* Content Paragraphs */}
            <div className="space-y-6 text-neutral-300 font-sans text-base sm:text-lg leading-relaxed mb-10">
              {(isAr ? ARTICLES[0].contentAr : ARTICLES[0].contentEn).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Prev / Next Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#222]">
              <button
                type="button"
                onClick={() => scrollToSection('section-manifesto')}
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
              >
                {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                <span>{isAr ? 'السابق: البيان التأسيسي' : 'Previous: Founding Manifesto'}</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('section-art-2')}
                className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#D80032] text-neutral-200 hover:text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <span>{isAr ? 'النص التالي: سأموت قبل الأربعين' : 'Next: I Will Die Before Forty'}</span>
                {isRtl ? <ArrowLeft size={14} className="text-[#D80032]" /> : <ArrowRight size={14} className="text-[#D80032]" />}
              </button>
            </div>
          </div>
        </article>

        {/* 03. Article 2 Reader: I Will Die Before Forty */}
        <article id="section-art-2" className="py-20 px-4 md:px-8 border-b border-[#222] scroll-mt-28">
          <div className="max-w-4xl mx-auto">
            <div className="border-s-4 border-[#D80032] ps-5 mb-8">
              <span className="text-[#D80032] font-mono text-xs font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'النص ٠٣ // مقال فكري' : 'TEXT 03 // PHILOSOPHICAL ESSAY'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight mb-2">
                {isAr ? ARTICLES[1].titleAr : ARTICLES[1].titleEn}
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {isAr ? ARTICLES[1].readTimeAr : ARTICLES[1].readTimeEn}
              </span>
            </div>

            {/* Pull Quote */}
            <blockquote className="my-8 p-6 rounded-2xl bg-[#0E0E0E] border-s-4 border-[#D80032] text-white font-sans text-lg sm:text-xl font-semibold leading-relaxed shadow-lg">
              {isAr ? ARTICLES[1].pullQuoteAr : ARTICLES[1].pullQuoteEn}
            </blockquote>

            {/* Content Paragraphs */}
            <div className="space-y-6 text-neutral-300 font-sans text-base sm:text-lg leading-relaxed mb-10">
              {(isAr ? ARTICLES[1].contentAr : ARTICLES[1].contentEn).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Prev / Next Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#222]">
              <button
                type="button"
                onClick={() => scrollToSection('section-art-1')}
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
              >
                {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                <span>{isAr ? 'السابق: صراع الأرض والسماء' : 'Previous: Conflict of Earth and Sky'}</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('section-art-3')}
                className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#D80032] text-neutral-200 hover:text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <span>{isAr ? 'النص التالي: حبر اليقين' : 'Next: Ink of Certainty'}</span>
                {isRtl ? <ArrowLeft size={14} className="text-[#D80032]" /> : <ArrowRight size={14} className="text-[#D80032]" />}
              </button>
            </div>
          </div>
        </article>

        {/* 04. Article 3 Reader: Ink of Certainty */}
        <article id="section-art-3" className="py-20 px-4 md:px-8 border-b border-[#222] bg-[#070707] scroll-mt-28">
          <div className="max-w-4xl mx-auto">
            <div className="border-s-4 border-[#D80032] ps-5 mb-8">
              <span className="text-[#D80032] font-mono text-xs font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'النص ٠٤ // دراسة فلسفية' : 'TEXT 04 // PHILOSOPHICAL STUDY'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight mb-2">
                {isAr ? ARTICLES[2].titleAr : ARTICLES[2].titleEn}
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {isAr ? ARTICLES[2].readTimeAr : ARTICLES[2].readTimeEn}
              </span>
            </div>

            {/* Pull Quote */}
            <blockquote className="my-8 p-6 rounded-2xl bg-[#0E0E0E] border-s-4 border-[#D80032] text-white font-sans text-lg sm:text-xl font-semibold leading-relaxed shadow-lg">
              {isAr ? ARTICLES[2].pullQuoteAr : ARTICLES[2].pullQuoteEn}
            </blockquote>

            {/* Content Paragraphs */}
            <div className="space-y-6 text-neutral-300 font-sans text-base sm:text-lg leading-relaxed mb-10">
              {(isAr ? ARTICLES[2].contentAr : ARTICLES[2].contentEn).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Prev / Next Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#222]">
              <button
                type="button"
                onClick={() => scrollToSection('section-art-2')}
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
              >
                {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                <span>{isAr ? 'السابق: سأموت قبل الأربعين' : 'Previous: I Will Die Before Forty'}</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('section-art-4')}
                className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#D80032] text-neutral-200 hover:text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <span>{isAr ? 'النص التالي: سجل وصايا الشهداء' : 'Next: Register of Martyrs\' Wills'}</span>
                {isRtl ? <ArrowLeft size={14} className="text-[#D80032]" /> : <ArrowRight size={14} className="text-[#D80032]" />}
              </button>
            </div>
          </div>
        </article>

        {/* 05. Article 4 Reader: Register of Palestinian Martyrs' Wills */}
        <article id="section-art-4" className="py-20 px-4 md:px-8 border-b border-[#222] scroll-mt-28">
          <div className="max-w-4xl mx-auto">
            <div className="border-s-4 border-[#D80032] ps-5 mb-8">
              <span className="text-[#D80032] font-mono text-xs font-bold uppercase tracking-wider block mb-1">
                {isAr ? 'النص ٠٥ // أرشيف وتوثيق' : 'TEXT 05 // HISTORICAL REGISTRY'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight mb-2">
                {isAr ? ARTICLES[3].titleAr : ARTICLES[3].titleEn}
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {isAr ? ARTICLES[3].readTimeAr : ARTICLES[3].readTimeEn}
              </span>
            </div>

            {/* Pull Quote */}
            <blockquote className="my-8 p-6 rounded-2xl bg-[#0E0E0E] border-s-4 border-[#D80032] text-white font-sans text-lg sm:text-xl font-semibold leading-relaxed shadow-lg">
              {isAr ? ARTICLES[3].pullQuoteAr : ARTICLES[3].pullQuoteEn}
            </blockquote>

            {/* Content Paragraphs */}
            <div className="space-y-6 text-neutral-300 font-sans text-base sm:text-lg leading-relaxed mb-10 whitespace-pre-line">
              {(isAr ? ARTICLES[3].contentAr : ARTICLES[3].contentEn).map((paragraph, idx) => (
                <p key={idx} className="bg-[#0B0B0B] border border-[#1A1A1A] p-5 rounded-2xl">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Prev / Top Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#222]">
              <button
                type="button"
                onClick={() => scrollToSection('section-art-3')}
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
              >
                {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                <span>{isAr ? 'السابق: حبر اليقين' : 'Previous: Ink of Certainty'}</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('toc')}
                className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-neutral-200 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <ArrowUp size={13} className="text-[#D80032]" />
                <span>{isAr ? 'العودة إلى فهرس العدد' : 'Back to Table of Contents'}</span>
              </button>
            </div>
          </div>
        </article>

        {/* Editorial Cross-Link & Newsletter */}
        <div className="max-w-4xl mx-auto px-4 md:px-0">
          <EditorialCommerceCrossLink lang={isAr ? 'ar' : 'en'} />
          <MidaanDispatchNewsletter variant="section" source="issue_zero_reader" lang={isAr ? 'ar' : 'en'} />
        </div>

        {/* Issue One Coming Soon Preview Banner */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-t from-[#0A0A0A] to-[#050505] border-t border-[#1F1F1F]">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#262626] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 end-0 w-48 h-48 bg-[#D80032]/10 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 text-[#D80032] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} />
              <span>{isAr ? 'الإصدار القادم' : 'NEXT PUBLICATION'}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white font-sans mb-4">
              {isAr ? 'العدد الأول — قريباً' : 'Issue One — Coming Soon'}
            </h3>

            <p className="text-neutral-300 font-sans text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
              {isAr
                ? '«خلف هذا الصمت الثقيل، عاصفة قادمة ستُكتب في العدد الأول». نواصل توثيق الرواية المستقلة والتعبير المدني الحر وأرشيف الذاكرة الحية.'
                : 'Behind this heavy silence lies a gathering storm that will unfold in Issue One. Continuing our documentation of independent narrative, civic expression, and living memory.'}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/magazine"
                className="bg-white hover:bg-neutral-200 text-black px-6 py-3.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg"
              >
                {isAr ? 'عرض أرشيف المجلة' : 'Explore Magazine Archive'}
              </Link>
              <Link
                href="/#drops"
                className="bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-neutral-200 hover:text-white px-6 py-3.5 rounded-xl text-xs font-bold transition-colors"
              >
                {isAr ? 'تصفح منتجات المتجر' : 'Browse Store Collection'}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
