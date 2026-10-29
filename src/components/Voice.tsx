'use client';

import React from 'react';
import { BookOpen, Film, Play, FileText, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';
import Link from 'next/link';
import { content } from '@/locales/dictionary';

export default function Voice() {
  const { lang, isDossierOpen, setIsDossierOpen } = useStore();
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

      

      {/* Cinema Dossier Modal */}
      {isDossierOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-[#262626] w-full max-w-2xl rounded-2xl p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsDossierOpen(false)}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
            >
              <ArrowRight size={24} className={isRtl ? 'rotate-180' : ''} />
            </button>
            
            <div className="mb-8 inline-flex p-4 bg-[#1A1A1A] border border-[#333] rounded-2xl">
              <Film size={32} className="text-white" />
            </div>

            <h2 className="text-3xl font-black text-white uppercase tracking-normal mb-2">Production Dossier</h2>
            <div className="text-sm font-mono text-[#D80032] tracking-normal uppercase mb-8">Status: Pre-Production</div>

            <div className="space-y-6 text-neutral-300 font-sans leading-relaxed">
              <p>Midaan Collective is currently developing a series of independent short films utilizing symbolic cinema and visual drama to explore themes of civil liberties, identity crisis, and grassroots resistance.</p>
              
              <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-xl space-y-4">
                <div className="flex justify-between border-b border-[#1A1A1A] pb-2">
                  <span className="font-mono text-xs text-neutral-500 uppercase">Working Title</span>
                  <span className="font-bold text-white">Project Aleph</span>
                </div>
                <div className="flex justify-between border-b border-[#1A1A1A] pb-2">
                  <span className="font-mono text-xs text-neutral-500 uppercase">Format</span>
                  <span className="font-bold text-white">16mm / Digital Hybrid</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-xs text-neutral-500 uppercase">Release</span>
                  <span className="font-bold text-white">Q4 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
