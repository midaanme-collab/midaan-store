'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';

export default function MagazineLanding() {
  const { lang } = useStore();
  const isRtl = lang === 'ar';
  
  return (
    <PageLayout>
      <div className="w-full bg-[#050505] min-h-screen py-24 px-4 md:px-8 font-sans border-t border-[#1A1A1A] relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-normal mb-4">
              Midaan Magazine
            </h1>
            <p className="text-neutral-400 font-sans text-lg max-w-2xl border-l-2 border-[#D80032] pl-4 ml-2">
              {isRtl 
                ? "إصدار فكري ثقافي مستقل يبحث في قضايا الهوية، التحولات الاجتماعية، ودور الفن في التعبير المدني." 
                : "An independent cultural and intellectual publication exploring identity, social transformations, and the role of art in civic expression."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Issue Zero */}
            <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-[#262626] rounded-2xl overflow-hidden group hover:border-[#D80032] transition-all shadow-2xl flex flex-col h-full transform hover:-translate-y-1">
              <div className="p-8 flex flex-col justify-between relative overflow-hidden border-b border-[#262626] bg-[#0A0A0A]">
                <div className="flex items-center justify-between z-10">
                  <div className="bg-[#1A1A1A] rounded-xl inline-flex p-3 w-fit border border-[#333]">
                    <BookOpen size={24} className="text-white group-hover:text-[#D80032] transition-colors" />
                  </div>
                  <div className="font-mono text-[10px] text-[#D80032] font-bold tracking-normal uppercase text-right">
                    Issue Zero (انتحاب)
                  </div>
                </div>
                <div className="z-10 mt-6">
                  <h3 className="text-3xl font-black text-white uppercase font-sans leading-none">
                    {isRtl ? 'العدد صفر' : 'Issue Zero'}
                  </h3>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <p className="text-sm text-neutral-400 font-sans mb-6 flex-1 leading-relaxed border-l border-[#333] pl-4">
                   {isRtl ? 'صراع الأرض والسماء، سأموت قبل الأربعين، وسجل وصايا الشهداء.' : 'The conflict of earth and sky, existential youth reflections, and the Palestinian martyr testaments.'}
                </p>
                <div className="flex gap-2 flex-wrap mb-8">
                  <span className="bg-[#1A1A1A] text-neutral-300 text-[9px] font-mono px-2 py-1 rounded border border-[#333]">EDITORIAL</span>
                  <span className="bg-[#1A1A1A] text-neutral-300 text-[9px] font-mono px-2 py-1 rounded border border-[#333]">YOUTH</span>
                  <span className="bg-[#1A1A1A] text-neutral-300 text-[9px] font-mono px-2 py-1 rounded border border-[#333]">RESISTANCE</span>
                </div>
                <Link 
                  href="/magazine/issue-zero"
                  className="w-full bg-white hover:bg-neutral-200 text-black py-4 font-mono text-[10px] font-black uppercase tracking-normal transition-colors rounded-xl flex items-center justify-center gap-2"
                >
                  {isRtl ? 'اقرأ العدد' : 'Read Issue'} <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Issue One (Draft) */}
            <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full opacity-60">
              <div className="p-8 flex flex-col justify-between relative overflow-hidden border-b border-[#262626] bg-[#0A0A0A]">
                <div className="flex items-center justify-between z-10">
                  <div className="bg-[#1A1A1A] rounded-xl inline-flex p-3 w-fit border border-[#333]">
                    <FileText size={24} className="text-neutral-600" />
                  </div>
                  <div className="font-mono text-[10px] text-neutral-500 font-bold tracking-normal uppercase text-right">
                    Issue One (Entihab)
                  </div>
                </div>
                <div className="z-10 mt-6">
                  <h3 className="text-3xl font-black text-neutral-500 uppercase font-sans leading-none">
                    {isRtl ? 'العدد الأول' : 'Issue One'}
                  </h3>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <p className="text-sm text-neutral-500 font-sans mb-6 flex-1 leading-relaxed border-l border-[#333] pl-4">
                  {isRtl ? 'قيد التحرير والمراجعة. سيتم الإعلان عن موعد النشر قريباً.' : 'Currently in drafting and editorial review. Publication date will be announced soon.'}
                </p>
                <button 
                  disabled
                  className="w-full bg-[#1A1A1A] text-neutral-600 border border-[#333] cursor-not-allowed py-4 font-mono text-[10px] font-black uppercase tracking-normal rounded-xl flex items-center justify-center gap-2"
                >
                  {isRtl ? 'قريباً' : 'Coming Soon'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
