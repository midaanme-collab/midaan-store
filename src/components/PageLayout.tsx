'use client';

import React from 'react';
import { ShoppingBag, Globe, Compass } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import MidaanLogo from './MidaanLogo';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, setIsCheckoutOpen } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';

  return (
    <div className={`min-h-screen bg-[#080808] flex flex-col font-sans ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Ticker */}
      <div className="bg-[#D80032] text-white py-1.5 overflow-hidden whitespace-nowrap border-b border-[#262626]">
        <div className="animate-pulse inline-block px-4 font-mono text-[10px] uppercase tracking-widest font-black">
          {strings.ticker}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <MidaanLogo size="sm" />
          
          <div className="hidden md:flex items-center gap-8 font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
            <a href="#studio" className="hover:text-white transition-colors">{strings.nav.studio}</a>
            <a href="#hub" className="hover:text-white transition-colors">{strings.nav.dome}</a>
            <a href="#voice" className="hover:text-white transition-colors">{strings.nav.advocacy}</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 hover:text-white transition-colors border border-[#262626] px-3 py-1.5 rounded bg-[#141414]"
            >
              <Globe size={14} />
              <span>{strings.langBtn}</span>
            </button>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-white text-black hover:bg-neutral-200 px-4 py-1.5 font-mono text-[10px] font-bold tracking-widest flex items-center gap-2 transition-colors rounded"
            >
              <ShoppingBag size={14} />
              <span className="hidden md:inline">{strings.nav.cart}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-[#1A1A1A] text-center">
        <MidaanLogo size="lg" />
        <div className="mt-6 flex justify-center gap-4 text-neutral-500">
          <Compass size={20} className="hover:text-[#D80032] transition-colors cursor-pointer" />
          <Globe size={20} className="hover:text-[#D80032] transition-colors cursor-pointer" />
        </div>
        <p className="mt-8 font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
          {strings.hero.tag} • 2026
        </p>
      </footer>
    </div>
  );
}
