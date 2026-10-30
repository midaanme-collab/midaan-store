'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Globe } from 'lucide-react';
import { useStore } from '@/store';

export default function IssueZeroReader() {
  const { lang, setLang } = useStore();
  const isRtl = lang === 'ar';
  const pdfSrc = isRtl ? '/magazine/issue-zero.pdf' : '/magazine/issue-zero-en.pdf';

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Midaan Magazine — Issue Zero (انتحاب / Entihab)",
            "description": "إصدار فكري ثقافي مستقل يبحث في قضايا الهوية، التحولات الاجتماعية، ودور الفن في التعبير المدني.",
            "author": {
              "@type": "Organization",
              "name": "Midaan Collective"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Midaan Collective",
              "logo": {
                "@type": "ImageObject",
                "url": "https://midaan-store.midaanme.workers.dev/logo.png"
              }
            }
          })
        }}
      />
      <div className="w-full bg-[#050505] min-h-screen py-10 px-4 md:px-8 font-sans border-t border-[#1A1A1A]" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto flex flex-col h-[85vh]">
          
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <Link 
              href="/magazine"
              className="text-neutral-400 hover:text-white flex items-center gap-2 text-xs font-semibold transition-colors"
            >
              {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              <span>{isRtl ? 'العودة إلى المجلة' : 'Back to Magazine'}</span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setLang(isRtl ? 'en' : 'ar')}
                className="bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-neutral-200 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Globe size={13} className="text-[#D80032]" />
                <span>{isRtl ? 'English Edition (PDF)' : 'النسخة العربية (PDF)'}</span>
              </button>

              {/* Download Active Edition */}
              <a 
                href={pdfSrc} 
                download={isRtl ? "Midaan_Magazine_Issue_Zero_AR.pdf" : "Midaan_Magazine_Issue_Zero_EN.pdf"}
                className="bg-[#D80032] hover:bg-[#B00028] text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-md"
              >
                <Download size={14} />
                <span>{isRtl ? 'تحميل PDF (عربي)' : 'Download PDF (EN)'}</span>
              </a>
            </div>
          </div>

          <div className="flex-1 w-full bg-neutral-900 border border-[#262626] rounded-2xl overflow-hidden shadow-2xl relative">
            <iframe 
              key={pdfSrc}
              src={`${pdfSrc}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
              className="absolute inset-0 w-full h-full border-0" 
              title={isRtl ? "مجلة ميدان — العدد صفر" : "Midaan Magazine — Issue Zero"}
            />
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
}
