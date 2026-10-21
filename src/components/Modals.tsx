'use client';

import React from 'react';
import { Copy, Check, ShieldCheck, Ruler } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { GOVERNORATES, TSHIRT_SIZE_CHART, HOODIE_SIZE_CHART, basePrices } from '@/constants';

export default function Modals() {
  const { 
    lang, isCheckoutOpen, setIsCheckoutOpen, isSizeChartOpen, setIsSizeChartOpen,
    isWorkshopModalOpen, setIsWorkshopModalOpen, selectedWorkshop, activeChartTab,
    setActiveChartTab, garment, size, placement, selectedGov, setSelectedGov,
    copiedCliq, setCopiedCliq
  } = useStore();
  
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  const currentPrice = basePrices[garment as keyof typeof basePrices];
  const finalTotal = currentPrice + selectedGov.fee;

  const getWhatsAppOrderUrl = () => {
    const sizeStr = garment === 'tote' ? 'One Size' : size;
    const msg = `مرحباً استوديو ميدان، أود تأكيد طلبي: قطعة ${garment} - مقاس ${sizeStr} - مكان التصميم: ${placement}. المجموع: ${finalTotal.toFixed(2)} د.أ`;
    return `https://wa.me/962790000000?text=${encodeURIComponent(msg)}`;
  };
  
  const getWhatsAppWorkshopUrl = () => {
    const msg = `مرحباً استوديو ميدان، أود التسجيل أو الاستفسار بخصوص: ${selectedWorkshop}`;
    return `https://wa.me/962790000000?text=${encodeURIComponent(msg)}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('MIDAANME');
    setCopiedCliq(true);
    setTimeout(() => setCopiedCliq(false), 2000);
  };

  return (
    <>
      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-[#111] border border-[#262626] rounded max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className={`absolute top-4 text-neutral-400 hover:text-white text-sm font-bold uppercase tracking-widest font-mono ${isRtl ? 'left-4' : 'right-4'}`}
            >
              {strings.close}
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#262626]">
              <div className="bg-[#D80032]/20 p-3 rounded">
                <ShieldCheck size={24} className="text-[#D80032]" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white uppercase tracking-tight">{strings.orderModalTitle}</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">{strings.fullName}</label>
                <input type="text" className="w-full bg-[#0A0A0A] border border-[#262626] rounded p-3 text-white font-sans outline-none focus:border-[#D80032] transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">{strings.phone}</label>
                <input type="tel" dir="ltr" placeholder="079 000 0000" className="w-full bg-[#0A0A0A] border border-[#262626] rounded p-3 text-white font-mono outline-none focus:border-[#D80032] transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">{strings.governorate}</label>
                <select 
                  value={selectedGov.id}
                  onChange={(e) => {
                    const gov = GOVERNORATES.find(g => g.id === e.target.value);
                    if(gov) setSelectedGov(gov);
                  }}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded p-3 text-white font-sans outline-none focus:border-[#D80032] transition-colors"
                >
                  {GOVERNORATES.map(g => (
                    <option key={g.id} value={g.id}>{isRtl ? g.nameAr : g.nameEn} ({g.fee} JOD)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">{strings.address}</label>
                <textarea rows={2} className="w-full bg-[#0A0A0A] border border-[#262626] rounded p-3 text-white font-sans outline-none focus:border-[#D80032] transition-colors"></textarea>
              </div>

              {/* CliQ Payment Box */}
              <div className="bg-[#1A1A1A] border border-[#D80032]/30 rounded p-4 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-white/5 opacity-50 select-none pointer-events-none">
                  <h1 className="text-8xl font-black italic">CliQ</h1>
                </div>
                
                <h4 className="text-[#D80032] font-black uppercase tracking-widest text-sm mb-2 relative z-10 font-sans">{strings.cliqModal.title}</h4>
                <p className="text-xs text-neutral-400 mb-4 font-sans relative z-10">{strings.cliqModal.desc}</p>
                
                <div className="flex flex-col gap-3 relative z-10">
                  <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">{strings.cliqModal.aliasLabel}</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-black border border-[#333] px-4 py-3 rounded flex-1 font-mono text-xl tracking-[0.2em] font-black text-white text-center">
                      MIDAANME
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="bg-white hover:bg-neutral-200 text-black p-3.5 rounded transition-colors flex shrink-0"
                    >
                      {copiedCliq ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#262626] pt-6 flex justify-between items-end">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">{strings.grandTotal}</span>
                <span className="text-3xl font-black text-white font-mono">{finalTotal.toFixed(2)} <span className="text-sm text-[#D80032]">{strings.studio.jod}</span></span>
              </div>

              <a 
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#D80032] hover:bg-[#B00028] text-white py-4 font-mono text-sm font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-colors block text-center"
              >
                {strings.confirmOrder}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Workshop Modal */}
      {isWorkshopModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-[#111] border border-[#262626] rounded max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsWorkshopModalOpen(false)}
              className={`absolute top-4 text-neutral-400 hover:text-white text-sm font-bold uppercase tracking-widest font-mono ${isRtl ? 'left-4' : 'right-4'}`}
            >
              {strings.close}
            </button>
            <h3 className="font-black text-xl text-white uppercase tracking-tight mb-2 font-sans pr-8">{strings.workshopModalTitle}</h3>
            <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded mb-6">
              <span className="text-sm text-white font-bold block font-sans">{selectedWorkshop}</span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">{strings.fullName}</label>
                <input type="text" className="w-full bg-[#0A0A0A] border border-[#262626] rounded p-3 text-white font-sans outline-none focus:border-[#D80032] transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">{strings.phone}</label>
                <input type="tel" dir="ltr" className="w-full bg-[#0A0A0A] border border-[#262626] rounded p-3 text-white font-mono outline-none focus:border-[#D80032] transition-colors" />
              </div>
            </div>

            <a 
              href={getWhatsAppWorkshopUrl()}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-white hover:bg-neutral-200 text-black py-4 font-mono text-xs font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-colors block text-center"
            >
              {strings.submitWorkshopWhatsApp}
            </a>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-[#111] border border-[#262626] rounded max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsSizeChartOpen(false)}
              className={`absolute top-4 text-neutral-400 hover:text-white text-sm font-bold uppercase tracking-widest font-mono ${isRtl ? 'left-4' : 'right-4'}`}
            >
              {strings.close}
            </button>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#262626]">
              <Ruler size={24} className="text-[#D80032]" />
              <h3 className="font-black text-xl text-white uppercase tracking-tight">{strings.studio.sizeLabel}</h3>
            </div>

            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setActiveChartTab('tshirt')}
                className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest border-b-2 ${activeChartTab === 'tshirt' ? 'border-[#D80032] text-white' : 'border-[#262626] text-neutral-500'}`}
              >
                {strings.studio.tee}
              </button>
              <button 
                onClick={() => setActiveChartTab('hoodie')}
                className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest border-b-2 ${activeChartTab === 'hoodie' ? 'border-[#D80032] text-white' : 'border-[#262626] text-neutral-500'}`}
              >
                {strings.studio.hoodie}
              </button>
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-center font-mono text-sm border-collapse border border-[#262626]">
                <thead>
                  <tr className="bg-[#1A1A1A] border-b border-[#262626]">
                    <th className="p-3 border-x border-[#262626] text-white">Size</th>
                    <th className="p-3 border-x border-[#262626] text-neutral-400">A (Length cm)</th>
                    <th className="p-3 border-x border-[#262626] text-neutral-400">B (Width cm)</th>
                  </tr>
                </thead>
                <tbody className="bg-[#0A0A0A]">
                  {(activeChartTab === 'tshirt' ? TSHIRT_SIZE_CHART : HOODIE_SIZE_CHART).map((row) => (
                    <tr key={row.size} className="border-b border-[#262626] hover:bg-[#111]">
                      <td className="p-3 font-bold border-x border-[#262626] text-white">{row.size}</td>
                      <td className="p-3 border-x border-[#262626] text-neutral-400">{row.a}</td>
                      <td className="p-3 border-x border-[#262626] text-neutral-400">{row.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#1A1A1A] p-4 rounded text-xs leading-relaxed font-sans border border-[#262626]">
              <strong className="text-white block mb-1 font-mono uppercase tracking-widest">{strings.fabricSpecsTitle}</strong>
              <p className="text-neutral-400 mb-1">- {strings.tshirtSpecs}</p>
              <p className="text-neutral-400 mb-1">- {strings.hoodieSpecs}</p>
              <p className="text-neutral-400 mt-2 italic border-t border-[#333] pt-2">- {strings.careInstructions}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
