'use client';

import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';
import Link from 'next/link';
import { content } from '@/locales/dictionary';

export default function Voice() {
  const { lang } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  

  return (
    <>
      <section id="voice" className="w-full bg-[#050505] py-24 px-4 md:px-8 border-t border-[#1A1A1A] relative overflow-hidden">
        {/* Editorial Grid Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start relative z-10">
          <div className="md:w-1/3 sticky top-24">
            <div className="inline-flex items-center gap-2 bg-[#D80032] text-white px-4 py-1.5 font-mono text-[10px] font-bold tracking-normal uppercase mb-6 shadow-[0_0_15px_rgba(216,0,50,0.5)]">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              {strings.voiceBadge}
            </div>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-normal text-white mb-6 leading-[0.9]">
              {strings.voiceSectionTitle}
            </h2>
            <p className="text-neutral-400 leading-relaxed font-sans font-medium text-lg border-l-2 border-[#262626] pl-4 ml-2">
              {strings.voiceSectionDesc}
            </p>
          </div>

          <div className="md:w-2/3 w-full grid grid-cols-1 md:grid-cols-1 gap-8">
            {/* Magazine Editorial Card */}
            <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-[#262626] rounded-2xl overflow-hidden group hover:border-[#D80032] transition-all shadow-2xl flex flex-col h-full transform hover:-translate-y-1">
              <div className="p-8 flex flex-col justify-between relative overflow-hidden border-b border-[#262626] bg-[#0A0A0A]">
                <div className="flex items-center justify-between z-10">
                  <div className="bg-[#1A1A1A] rounded-xl inline-flex p-3 w-fit border border-[#333]">
                    <BookOpen size={24} className="text-white group-hover:text-[#D80032] transition-colors" />
                  </div>
                  <div className="font-mono text-[10px] text-[#D80032] font-bold tracking-normal uppercase text-right">Issue Zero (انتحاب)</div>
                </div>
                <div className="z-10 mt-6">
                  <h3 className="text-3xl font-black text-white uppercase font-sans leading-none">
                    Midaan Magazine
                  </h3>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <p className="text-sm text-neutral-400 font-sans mb-6 flex-1 leading-relaxed border-l border-[#333] pl-4">
                  {strings.magazineDesc}
                </p>
                <div className="flex gap-2 flex-wrap mb-8">
                  <span className="bg-[#1A1A1A] text-neutral-300 text-[9px] font-mono px-2 py-1 rounded border border-[#333]">EDITORIAL</span>
                  <span className="bg-[#1A1A1A] text-neutral-300 text-[9px] font-mono px-2 py-1 rounded border border-[#333]">YOUTH</span>
                  <span className="bg-[#1A1A1A] text-neutral-300 text-[9px] font-mono px-2 py-1 rounded border border-[#333]">CULTURE</span>
                </div>
                <Link 
                  href="/magazine"
                  className="w-full bg-white hover:bg-neutral-200 text-black py-4 font-mono text-[10px] font-black uppercase tracking-normal transition-colors rounded-xl flex items-center justify-center gap-2"
                >
                  {strings.readIssueBtn} <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
