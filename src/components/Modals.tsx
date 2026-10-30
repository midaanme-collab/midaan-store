'use client';

import React from 'react';
import { Copy, Check, ShieldCheck, Ruler, X, Trash2 } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { GOVERNORATES, TSHIRT_SIZE_CHART, HOODIE_SIZE_CHART, basePrices, CLIQ_ALIAS } from '@/constants';
import { formatProductPrice } from '@/constants/products';

export default function Modals() {
  const { 
    lang, currency, isSizeChartOpen, setIsSizeChartOpen,
    isWorkshopModalOpen, setIsWorkshopModalOpen, selectedWorkshop, activeChartTab,
    setActiveChartTab, selectedGov, setSelectedGov, copiedCliq, setCopiedCliq,
    cart, removeFromCart, updateCartQuantity, isCartOpen, setIsCartOpen, paymentMethod, setPaymentMethod
  } = useStore();
  
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(CLIQ_ALIAS);
    setCopiedCliq(true);
    setTimeout(() => setCopiedCliq(false), 2000);
  };

  const hasConfiguredFee = selectedGov.fee !== null && selectedGov.fee !== undefined;
  const shippingAmount = hasConfiguredFee ? (currency === 'USD' ? (selectedGov.fee * 1.41) : selectedGov.fee) : 0;
  const cartSubtotal = cart.reduce((sum, item) => sum + ((currency === 'USD' ? (item.priceUSD || 50) : item.price) * (item.quantity || 1)), 0);
  const finalTotal = cartSubtotal > 0 ? cartSubtotal + shippingAmount : 0;

  const getFormattedItemPrice = (itemPrice: number, qty: number) => {
    if (currency === 'USD') {
      return `${(50 * qty).toFixed(2)} USD`;
    }
    if (isRtl) {
      if (qty === 1) return '٣٥ د.أ';
      return `${(35 * qty).toFixed(2)} د.أ`;
    }
    return `${(35 * qty).toFixed(2)} JOD`;
  };

  const getWhatsAppOrderUrl = () => {
    const isUsd = currency === 'USD';
    const currencySuffix = isUsd ? 'USD' : (isRtl ? 'د.أ' : 'JOD');

    const orderDetails = cart.map((item, index) => {
      const sizeStr = item.garment === 'tote' ? 'One Size' : item.size;
      const unitP = isUsd ? (item.priceUSD || 50) : item.price;
      if (item.isPrePrinted) {
        return `${index + 1}. ${item.productTitle || item.garment} - مقاس: ${sizeStr} - كمية: ${item.quantity || 1} (${unitP.toFixed(2)} ${currencySuffix})`;
      }
      return `${index + 1}. ${item.garment} (${item.color}) - Size: ${sizeStr} - Qty: ${item.quantity || 1} (${unitP.toFixed(2)} ${currencySuffix})`;
    }).join('\n');

    const shippingInfo = hasConfiguredFee
      ? `${(isUsd ? (selectedGov.fee * 1.41) : selectedGov.fee).toFixed(2)} ${currencySuffix}`
      : (isRtl ? 'تُحدد وتؤكد يدوياً مع الفريق' : 'Unconfigured — confirmed manually with team');

    const totalLabel = hasConfiguredFee
      ? (isRtl ? 'المجموع الإجمالي:' : 'Total:')
      : (isRtl ? 'المجموع (باستثناء الشحن):' : 'Total (Excluding shipping):');

    const msg = isRtl
      ? `مرحباً فريق ميدان،\n\nأود إرسال طلب الشراء المبدئي التالي (يرجى مراجعة وتأكيد توفر المخزون والسعر النهائي):\n\n${orderDetails}\n\nالمحافظة: ${selectedGov.nameAr} (رسوم التوصيل: ${shippingInfo})\nطريقة الدفع: ${paymentMethod === 'cliq' ? 'CliQ' : 'عند الاستلام'}\n${totalLabel} ${finalTotal.toFixed(2)} ${currencySuffix}\n\n*ملاحظة: هذا طلب مبدئي يتطلب تأكيداً يدوياً من فريق ميدان بعد التحقق من المقاسات وتوفر القطع في المستودع.*`
      : `Hello Midaan team,\n\nI would like to submit the following order request (subject to manual confirmation of stock and final total):\n\n${orderDetails}\n\nGovernorate: ${selectedGov.nameEn} (Shipping: ${shippingInfo})\nPayment Method: ${paymentMethod === 'cliq' ? 'CliQ' : 'Cash on Delivery'}\n${totalLabel} ${finalTotal.toFixed(2)} ${currencySuffix}\n\n*Note: This is an order request requiring manual confirmation from the Midaan team after verifying inventory availability.*`;

    return `https://wa.me/962770125316?text=${encodeURIComponent(msg)}`;
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
          />
          
          {/* Drawer */}
          <div 
            className={`relative w-full max-w-md bg-[#050505] h-full shadow-2xl flex flex-col border-l border-[#262626] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isRtl ? 'border-l-0 border-r left-0 right-auto' : 'right-0'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="p-6 flex items-center justify-between border-b border-[#1A1A1A]">
              <h2 className="text-xl font-black text-white font-sans flex items-center gap-2">
                <span>{strings.nav.cart}</span>
                <span className="text-[#D80032] text-sm" dir="ltr">({cart.length})</span>
              </h2>
              <button 
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-neutral-400 py-16 font-sans text-sm">
                  {isRtl ? 'الحقيبة فارغة حالياً' : 'Your bag is currently empty'}
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#111] border border-[#262626] p-4 rounded-2xl flex gap-4 items-start shadow-md">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-white text-sm font-sans leading-snug">
                            {item.productTitle || item.garment}
                          </h4>
                          <span className="text-xs text-[#D80032] font-bold whitespace-nowrap" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                            {getFormattedItemPrice(item.price, item.quantity || 1)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans flex items-center gap-2">
                          <span>{item.color}</span>
                          <span>•</span>
                          <span className="font-bold text-neutral-200" dir="ltr">{item.size}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-3 bg-black/50 rounded-lg p-1 w-fit border border-[#262626]">
                          <button 
                            type="button"
                            onClick={() => updateCartQuantity(item.id, -1)} 
                            className="px-2 py-0.5 hover:bg-[#262626] rounded text-neutral-300 font-bold"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold px-2 text-white" dir="ltr">{item.quantity || 1}</span>
                          <button 
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 1)} 
                            className="px-2 py-0.5 hover:bg-[#262626] rounded text-neutral-300 font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-500 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
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
                    <label className="text-xs font-semibold text-neutral-300 font-sans">{strings.governorate}</label>
                    <select 
                      value={selectedGov.id}
                      onChange={(e) => {
                        const gov = GOVERNORATES.find(g => g.id === e.target.value);
                        if(gov) setSelectedGov(gov);
                      }}
                      className="w-full bg-[#111] border border-[#262626] rounded-xl p-3 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors"
                    >
                      {GOVERNORATES.map(g => (
                        <option key={g.id} value={g.id}>
                          {isRtl ? g.nameAr : g.nameEn} {g.fee !== null ? `(+${g.fee} ${isRtl ? 'د.أ' : 'JOD'})` : (isRtl ? '(تأكيد يدوي)' : '(Manual confirmation)')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 font-sans">{strings.paymentMethod}</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('cliq')}
                        className={`flex-1 py-2.5 border rounded-xl text-xs font-bold transition-colors font-sans ${paymentMethod === 'cliq' ? 'border-[#D80032] bg-[#D80032]/10 text-white' : 'border-[#262626] bg-[#111] text-neutral-400'}`}
                      >
                        CliQ Instant
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`flex-1 py-2.5 border rounded-xl text-xs font-bold transition-colors font-sans ${paymentMethod === 'cod' ? 'border-white bg-[#1A1A1A] text-white' : 'border-[#262626] bg-[#111] text-neutral-400'}`}
                      >
                        Cash on Delivery
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'cliq' && (
                    <div className="bg-[#111] border border-[#D80032]/30 rounded-xl p-3 flex justify-between items-center">
                      <div>
                        <div className="text-[11px] text-neutral-400 font-sans mb-1">{isRtl ? 'الاسم المستعار (CliQ Alias):' : 'CliQ Alias:'}</div>
                        <div className="font-mono text-sm font-black tracking-normal text-white">{CLIQ_ALIAS}</div>
                      </div>
                      <button onClick={copyToClipboard} className="text-neutral-400 hover:text-white p-2">
                        {copiedCliq ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#1A1A1A] space-y-2 font-sans text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>{strings.subtotal}</span>
                      <span className="font-bold text-neutral-200" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                        {cartSubtotal.toFixed(2)} {currency === 'USD' ? 'USD' : (isRtl ? 'د.أ' : 'JOD')}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>{strings.shipping}</span>
                      <span className="font-bold text-neutral-200" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                        {hasConfiguredFee
                          ? `${(currency === 'USD' ? (selectedGov.fee! * 1.41) : selectedGov.fee!).toFixed(2)} ${currency === 'USD' ? 'USD' : (isRtl ? 'د.أ' : 'JOD')}`
                          : (isRtl ? 'تأكيد يدوي مع الفريق' : 'Manual team confirmation')}
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-2 border-t border-[#1A1A1A]">
                      <span className="text-sm font-bold text-white font-sans">
                        {hasConfiguredFee ? strings.total : (isRtl ? 'المجموع (بدون الشحن):' : 'Total (Excl. shipping):')}
                      </span>
                      <span className="text-2xl font-black text-white font-sans" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                        {finalTotal.toFixed(2)} <span className="text-xs text-[#D80032]">{currency === 'USD' ? 'USD' : (isRtl ? 'د.أ' : 'JOD')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <a 
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white text-black hover:bg-neutral-200 py-4 font-sans text-sm font-bold transition-colors rounded-xl flex items-center justify-center gap-2 shadow-xl active:scale-95"
                >
                  <span>{strings.sendOrderWhatsApp}</span>
                </a>
                <p className="text-[11px] text-neutral-400 font-sans mt-3 text-center leading-relaxed">
                  {strings.orderRequestNotice}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-[#050505] border border-[#262626] rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              type="button"
              onClick={() => setIsSizeChartOpen(false)}
              className={`absolute top-6 text-neutral-500 hover:text-white transition-colors ${isRtl ? 'left-6' : 'right-6'}`}
              aria-label="Close size guide"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#1A1A1A]">
              <Ruler size={24} className="text-[#D80032]" />
              <h3 className="font-black text-xl text-white font-sans">{isRtl ? 'دليل المقاسات' : 'Size Guide'}</h3>
            </div>

            <div className="overflow-x-auto mb-8 border border-[#262626] rounded-xl" dir="ltr">
              <table className="w-full text-center font-sans text-sm border-collapse">
                <thead>
                  <tr className="bg-[#111] border-b border-[#262626]">
                    <th className="p-4 text-white font-bold text-xs">Size</th>
                    <th className="p-4 text-neutral-300 font-normal text-xs border-l border-[#262626]">A (Length cm)</th>
                    <th className="p-4 text-neutral-300 font-normal text-xs border-l border-[#262626]">B (Width cm)</th>
                  </tr>
                </thead>
                <tbody className="bg-[#050505]">
                  {TSHIRT_SIZE_CHART.filter(r => ['S', 'M', 'L', 'XL', '2XL'].includes(r.size)).map((row) => (
                    <tr key={row.size} className="border-b border-[#1A1A1A] last:border-0 hover:bg-[#111] transition-colors">
                      <td className="p-4 font-black text-white">{row.size}</td>
                      <td className="p-4 text-neutral-300 border-l border-[#1A1A1A]">{row.a}</td>
                      <td className="p-4 text-neutral-300 border-l border-[#1A1A1A]">{row.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#111] p-6 rounded-xl text-xs leading-relaxed font-sans border border-[#262626]">
              <strong className="text-white block mb-2 font-sans text-sm font-bold">
                {isRtl ? 'مواصفات القطعة والعناية:' : 'Garment Specs & Care:'}
              </strong>
              <div className="space-y-1.5 text-neutral-300">
                <p>• {isRtl ? 'قطن خيزران 100% (100% Bamboo Cotton)، قصة مريحة للجنسين.' : '100% Bamboo Cotton, relaxed unisex fit.'}</p>
                <p>• {isRtl ? 'طباعة مباشرة على القماش (DTG) بجودة عالية.' : 'High-definition Direct-to-Garment (DTG) print.'}</p>
                <p>• {isRtl ? 'يُغسل مقلوباً بالماء البارد. تجنب كي منطقة الطباعة مباشرة.' : 'Wash inside out with cold water. Avoid ironing directly on print.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
