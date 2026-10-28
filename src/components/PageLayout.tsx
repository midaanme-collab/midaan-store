'use client';

import React from 'react';
import { ShoppingBag, Globe, Compass, Moon, Sun } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import MidaanLogo from './MidaanLogo';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, setIsCartOpen, theme, setTheme, cart } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  // Theme logic map
  const bgClass = theme === 'dark' ? 'bg-[#050505] text-[#F4F4F0]' : 'bg-[#F4F0EA] text-[#111]';
  const headerBgClass = theme === 'dark' ? 'bg-[#050505]/90 border-[#1A1A1A]' : 'bg-[#F4F0EA]/90 border-[#111]/10';

  return (
    <div className={`min-h-screen flex flex-col font-sans ${bgClass} transition-colors duration-500`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${headerBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="h-16 md:h-20 flex items-center">
             <MidaanLogo size="lg" />
          </div>
          
          <div className={`hidden md:flex items-center gap-8 font-mono text-[10px] font-bold ${isRtl ? "tracking-normal" : "uppercase tracking-normal"}`}>
            <a href="#advocacy" className="hover:text-[#D80032] transition-colors">{}{strings.nav.advocacy}</a>
            <a href="/collab" className="text-[#D80032] hover:text-white transition-colors border border-[#D80032]/30 px-3 py-1 rounded bg-[#D80032]/10">Collab // تعاون</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-full border transition-colors ${theme === 'dark' ? 'border-[#262626] bg-[#111] hover:text-white' : 'border-[#111]/20 bg-white hover:text-black'}`}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={`flex items-center gap-2 font-mono text-[10px] transition-colors border px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'border-[#262626] bg-[#111] hover:text-white' : 'border-[#111]/20 bg-white hover:text-black'}`}
            >
              <Globe size={14} />
              <span>{strings.langBtn}</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`bg-[#D80032] text-white hover:bg-[#111] px-4 py-1.5 font-mono text-[10px] font-bold flex items-center gap-2 transition-colors rounded-lg shadow-md ${isRtl ? "tracking-normal" : "tracking-normal"}`}
            >
              <ShoppingBag size={14} />
              <span className="hidden md:inline">{}{strings.nav.cart}</span>
              {cart.length > 0 && <span className="bg-white text-black px-1.5 rounded text-[9px]">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#111] text-[#F4F4F0] py-16 border-t border-[#1A1A1A] text-center">
        <MidaanLogo size="lg" />
        <div className="mt-8 flex justify-center gap-6 text-neutral-500">
          <Compass size={24} className="hover:text-[#D80032] transition-colors cursor-pointer" />
          <Globe size={24} className="hover:text-[#D80032] transition-colors cursor-pointer" />
        </div>
        <p className={`mt-8 font-mono text-xs text-neutral-600 ${isRtl ? "tracking-normal" : "uppercase tracking-normal"}`}>
          {}
          {strings.hero.tag} • 2026
        </p>
      </footer>
    </div>
  );
}
