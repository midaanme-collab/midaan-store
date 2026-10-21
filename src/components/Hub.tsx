'use client';

import React from 'react';
import { Users, Calendar, MapPin, Printer } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { HUB_WORKSHOPS } from '@/constants';

export default function Hub() {
  const { lang, setIsWorkshopModalOpen, setSelectedWorkshop } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';

  return (
    <section id="hub" className="w-full bg-[#111] py-20 px-4 md:px-8 border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        <div className="md:w-1/3">
          <div className="inline-block bg-[#D80032] text-white px-3 py-1 font-mono text-[10px] font-bold tracking-widest uppercase mb-4">
            {strings.hubBadge}
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
            {strings.hubSectionTitle}
          </h2>
          <p className="text-neutral-400 leading-relaxed font-sans font-medium mb-8">
            {strings.hubSectionDesc}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1A1A1A] border border-[#333] rounded shrink-0">
                <Printer size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 font-sans">{strings.hubFeature1Title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">{strings.hubFeature1Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1A1A1A] border border-[#333] rounded shrink-0">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 font-sans">{strings.hubFeature2Title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">{strings.hubFeature2Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1A1A1A] border border-[#333] rounded shrink-0">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 font-sans">{strings.hubFeature3Title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">{strings.hubFeature3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 w-full">
          <h3 className="font-mono text-xs font-bold text-[#D80032] uppercase tracking-widest mb-6 pb-2 border-b border-[#262626]">
            {strings.upcomingWorkshopsTitle}
          </h3>
          <div className="space-y-4">
            {HUB_WORKSHOPS.map((workshop) => (
              <div key={workshop.id} className="bg-[#1A1A1A] border border-[#333] hover:border-white transition-colors rounded p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between group">
                <div className="space-y-2 flex-1">
                  <h4 className="font-black text-xl text-white group-hover:text-[#D80032] transition-colors font-sans">
                    {isRtl ? workshop.titleAr : workshop.titleEn}
                  </h4>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-400">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {isRtl ? workshop.dateAr : workshop.dateEn}</span>
                    <span className="text-[#333]">|</span>
                    <span className="text-white">{isRtl ? workshop.durationAr : workshop.durationEn}</span>
                    <span className="text-[#333]">|</span>
                    <span className="text-green-500">{isRtl ? workshop.priceAr : workshop.priceEn}</span>
                  </div>
                  <p className="text-sm text-neutral-400 font-sans mt-3">
                    {isRtl ? workshop.descAr : workshop.descEn}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedWorkshop(isRtl ? workshop.titleAr : workshop.titleEn);
                    setIsWorkshopModalOpen(true);
                  }}
                  className="bg-white text-black hover:bg-[#D80032] hover:text-white px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors rounded whitespace-nowrap"
                >
                  {strings.joinWorkshopBtn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
