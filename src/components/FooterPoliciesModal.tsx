'use client';

import React, { useState, useEffect } from 'react';
import { X, Truck, RotateCcw, Shield, MessageCircle, ExternalLink } from 'lucide-react';

export type PolicyTab = 'shipping' | 'returns' | 'privacy' | 'contact';

interface FooterPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: PolicyTab;
  onTabChange: (tab: PolicyTab) => void;
  lang: 'ar' | 'en';
}

export default function FooterPoliciesModal({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  lang,
}: FooterPoliciesModalProps) {
  const isAr = lang === 'ar';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs: Array<{ id: PolicyTab; labelAr: string; labelEn: string; icon: React.ReactNode }> = [
    {
      id: 'shipping',
      labelAr: 'الشحن والتأكيد اليدوي',
      labelEn: 'Shipping & Confirmation',
      icon: <Truck size={16} />,
    },
    {
      id: 'returns',
      labelAr: 'خدمة العملاء والاستفسارات',
      labelEn: 'Customer Support & Inquiries',
      icon: <RotateCcw size={16} />,
    },
    {
      id: 'privacy',
      labelAr: 'الخصوصية والبيانات',
      labelEn: 'Privacy Policy',
      icon: <Shield size={16} />,
    },
    {
      id: 'contact',
      labelAr: 'التواصل المباشر',
      labelEn: 'Direct Contact',
      icon: <MessageCircle size={16} />,
    },
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0c0c0c] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        dir={isAr ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1F1F1F] flex items-center justify-between">
          <h2 id="policy-modal-title" className="text-lg font-black text-white font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D80032]" />
            <span>{isAr ? 'سياسات ومعايير ميدان' : 'Midaan Policies & Standards'}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1F1F1F] bg-[#070707] px-4 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-[#D80032] text-white bg-[#141414]/50'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span className={isActive ? 'text-[#D80032]' : 'text-neutral-500'}>{tab.icon}</span>
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans text-neutral-300 leading-relaxed">
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'آلية الشحن والتأكيد اليدوي' : 'Shipping & Manual Confirmation Flow'}
              </h3>
              <p>
                {isAr
                  ? 'تعتمد مبادرة ميدان نموذج التأكيد اليدوي المباشر عبر واتساب لكافة الطلبات قبل تحصيل أي مبالغ، حرصاً على مطابقة المقاسات المطلوبة والتأكد من تفاصيل الوجهة.'
                  : 'Midaan operates on a manual WhatsApp confirmation model for all orders prior to payment collection, ensuring size availability and accurate delivery coordination.'}
              </p>
              
              <div className="bg-[#141414] p-4 rounded-2xl border border-[#222] space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{isAr ? 'التوصيل المحلي (الأردن):' : 'Domestic Delivery (Jordan):'}</span>
                </div>
                <p className="text-neutral-400">
                  {isAr
                    ? 'يغطي التوصيل العاصمة عمّان وجميع محافظات المملكة الاثنتي عشرة. تكلفة التوصيل التقديرية تُؤكد مسبقاً قبل الإرسال.'
                    : 'Covers Amman and all 12 Jordanian governorates. Estimated delivery fees are confirmed in advance prior to dispatch.'}
                </p>
              </div>

              <div className="bg-[#141414] p-4 rounded-2xl border border-[#222] space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{isAr ? 'الشحن الدولي والجمارك:' : 'International Shipping & Customs:'}</span>
                </div>
                <p className="text-neutral-400">
                  {isAr
                    ? 'يتم الشحن الدولي عبر خدمات البريد السريع الدولية. نؤكد أن الرسوم الجمركية والضرائب المحلية في بلد الوصول غير مشمولة وتُحدد وتُدفع عند الاستلام وفق قوانين بلد الوجهة.'
                    : 'International shipments are dispatched via international express couriers. Destination customs duties and local taxes are strictly excluded and payable upon receipt according to destination regulations.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'خدمة العملاء والاستفسارات المباشرة' : 'Customer Support & Inquiries'}
              </h3>
              <p>
                {isAr
                  ? 'تُطرح قطع ميدان كإصدارات محدودة موثقة. يحرص فريقنا على تقديم تجربة تسوق موثوقة والتواصل الشفاف مع كل عميل قبل تأكيد الطلب وبعد الاستلام.'
                  : 'Midaan pieces are released as limited, documented editions. Our team is committed to transparent, direct communication with each customer prior to confirmation and following delivery.'}
              </p>
              <div className="bg-[#141414] p-4 rounded-2xl border border-[#222] space-y-2.5">
                <div className="font-bold text-white">
                  {isAr ? 'الاستفسارات والمتابعة:' : 'Inquiries & Follow-up:'}
                </div>
                <p className="text-neutral-400">
                  {isAr
                    ? 'لأي استفسار يخص المقاسات، تفاصيل القطع، أو متابعة الشحنة بعد الاستلام، يُرجى التواصل مباشرة عبر واتساب مع رقم فريق ميدان الرسمي (+962 7 7012 5316) مع إرفاق تفاصيل الطلب.'
                    : 'For questions regarding sizing, garment details, or shipment follow-up upon receipt, please reach out directly via WhatsApp to the official Midaan team (+962 7 7012 5316) with your order details.'}
                </p>
                <p className="text-neutral-500 text-[11px] pt-1 border-t border-[#222]">
                  {isAr
                    ? 'ملاحظة: سياسة الاستبدال والاسترجاع الرسمية قيد الاعتماد النهائي من إدارة المشروع؛ ولحين اعتمادها يتم التنسيق المباشر لكل حالة عبر واتساب.'
                    : 'Note: The formal returns and exchange policy is under final review by project management. In the interim, all requests are coordinated individually via WhatsApp.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'احترام الخصوصية وحماية البيانات' : 'Privacy Protection & Data Handling'}
              </h3>
              <p>
                {isAr
                  ? 'ميدان مساحة ثقافية ومجتمعية مستقلة ترفض الممارسات الاستغلالية للبيانات. موقعنا لا يتضمن أي برمجيات تتبع إعلانية خارجية أو بكسلات لشبكات الإعلانات.'
                  : 'Midaan is an independent cultural initiative that rejects predatory data practices. Our website includes zero advertising trackers or third-party marketing pixels.'}
              </p>
              <div className="bg-[#141414] p-4 rounded-2xl border border-[#222] space-y-2">
                <div className="font-bold text-white">
                  {isAr ? 'التخزين المحلي (LocalStorage):' : 'Local Storage Usage:'}
                </div>
                <p className="text-neutral-400">
                  {isAr
                    ? 'يقتصر التخزين داخل متصفحك على حفظ محتويات حقيبة التسوق الخاصة بك واختيار اللغة المفضلة فقط لتسهيل تجربتك. لا يتم نقل هذه البيانات أو بيعها لأي جهة.'
                    : 'Browser local storage is utilized strictly to persist your shopping bag contents and language preference across sessions. No customer data is sold or shared.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'التواصل المباشر مع فريق ميدان' : 'Direct Contact with Midaan Team'}
              </h3>
              <p>
                {isAr
                  ? 'نرحب باستفساراتكم وملاحظاتكم المتعلقة بالإصدارات، جدول المقاسات، الشحن، أو المقالات التحريرية عبر القنوات المباشرة:'
                  : 'We welcome your inquiries and feedback regarding drops, size specifications, shipping, or editorial essays via our direct channels:'}
              </p>
              <div className="bg-[#141414] p-4 rounded-2xl border border-[#222] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-white text-sm">
                    {isAr ? 'واتساب الإدارة والطلبات' : 'Operations & Orders WhatsApp'}
                  </div>
                  <div className="text-neutral-400 font-mono mt-0.5" dir="ltr">
                    +962 7 7012 5316
                  </div>
                </div>
                <a
                  href="https://wa.me/962770125316"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-neutral-200 text-black px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg"
                >
                  <span>{isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1F1F1F] bg-[#070707] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#1A1A1A] hover:bg-[#262626] text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
