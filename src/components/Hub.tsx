'use client';

import React from 'react';
import { Users, Calendar, MapPin, Printer, Tag } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { HUB_WORKSHOPS } from '@/constants';

export default function Hub() {
  const { lang, setIsWorkshopModalOpen, setSelectedWorkshop } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';

  return (
    <section id="hub" className="w-full bg-[#0A0A0A] py-24 px-4 md:px-8 border-t border-[#1A1A1A] relative overflow-hidden">
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '64px 64px' }}>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start relative z-10">
        <div className="lg:w-1/3 sticky top-24">
          <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#333] text-white px-4 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-6 rounded-lg">
            {strings.hubBadge}
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-[0.9]">
            {strings.hubSectionTitle}
          </h2>
          <p className="text-neutral-400 leading-relaxed font-sans font-medium text-lg mb-10 border-l-2 border-[#D80032] pl-4 ml-2">
            {strings.hubSectionDesc}
          </p>

          <div className="space-y-8 bg-[#111] border border-[#262626] p-8 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1A1A1A] border border-[#333] rounded-xl shrink-0">
                <Printer size={20} className="text-[#D80032]" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 font-sans">{strings.hubFeature1Title}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-sans">{strings.hubFeature1Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1A1A1A] border border-[#333] rounded-xl shrink-0">
                <Users size={20} className="text-[#D80032]" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 font-sans">{strings.hubFeature2Title}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-sans">{strings.hubFeature2Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1A1A1A] border border-[#333] rounded-xl shrink-0">
                <MapPin size={20} className="text-[#D80032]" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 font-sans">{strings.hubFeature3Title}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-sans">{strings.hubFeature3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3 w-full">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#262626]">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">
              {strings.upcomingWorkshopsTitle}
            </h3>
            <div className="font-mono text-[9px] text-[#D80032] border border-[#D80032]/30 bg-[#D80032]/10 px-2 py-1 rounded">LIVE SCHEDULE</div>
          </div>

          <div className="space-y-6">
            {HUB_WORKSHOPS.map((workshop, idx) => (
              <div key={workshop.id} className="bg-gradient-to-r from-[#111] to-[#0A0A0A] border border-[#262626] hover:border-white transition-all duration-300 rounded-2xl p-8 flex flex-col md:flex-row gap-8 md:items-center justify-between group shadow-xl hover:-translate-y-1">
                
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#D80032] text-white text-[9px] font-mono font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {isRtl ? 'مقاعد محدودة: 5' : 'Limited Seats: 5 Left'}
                    </span>
                    {idx === 0 && (
                      <span className="bg-[#1A1A1A] border border-[#333] text-neutral-300 text-[9px] font-mono font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                        <Tag size={10} /> KingJet 602A
                      </span>
                    )}
                  </div>

                  <h4 className="font-black text-2xl text-white group-hover:text-[#D80032] transition-colors font-sans leading-tight">
                    {isRtl ? workshop.titleAr : workshop.titleEn}
                  </h4>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-neutral-500 bg-[#050505] border border-[#1A1A1A] p-3 rounded-xl inline-flex w-fit">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-white" /> {isRtl ? workshop.dateAr : workshop.dateEn}</span>
                    <span className="flex items-center gap-2 text-white">{isRtl ? workshop.durationAr : workshop.durationEn}</span>
                    <span className="flex items-center gap-2 text-[#D80032] font-bold">{isRtl ? workshop.priceAr : workshop.priceEn}</span>
                  </div>
                  
                  <p className="text-sm text-neutral-400 font-sans leading-relaxed pt-2">
                    {isRtl ? workshop.descAr : workshop.descEn}
                  </p>
                </div>
                
                <div className="shrink-0">
                  <button
                    onClick={() => {
                      setSelectedWorkshop(isRtl ? workshop.titleAr : workshop.titleEn);
                      setIsWorkshopModalOpen(true);
                    }}
                    className="w-full md:w-auto bg-white text-black hover:bg-neutral-200 px-8 py-4 font-mono text-[10px] font-black uppercase tracking-[0.2em] transition-transform active:scale-95 rounded-xl whitespace-nowrap shadow-lg"
                  >
                    {strings.joinWorkshopBtn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
