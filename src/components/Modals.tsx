'use client';

import React from 'react';
import { Copy, Check, ShieldCheck, Ruler, X, Trash2 } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { GOVERNORATES, TSHIRT_SIZE_CHART, HOODIE_SIZE_CHART, basePrices, CLIQ_ALIAS } from '@/constants';

export default function Modals() {
  const { 
    lang, isSizeChartOpen, setIsSizeChartOpen,
    isWorkshopModalOpen, setIsWorkshopModalOpen, selectedWorkshop, activeChartTab,
    setActiveChartTab, selectedGov, setSelectedGov, copiedCliq, setCopiedCliq,
    cart, removeFromCart, isCartOpen, setIsCartOpen, paymentMethod, setPaymentMethod
  } = useStore();
  
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(CLIQ_ALIAS);
    setCopiedCliq(true);
    setTimeout(() => setCopiedCliq(false), 2000);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = cartSubtotal > 0 ? cartSubtotal + selectedGov.fee : 0;

  const getWhatsAppOrderUrl = () => {
    const orderDetails = cart.map((item, index) => {
      const sizeStr = item.garment === 'tote' ? 'One Size' : item.size;
      return `${index + 1}. ${item.garment} (${item.color}) - Size: ${sizeStr} - Print: ${item.placement} - Art: ${item.artMode}`;
    }).join('\n');

    const msg = `مرحباً استوديو ميدان، أود تأكيد طلبي:\n\n${orderDetails}\n\nالمحافظة: ${selectedGov.nameAr}\nطريقة الدفع: ${paymentMethod === 'cliq' ? 'CliQ' : 'عند الاستلام'}\nالمجموع الكلي: ${finalTotal.toFixed(2)} د.أ`;
    return `https://wa.me/962790000000?text=${encodeURIComponent(msg)}`;
  };
  
  const getWhatsAppWorkshopUrl = () => {
    const msg = `مرحباً استوديو ميدان، أود التسجيل أو الاستفسار بخصوص: ${selectedWorkshop}`;
    return `https://wa.me/962790000000?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div 
            className={`relative w-full max-w-md bg-[#050505] h-full shadow-2xl flex flex-col border-l border-[#262626] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isRtl ? 'border-l-0 border-r left-0 right-auto' : 'right-0'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="p-6 flex items-center justify-between border-b border-[#1A1A1A]">
              <h2 className="text-xl font-black text-white uppercase font-sans tracking-tight">
                {}
                {strings.nav.cart} <span className="text-[#D80032] font-mono text-sm ml-2">({cart.length})</span>
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-neutral-500 py-12 font-mono text-xs uppercase tracking-widest">
                  {isRtl ? 'الحقيبة فارغة' : 'Your cart is empty'}
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#111] border border-[#262626] p-4 rounded-xl flex gap-4 items-start">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white uppercase text-sm">{strings.studio[item.garment as keyof typeof strings.studio]}</h4>
                          <span className="font-mono text-xs text-[#D80032] font-bold">{item.price.toFixed(2)} {strings.studio.jod}</span>
                        </div>
                        <p className="text-xs text-neutral-400 font-mono">
                          {item.color} • {item.garment === 'tote' ? 'O/S' : item.size}
                        </p>
                        <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-2">
                          {item.placement} / {item.artMode}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-600 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#1A1A1A] p-6 bg-gradient-to-t from-black to-[#050505]">
                <div className="space-y-4 mb-6">
                  {/* Governorate */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">{strings.governorate}</label>
                    <select 
                      value={selectedGov.id}
                      onChange={(e) => {
                        const gov = GOVERNORATES.find(g => g.id === e.target.value);
                        if(gov) setSelectedGov(gov);
                      }}
                      className="w-full bg-[#111] border border-[#262626] rounded-lg p-3 text-white text-sm font-sans outline-none focus:border-[#D80032] transition-colors"
                    >
                      {GOVERNORATES.map(g => (
                        <option key={g.id} value={g.id}>{isRtl ? g.nameAr : g.nameEn} (+{g.fee} JOD)</option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Payment Method</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPaymentMethod('cliq')}
                        className={`flex-1 py-2.5 border rounded-lg text-xs font-bold transition-colors ${paymentMethod === 'cliq' ? 'border-[#D80032] bg-[#D80032]/10 text-white' : 'border-[#262626] bg-[#111] text-neutral-400'}`}
                      >
                        CliQ Instant
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('cod')}
                        className={`flex-1 py-2.5 border rounded-lg text-xs font-bold transition-colors ${paymentMethod === 'cod' ? 'border-white bg-[#1A1A1A] text-white' : 'border-[#262626] bg-[#111] text-neutral-400'}`}
                      >
                        Cash on Delivery
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'cliq' && (
                    <div className="bg-[#111] border border-[#D80032]/30 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest mb-1">{strings.cliqModal.aliasLabel}</div>
                        <div className="font-mono text-sm font-black tracking-widest text-white">{CLIQ_ALIAS}</div>
                      </div>
                      <button onClick={copyToClipboard} className="text-neutral-400 hover:text-white p-2">
                        {copiedCliq ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#1A1A1A] space-y-2">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Subtotal</span>
                      <span className="font-mono">{cartSubtotal.toFixed(2)} JOD</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Shipping</span>
                      <span className="font-mono">{selectedGov.fee.toFixed(2)} JOD</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-sm font-bold text-white uppercase tracking-wide">Total</span>
                      <span className="text-2xl font-black text-white font-mono">{finalTotal.toFixed(2)} <span className="text-xs text-[#D80032]">JOD</span></span>
                    </div>
                  </div>
                </div>

                <a 
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white text-black hover:bg-neutral-200 py-4 font-mono text-sm font-black uppercase tracking-widest transition-colors rounded-xl flex items-center justify-center gap-2"
                >
                  {strings.confirmOrder}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workshop Modal */}
      {isWorkshopModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-[#050505] border border-[#262626] rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsWorkshopModalOpen(false)}
              className={`absolute top-6 text-neutral-500 hover:text-white transition-colors ${isRtl ? 'left-6' : 'right-6'}`}
            >
              <X size={20} />
            </button>
            <h3 className="font-black text-2xl text-white uppercase tracking-tight mb-2 font-sans pr-8">{strings.workshopModalTitle}</h3>
            <div className="bg-[#111] border border-[#262626] p-4 rounded-xl mb-8">
              <span className="text-sm text-[#D80032] font-bold block font-sans">{selectedWorkshop}</span>
            </div>
            
            <a 
              href={getWhatsAppWorkshopUrl()}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-white hover:bg-neutral-200 text-black py-4 font-mono text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-colors block text-center"
            >
              {strings.submitWorkshopWhatsApp}
            </a>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-[#050505] border border-[#262626] rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsSizeChartOpen(false)}
              className={`absolute top-6 text-neutral-500 hover:text-white transition-colors ${isRtl ? 'left-6' : 'right-6'}`}
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#1A1A1A]">
              <Ruler size={24} className="text-[#D80032]" />
              <h3 className="font-black text-xl text-white uppercase tracking-tight">{strings.studio.sizeLabel}</h3>
            </div>

            <div className="flex gap-4 mb-8 bg-[#111] p-1 rounded-xl">
              <button 
                onClick={() => setActiveChartTab('tshirt')}
                className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeChartTab === 'tshirt' ? 'bg-[#262626] text-white shadow' : 'text-neutral-500 hover:text-white'}`}
              >
                {strings.studio.tee}
              </button>
              <button 
                onClick={() => setActiveChartTab('hoodie')}
                className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeChartTab === 'hoodie' ? 'bg-[#262626] text-white shadow' : 'text-neutral-500 hover:text-white'}`}
              >
                {strings.studio.hoodie}
              </button>
            </div>

            <div className="overflow-x-auto mb-8 border border-[#262626] rounded-xl">
              <table className="w-full text-center font-mono text-sm border-collapse">
                <thead>
                  <tr className="bg-[#111] border-b border-[#262626]">
                    <th className="p-4 text-white font-bold text-xs tracking-widest">Size</th>
                    <th className="p-4 text-neutral-400 font-normal text-xs tracking-widest border-l border-[#262626]">A (Length cm)</th>
                    <th className="p-4 text-neutral-400 font-normal text-xs tracking-widest border-l border-[#262626]">B (Width cm)</th>
                  </tr>
                </thead>
                <tbody className="bg-[#050505]">
                  {(activeChartTab === 'tshirt' ? TSHIRT_SIZE_CHART : HOODIE_SIZE_CHART).map((row) => (
                    <tr key={row.size} className="border-b border-[#1A1A1A] last:border-0 hover:bg-[#111] transition-colors">
                      <td className="p-4 font-black text-white">{row.size}</td>
                      <td className="p-4 text-neutral-400 border-l border-[#1A1A1A]">{row.a}</td>
                      <td className="p-4 text-neutral-400 border-l border-[#1A1A1A]">{row.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] p-6 rounded-xl text-xs leading-relaxed font-sans border border-[#262626]">
              <strong className="text-white block mb-3 font-mono uppercase tracking-widest text-[10px]">{strings.fabricSpecsTitle}</strong>
              <div className="space-y-2 text-neutral-400">
                <p>• {strings.tshirtSpecs}</p>
                <p>• {strings.hoodieSpecs}</p>
              </div>
              <p className="text-neutral-500 mt-4 italic border-t border-[#1A1A1A] pt-4 font-medium">{strings.careInstructions}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
