'use client';

import React from 'react';
import { ShoppingBag, Globe, Compass, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import MidaanLogo from './MidaanLogo';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, setIsCartOpen, theme, setTheme, cart, currency, setCurrency } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  // Theme logic map
  const bgClass = theme === 'dark' ? 'bg-[#050505] text-[#F4F4F0]' : 'bg-[#F4F0EA] text-[#111]';
  const headerBgClass = theme === 'dark' ? 'bg-[#050505]/90 border-[#1A1A1A]' : 'bg-[#F4F0EA]/90 border-[#111]/10';

  return (
    <div className={`min-h-screen flex flex-col font-sans ${bgClass} transition-colors duration-500`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${headerBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="h-16 md:h-20 flex items-center">
             <Link href="/" className="cursor-pointer">
               <MidaanLogo size="md" />
             </Link>
          </div>
          
          <div className={`hidden md:flex items-center gap-8 font-mono text-xs font-bold ${isRtl ? "tracking-normal" : "uppercase tracking-normal"}`}>
            <Link href="#drops" className="hover:text-[#D80032] transition-colors">{isRtl ? 'القطع والمنتجات' : 'Drops'}</Link>
            <Link href="#collab" className="text-[#D80032] hover:text-white transition-colors border border-[#D80032]/30 px-3 py-1.5 rounded-full bg-[#D80032]/10">{isRtl ? 'التعاون // Collab' : 'Collab // تعاون'}</Link>
            <Link href="/magazine" className="hover:text-[#D80032] transition-colors">{isRtl ? 'المجلة المستقلة' : 'Magazine'}</Link>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center gap-2 font-mono text-[10px] transition-colors border px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'border-[#262626] bg-[#111] hover:text-white' : 'border-[#111]/20 bg-white hover:text-black'}`}
              aria-label="Toggle Theme"
            >
              <span>{isRtl ? (theme === 'dark' ? 'مضيء' : 'داكن') : (theme === 'dark' ? 'Light' : 'Dark')}</span>
            </button>
            <button 
              onClick={() => setCurrency(currency === 'JOD' ? 'USD' : 'JOD')}
              className={`flex items-center gap-2 font-mono text-[10px] font-bold transition-colors border px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'border-[#262626] bg-[#111] hover:text-white' : 'border-[#111]/20 bg-white hover:text-black'}`}
              aria-label="Toggle Currency"
            >
              <span>{currency}</span>
            </button>
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={`flex items-center gap-2 font-mono text-[10px] font-bold transition-colors border px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'border-[#262626] bg-[#111] hover:text-white' : 'border-[#111]/20 bg-white hover:text-black'}`}
              aria-label="Toggle Language"
            >
              <span>{strings.langBtn}</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`bg-[#D80032] text-white hover:bg-[#B00028] px-4 py-1.5 font-mono text-[10px] font-bold flex items-center gap-2 transition-colors rounded-lg shadow-md ${isRtl ? "tracking-normal" : "tracking-normal"}`}
              aria-label="Open Cart"
            >
              <span>{strings.nav.cart}</span>
              {cart.length > 0 && <span className="bg-white text-black px-1.5 rounded text-[9px] font-mono font-bold">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#111] text-[#F4F4F0] py-16 border-t border-[#1A1A1A] text-center flex flex-col items-center justify-center">
        <Link href="/" className="inline-block cursor-pointer">
          <MidaanLogo size="md" />
        </Link>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-mono">
          <a 
            href="https://wa.me/962770125316" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>WhatsApp:</span>
            <span dir="ltr">+962 7 7012 5316</span>
          </a>
          <Link href="/magazine" className="hover:text-white transition-colors">
            {isRtl ? 'المجلة' : 'Magazine'}
          </Link>
          <Link href="/collab" className="hover:text-white transition-colors">
            {isRtl ? 'التعاون' : 'Collaboration'}
          </Link>
        </div>
        <p className={`mt-6 font-mono text-xs text-neutral-600 ${isRtl ? "tracking-normal" : "uppercase tracking-normal"}`}>
          {isRtl ? 'ميدان • جميع الحقوق محفوظة 2026' : 'Midaan • All Rights Reserved 2026'}
        </p>
      </footer>
    </div>
  );
}
