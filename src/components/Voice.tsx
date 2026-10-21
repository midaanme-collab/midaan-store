'use client';

import React, { useState } from 'react';
import { BookOpen, Film } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';

export default function Voice() {
  const { lang } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  return (
    <>
      <section id="voice" className="w-full bg-[#080808] py-20 px-4 md:px-8 border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3">
            <div className="inline-block bg-[#D80032] text-white px-3 py-1 font-mono text-[10px] font-bold tracking-widest uppercase mb-4">
              {strings.voiceBadge}
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
              {strings.voiceSectionTitle}
            </h2>
            <p className="text-neutral-400 leading-relaxed font-sans font-medium mb-8">
              {strings.voiceSectionDesc}
            </p>
          </div>

          <div className="md:w-2/3 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Magazine */}
            <div className="bg-[#141414] border border-[#262626] rounded p-8 group hover:border-[#D80032] transition-colors flex flex-col h-full">
              <div className="mb-6 p-4 bg-[#1A1A1A] rounded inline-block">
                <BookOpen size={32} className="text-white group-hover:text-[#D80032] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase font-sans">
                {strings.magazineTitle}
              </h3>
              <p className="text-sm text-neutral-400 font-sans mb-8 flex-1 leading-relaxed">
                {strings.magazineDesc}
              </p>
              <button 
                onClick={() => setIsPdfModalOpen(true)}
                className="w-full bg-black border border-[#333] hover:border-white text-white py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors rounded"
              >
                {strings.readIssueBtn}
              </button>
            </div>

            {/* Cinema */}
            <div className="bg-[#141414] border border-[#262626] rounded p-8 group hover:border-white transition-colors flex flex-col h-full">
              <div className="mb-6 p-4 bg-[#1A1A1A] rounded inline-block">
                <Film size={32} className="text-white group-hover:text-[#D80032] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase font-sans">
                {strings.cinemaTitle}
              </h3>
              <p className="text-sm text-neutral-400 font-sans mb-8 flex-1 leading-relaxed">
                {strings.cinemaDesc}
              </p>
              <div className="w-full bg-[#1A1A1A] border border-[#333] text-neutral-500 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-center rounded">
                {isRtl ? 'قريباً / Coming Soon' : 'IN PRODUCTION'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Modal directly embedded for local state management */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#262626] w-full max-w-5xl h-[90vh] rounded-xl flex flex-col overflow-hidden relative shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-[#1A1A1A] bg-[#141414]">
              <h3 className="text-white font-bold font-sans uppercase tracking-widest text-xs">
                {strings.magazineTitle}
              </h3>
              <button 
                onClick={() => setIsPdfModalOpen(false)}
                className="text-neutral-500 hover:text-white font-mono text-xs uppercase tracking-widest bg-[#1A1A1A] px-3 py-1 rounded"
              >
                {strings.close}
              </button>
            </div>
            <div className="flex-1 w-full relative bg-[#111]">
              <iframe 
                src="/magazine/issue-zero.pdf#toolbar=0" 
                className="absolute inset-0 w-full h-full border-0" 
                title={strings.magazineTitle}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
