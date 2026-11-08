'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import { useStore } from '@/store';
import Link from 'next/link';
import { BookOpen, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
  const { lang } = useStore();
  const isAr = lang === 'ar';

  return (
    <PageLayout>
      <div 
        className="w-full bg-[#050505] text-[#EDEDED] min-h-screen py-16 md:py-24 px-4 md:px-8 font-sans transition-colors"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="max-w-4xl mx-auto">
          
          {/* Header Badge */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#D80032]/10 border border-[#D80032]/30 text-[#D80032] px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D80032] animate-pulse" />
              <span>{isAr ? 'البيان والرؤية' : 'Manifesto & Vision'}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight font-sans mb-6">
              {isAr ? 'ميدان: مساحة للإبداع والتعبير والمناصرة' : 'Midaan: Space for Creativity, Expression & Advocacy'}
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 font-sans leading-relaxed max-w-2xl mx-auto font-normal">
              {isAr 
                ? 'مبادرة فكرية وثقافية ومساحة تعبيرية مستقلة، انطلقت من عمّان لتوثيق صوت الشارع، حراسة الرواية، وجعل الفن والكلمة متراساً للدفاع عن الهوية.'
                : 'An independent intellectual and cultural initiative born in Amman, documenting the pulse of the street, guarding the narrative, and transforming art and words into barricades of identity.'}
            </p>
          </div>

          {/* Core Story / Pillars */}
          <div className="space-y-12">
            
            {/* 1. The Arena (الميدان) */}
            <section className="bg-gradient-to-br from-[#111] via-[#0D0D0D] to-[#080808] border border-[#222] rounded-3xl p-8 sm:p-12 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-5 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D80032]" />
                <span>{isAr ? 'لماذا «ميدان»؟' : 'Why "Midaan"?'}</span>
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-neutral-300 leading-[1.9]">
                <p>
                  {isAr 
                    ? 'في هذا الميدان، نحن لا نكتب الرثاء، بل نوثق النبض الذي لا يموت. لم يكن الميدان يوماً مجرد حيز جغرافي أو ساحة خرسانية، بل هو فضاء تلتقي فيه أصوات الأحرار، وتتشابك فيه تضحيات الشهداء مع يقين البقاء.'
                    : 'In this arena, we do not write elegies; we document a pulse that does not die. The Midaan was never merely a geographic plot or concrete square; it is a living space where free voices converge, and where sacrifices interlock with the certainty of survival.'}
                </p>
                <p>
                  {isAr 
                    ? 'لقد ظنوا أن الساحات قد فرغت، لكن «الميدان» لم يُخلَ ولن يُخلى؛ فما دامت المقاومة فكرة، والفكرة لا تُغتال، فإن المعركة الثقافية مستمرة تتوارثها الأجيال حتى لحظة التحرير والعدالة.'
                    : 'They believed the squares had been emptied, but the Midaan has never been abandoned nor will it ever be. As long as resistance remains an idea—and an idea cannot be assassinated—the cultural struggle endures, passed down through generations until justice is realized.'}
                </p>
              </div>
            </section>

            {/* 2. Dual Expression: The Magazine & The Wearables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Publication Wing */}
              <div className="bg-[#0E0E0E] border border-[#262626] rounded-3xl p-8 flex flex-col justify-between hover:border-[#D80032]/60 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#D80032]/10 border border-[#D80032]/30 flex items-center justify-center text-[#D80032] mb-6">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">
                    {isAr ? 'المجلة الفكرية (العدد صفر)' : 'Intellectual Review (Issue Zero)'}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {isAr
                      ? 'إصدار دوري يجمع الفكر والتحليل السياسي والتوثيق الأرشيفي. يضم العدد صفر («انتحاب») أربعة نصوص محورية تبحث في صراع الأرض والسماء، وسقوط السستم، والسكينة النفسية لكتّاب الوصايا، وسجل وثائقي لوصايا الشهداء الخالدين.'
                      : 'A periodic review merging political critique, philosophy, and archival documentation. Issue Zero ("Entihab") gathers four foundational texts exploring the faith-geography conflict, existential refusal of "the system", the psychology of certainty, and a primary register of Palestinian wills.'}
                  </p>
                </div>
                <Link 
                  href="/magazine/issue-zero"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#D80032] hover:text-white transition-colors"
                >
                  <span>{isAr ? 'تصفح وقراءة العدد التأسيسي' : 'Explore & Read Issue Zero'}</span>
                  {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </Link>
              </div>

              {/* Cultural Apparel Wing */}
              <div className="bg-[#0E0E0E] border border-[#262626] rounded-3xl p-8 flex flex-col justify-between hover:border-[#D80032]/60 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-6">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">
                    {isAr ? 'القطع التعبيرية المحدودة' : 'Tangible Cultural Apparel'}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {isAr
                      ? 'أزياء وقطع فنية وثائقية صُنعت لترتدي الرواية في الشارع. بالتعاون مع صوت وصورة، نقدم قطعاً منسوجة بحرفية وبطباعة مباشرة على النسيج (DTG)، تمثل امتداداً مادياً للرسالة الفكرية للميدان.'
                      : 'Physical garments designed to carry the narrative into public spaces. Crafted in partnership with Sotusura using artisan Indonesian textile craft and precision DTG printing, serving as a tangible embodiment of Midaan’s editorial stance.'}
                  </p>
                </div>
                <Link 
                  href="/collab"
                  className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#D80032] transition-colors"
                >
                  <span>{isAr ? 'استكشف مجموعة التعاون' : 'Discover the Collaboration'}</span>
                  {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </Link>
              </div>

            </div>

            {/* 3. Principles of Integrity & Transparency */}
            <section className="bg-[#101010] border border-[#222] rounded-3xl p-8 sm:p-10 text-neutral-300">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={24} className="text-[#D80032]" />
                <h3 className="text-xl font-black text-white">
                  {isAr ? 'التزام التوثيق والأصالة' : 'Commitment to Authenticity'}
                </h3>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                {isAr 
                  ? 'يلتزم ميدان بالنزاهة التحريرية والتصنيعية الكاملة: لا نطلق ادعاءات غير موثقة، ولا نسوق لأرقام وهمية. نوثق الرواية كما عاشها أصحابها، ونطرح قطعاً حرفية محدودة معلنة الأصول والمواصفات دون زيادة أو تزييف.'
                  : 'Midaan is committed to full editorial and production integrity: we make no unverified claims or commercial hype. We preserve texts exactly as penned by their authors, and produce limited artisan apparel with transparent material origins and honest specifications.'}
              </p>
              <div className="pt-4 border-t border-[#222] flex flex-wrap gap-4 text-xs text-neutral-400">
                <span>• {isAr ? 'مبادرة تأسست وصُممت فكرياً في عمّان ببوصلة تركز على فلسطين' : 'Founded & Conceptually Designed in Amman, Palestine-Focused'}</span>
                <span>• {isAr ? 'تصنيع إندونيسي حرفي (260 جم مع طباعة DTG مباشرة)' : 'Artisan Indonesian Craft (260 GSM Heavy Cotton, DTG Print)'}</span>
                <span>• {isAr ? 'أرشيف مفتوح وحرية نشر مسؤولة' : 'Open Archive & Editorial Independence'}</span>
              </div>
            </section>

          </div>

          {/* Bottom Actions */}
          <div className="mt-16 pt-8 border-t border-[#1F1F1F] flex flex-wrap items-center justify-between gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span>{isAr ? 'العودة إلى الصفحة الرئيسية' : 'Return to Home'}</span>
            </Link>

            <a
              href="https://wa.me/962770125316"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg"
            >
              <span>{isAr ? 'تواصل مع فريق ميدان عبر واتساب' : 'Contact Midaan Team on WhatsApp'}</span>
            </a>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
