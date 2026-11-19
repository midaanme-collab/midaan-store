'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, BookOpen, Download, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { trackDownloadPdf } from '@/utils/analytics';
import { formatProductPrice } from '@/constants/products';
import { useStore } from '@/store';

interface EditorialCommerceCrossLinkProps {
  lang?: 'ar' | 'en';
}

export default function EditorialCommerceCrossLink({ lang: propLang }: EditorialCommerceCrossLinkProps) {
  const { lang: storeLang, currency } = useStore();
  const lang = propLang || storeLang || 'ar';
  const isAr = lang === 'ar';

  const priceText = formatProductPrice(currency, isAr ? 'ar' : 'en');

  return (
    <div 
      className="w-full bg-[#0D0D0D] border border-[#222] rounded-3xl p-6 sm:p-8 my-14 shadow-2xl relative overflow-hidden font-sans"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
        
        {/* Left: Limited-Edition Drop 01 Card */}
        <div className="flex-1 flex flex-col sm:flex-row gap-5 items-center w-full">
          <Link 
            href="/products/drop-helmet-white"
            className="w-full sm:w-36 h-36 bg-gradient-to-b from-[#181818] to-[#0E0E0E] rounded-2xl border border-[#262626] p-2 flex items-center justify-center shrink-0 group overflow-hidden relative"
            aria-label={isAr ? 'تيشيرت خوذة الكوفية' : 'Keffiyeh Helmet Tee'}
          >
            <div className="absolute top-2 start-2 z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 block" />
            </div>
            <Image
              src="/helmet-back-white.jpg"
              alt="Midaan × Sotusura Drop 01"
              width={140}
              height={140}
              className="w-4/5 h-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="flex-1 text-center sm:text-start">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#D80032] mb-1 font-mono">
              <Sparkles size={12} />
              <span>{isAr ? 'إصدار الميدان الأول // Sotusura' : 'MIDAAN × SOTUSURA // DROP 01'}</span>
            </div>
            <h4 className="text-lg font-black text-white leading-snug mb-1">
              <Link href="/products/drop-helmet-white" className="hover:text-[#D80032] transition-colors">
                {isAr ? 'تيشيرت خوذة الكوفية وبوستر فلسطين' : 'Keffiyeh Helmet & Palestine Poster Tees'}
              </Link>
            </h4>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              {isAr 
                ? 'قطن طبيعي ١٠٠٪ • طباعة مباشرة على النسيج (DTG) • شحن محلي ودولي'
                : '100% Cotton • Direct-to-Garment DTG Print • Worldwide Tracked Shipping'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="text-base font-black text-white font-mono" dir="ltr">
                {priceText}
              </span>
              <Link
                href="/#drops"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <ShoppingBag size={13} />
                <span>{isAr ? 'تسوق القطع الموثقة' : 'Shop Drop 01'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-32 bg-[#222]" />

        {/* Right: Issue Zero PDF & Archive Links */}
        <div className="w-full lg:w-72 bg-[#121212] border border-[#262626] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 font-mono">
              {isAr ? 'الأرشيف الموثق' : 'DOCUMENTED ARCHIVE'}
            </div>
            <h5 className="text-sm font-black text-white mb-2">
              {isAr ? 'مجلة ميدان — العدد صفر (انتحاب)' : 'Midaan Magazine — Issue Zero'}
            </h5>
            <p className="text-[11px] text-neutral-400 leading-relaxed mb-4">
              {isAr 
                ? 'وثيقة التأسيس والعهد و٥ أبحاث فكرية وتاريخية كاملة.'
                : 'Founding manifesto & 4 essays on identity and struggle.'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/magazine/issue-zero"
              className="w-full bg-[#1A1A1A] hover:bg-[#242424] text-neutral-200 hover:text-white border border-[#2E2E2E] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen size={13} className="text-[#D80032]" />
              <span>{isAr ? 'تصفح القارئ التفاعلي' : 'Interactive Reader'}</span>
              {isAr ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="/magazine/issue-zero.pdf"
                download="Midaan_Magazine_Issue_Zero_AR.pdf"
                onClick={() => trackDownloadPdf('ar')}
                className="bg-[#161616] hover:bg-[#202020] text-neutral-300 hover:text-white border border-[#262626] py-1.5 px-2 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 transition-colors text-center"
              >
                <Download size={11} className="text-[#D80032]" />
                <span>PDF عربي</span>
              </a>
              <a
                href="/magazine/issue-zero-en.pdf"
                download="Midaan_Magazine_Issue_Zero_EN.pdf"
                onClick={() => trackDownloadPdf('en')}
                className="bg-[#161616] hover:bg-[#202020] text-neutral-300 hover:text-white border border-[#262626] py-1.5 px-2 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 transition-colors text-center"
              >
                <Download size={11} className="text-[#D80032]" />
                <span>English PDF</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
