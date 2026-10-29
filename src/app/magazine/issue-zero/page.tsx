'use client';

import React from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { useStore } from '@/store';

export default function IssueZeroReader() {
  const { lang } = useStore();
  const isRtl = lang === 'ar';

  return (
    <PageLayout>
      <div className="w-full bg-[#050505] min-h-screen py-12 px-4 md:px-8 font-sans border-t border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto flex flex-col h-[85vh]">
          
          <div className="flex justify-between items-center mb-6">
            <Link 
              href="/magazine"
              className="text-neutral-500 hover:text-white flex items-center gap-2 font-mono text-xs uppercase tracking-normal transition-colors"
            >
              <ArrowLeft size={14} className={isRtl ? 'rotate-180' : ''} />
              {isRtl ? 'العودة للمجلة' : 'Back to Magazine'}
            </Link>

            <a 
              href="/magazine/issue-zero.pdf" 
              download="Midaan_Magazine_Issue_Zero.pdf"
              className="bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-mono text-[10px] uppercase font-bold transition-colors"
            >
              <Download size={14} />
              {isRtl ? 'تحميل PDF' : 'Download PDF'}
            </a>
          </div>

          <div className="flex-1 w-full bg-neutral-900 border border-[#262626] rounded-2xl overflow-hidden shadow-2xl relative">
              <iframe 
                src="/magazine/issue-zero.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH" 
                className="absolute inset-0 w-full h-full border-0" 
                title="Midaan Magazine Issue Zero"
              />
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
}
