'use client';

import React from 'react';
import { ShoppingBag, Globe, Compass, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import MidaanLogo from './MidaanLogo';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, setIsCartOpen, theme, setTheme, cart } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  // Theme logic map
  const bgClass = theme === 'dark' ? 'bg-[#050505] text-[#F4F4F0]' : 'bg-[#F4F0EA] text-[#111]';
  const headerBgClass = theme === 'dark' ? 'bg-[#050505]/95 border-[#1A1A1A]' : 'bg-[#F4F0EA]/95 border-[#111]/10';

  const cartTotalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className={`min-h-screen flex flex-col font-sans ${bgClass} transition-colors duration-500`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${headerBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="cursor-pointer py-1 flex items-center" aria-label="Midaan Home">
              <MidaanLogo size="nav" />
            </Link>
          </div>
          
          <div className={`hidden md:flex items-center gap-8 font-mono text-xs font-bold ${isRtl ? "tracking-normal" : "uppercase tracking-normal"}`}>
            <Link href="/#drops" className="hover:text-[#D80032] transition-colors">
              {isRtl ? "القطع الحصرية" : "Exclusive Drops"}
            </Link>
            <Link href="/#collab" className="hover:text-[#D80032] transition-colors">
              {isRtl ? "فيديو الحملة" : "Campaign Video"}
            </Link>
            <Link href="/#advocacy" className="hover:text-[#D80032] transition-colors">
              {isRtl ? "صوت ميدان" : "The Voice"}
            </Link>
            <Link 
              href="/collab" 
              className="text-[#D80032] hover:text-white transition-all border border-[#D80032]/40 hover:border-[#D80032] px-3.5 py-1.5 rounded-lg bg-[#D80032]/10 font-bold flex items-center gap-2"
            >
              <span>Midaan × Sotusura</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-full border transition-colors ${theme === 'dark' ? 'border-[#262626] bg-[#111] hover:text-white' : 'border-[#111]/20 bg-white hover:text-black'}`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={`flex items-center gap-2 font-mono text-xs transition-colors border px-3 py-2 rounded-lg font-bold ${theme === 'dark' ? 'border-[#262626] bg-[#111] hover:text-white' : 'border-[#111]/20 bg-white hover:text-black'}`}
              aria-label="Change Language"
            >
              <Globe size={15} />
              <span>{strings.langBtn}</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-[#D80032] hover:bg-[#B00028] text-white px-4 md:px-5 py-2 font-mono text-xs font-bold flex items-center gap-2 transition-all rounded-lg shadow-lg hover:shadow-[#D80032]/30 active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingBag size={16} />
              <span className="hidden md:inline">{strings.nav.cart}</span>
              {cartTotalQuantity > 0 && (
                <span className="bg-white text-black font-black px-1.5 py-0.5 rounded text-[10px]">
                  {cartTotalQuantity}
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
      <footer className="bg-[#0A0A0A] text-[#F4F4F0] py-16 border-t border-[#1A1A1A] text-center">
        <Link href="/" className="inline-block cursor-pointer mb-6" aria-label="Midaan Home">
          <MidaanLogo size="lg" />
        </Link>
        <div className="flex justify-center gap-6 text-neutral-500 mb-6">
          <a href="https://wa.me/962770125316" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors" title="WhatsApp">
            <span className="font-mono text-xs font-bold">+962 7 7012 5316</span>
          </a>
        </div>
        <p className={`font-mono text-xs text-neutral-500 ${isRtl ? "tracking-normal" : "uppercase tracking-normal"}`}>
          {isRtl 
            ? "تجمع ميدان • ستوديو الرابية، عمّان، الأردن • جميع الحقوق محفوظة 2026" 
            : "Midaan Collective • Al-Rabieh Studio, Amman, Jordan • All Rights Reserved 2026"}
        </p>
      </footer>
    </div>
  );
}
