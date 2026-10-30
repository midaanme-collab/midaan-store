'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import MidaanLogo from './MidaanLogo';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, setIsCartOpen, cart, currency, setCurrency } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#050505] text-[#EDEDED] transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b bg-[#050505]/95 border-[#1A1A1A] transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="h-16 md:h-20 flex items-center">
            <Link href="/" className="cursor-pointer" aria-label="Midaan Home">
              <MidaanLogo size="md" />
            </Link>
          </div>
          
          {/* Main Navigation Links */}
          <div className={`hidden md:flex items-center gap-8 ${isRtl ? 'font-sans text-sm font-medium' : 'font-sans text-sm font-semibold tracking-wide'}`}>
            <Link href="#drops" className="text-neutral-200 hover:text-[#D80032] transition-colors">
              {strings.nav.store}
            </Link>
            <Link href="/collab" className="text-[#D80032] hover:text-white transition-colors border border-[#D80032]/40 px-3.5 py-1.5 rounded-full bg-[#D80032]/10">
              {strings.nav.collab}
            </Link>
            <Link href="/magazine" className="text-neutral-200 hover:text-[#D80032] transition-colors">
              {strings.nav.magazine}
            </Link>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            {/* Currency Toggle */}
            <button 
              type="button"
              onClick={() => setCurrency(currency === 'JOD' ? 'USD' : 'JOD')}
              className="flex items-center gap-1.5 text-xs font-bold transition-colors border border-[#262626] bg-[#111] hover:bg-[#181818] hover:text-white text-neutral-200 px-3 py-1.5 rounded-lg shadow-sm"
              aria-label="Toggle Currency"
            >
              <span dir="ltr">{currency}</span>
            </button>

            {/* Language Toggle */}
            <button 
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 text-xs font-bold transition-colors border border-[#262626] bg-[#111] hover:bg-[#181818] hover:text-white text-neutral-200 px-3 py-1.5 rounded-lg shadow-sm"
              aria-label="Toggle Language"
            >
              <span>{strings.langBtn}</span>
            </button>

            {/* Bag / Cart Button */}
            <button 
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="bg-[#D80032] text-white hover:bg-[#B00028] px-4 py-1.5 text-xs font-bold flex items-center gap-2 transition-colors rounded-lg shadow-md active:scale-95"
              aria-label={strings.nav.cart}
            >
              <span>{strings.nav.cart}</span>
              {cart.length > 0 && (
                <span className="bg-white text-black px-1.5 rounded text-[10px] font-bold" dir="ltr">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-[#EDEDED] py-16 border-t border-[#1A1A1A] text-center flex flex-col items-center justify-center">
        <Link href="/" className="inline-block cursor-pointer mb-6" aria-label="Midaan">
          <MidaanLogo size="md" />
        </Link>
        
        {/* Navigation & WhatsApp Contacts */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-200 font-medium mb-6">
          <Link href="#drops" className="hover:text-white transition-colors">
            {strings.nav.store}
          </Link>
          <span className="text-neutral-600">•</span>
          <Link href="/collab" className="hover:text-white transition-colors">
            {strings.nav.collab}
          </Link>
          <span className="text-neutral-600">•</span>
          <Link href="/magazine" className="hover:text-white transition-colors">
            {strings.nav.magazine}
          </Link>
          <span className="text-neutral-600">•</span>
          <a 
            href="https://wa.me/962770125316" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-[#D80032] transition-colors flex items-center gap-1.5 text-neutral-100 font-semibold"
          >
            <span>{strings.footer.whatsappLabel}</span>
            <span dir="ltr">{strings.footer.whatsappNumber}</span>
          </a>
        </div>

        {/* Shipping & Order Confirmation Notice */}
        <p className="max-w-xl mx-auto px-4 text-xs text-neutral-400 leading-relaxed mb-6">
          {strings.footer.orderNotice}
        </p>

        {/* Rights */}
        <p className="text-xs text-neutral-500 font-medium">
          {strings.footer.rights}
        </p>
      </footer>
    </div>
  );
}
