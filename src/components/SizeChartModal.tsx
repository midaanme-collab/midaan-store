'use client';

import React, { useState, useEffect } from 'react';
import { X, Ruler, MessageSquare, Check, Sparkles } from 'lucide-react';

export interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'ar' | 'en';
  defaultSize?: string;
}

export interface SizeMeasurement {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  displaySize: string;
  chestCm: number;
  lengthCm: number;
  shoulderCm: number;
  heightRange: string;
  weightRange: string;
  heightRangeAr: string;
  weightRangeAr: string;
  fitNoteAr: string;
  fitNoteEn: string;
}

export const SIZE_MEASUREMENTS: SizeMeasurement[] = [
  {
    size: 'S',
    displaySize: 'S',
    chestCm: 52,
    lengthCm: 70,
    shoulderCm: 48,
    heightRange: '160–170 cm',
    weightRange: '55–68 kg',
    heightRangeAr: '١٦٠–١٧٠ سم',
    weightRangeAr: '٥٥–٦٨ كغ',
    fitNoteAr: 'قصة مريحة واسعة لمن يفضل المقاس الكلاسيكي أو البنية النحيفة/المتوسطة.',
    fitNoteEn: 'Relaxed boxy silhouette for lean/medium builds or closer classic drape.',
  },
  {
    size: 'M',
    displaySize: 'M',
    chestCm: 55,
    lengthCm: 72,
    shoulderCm: 50,
    heightRange: '168–176 cm',
    weightRange: '65–78 kg',
    heightRangeAr: '١٦٨–١٧٦ سم',
    weightRangeAr: '٦٥–٧٨ كغ',
    fitNoteAr: 'القصة الأكثر توازناً، مساحة مريحة على الصدر مع أكتاف منسدلة قليلاً.',
    fitNoteEn: 'Balanced boxy drape with slightly dropped shoulders and comfortable chest room.',
  },
  {
    size: 'L',
    displaySize: 'L',
    chestCm: 58,
    lengthCm: 75,
    shoulderCm: 53,
    heightRange: '174–182 cm',
    weightRange: '75–88 kg',
    heightRangeAr: '١٧٤–١٨٢ سم',
    weightRangeAr: '٧٥–٨٨ كغ',
    fitNoteAr: 'المقاس الأكثر طلباً؛ قصة ستريت وير عصرية مميزة ومريحة للحركة اليومية.',
    fitNoteEn: 'Our most popular streetwear fit; generous drape, perfect boxy shape.',
  },
  {
    size: 'XL',
    displaySize: 'XL',
    chestCm: 61,
    lengthCm: 77,
    shoulderCm: 56,
    heightRange: '180–188 cm',
    weightRange: '85–100 kg',
    heightRangeAr: '١٨٠–١٨٨ سم',
    weightRangeAr: '٨٥–١٠٠ كغ',
    fitNoteAr: 'قصة أوفر سايز واضحة لمن يفضل الستايل الواسع جداً أو البنية العريضة.',
    fitNoteEn: 'Prominent oversized drape for taller frames or broad builds.',
  },
  {
    size: 'XXL',
    displaySize: '2XL (XXL)',
    chestCm: 64,
    lengthCm: 79,
    shoulderCm: 58,
    heightRange: '185+ cm',
    weightRange: '98–115 kg',
    heightRangeAr: '١٨٥+ سم',
    weightRangeAr: '٩٨–١١٥ كغ',
    fitNoteAr: 'أقصى درجات الراحة والاتساع مع الحفاظ على هيكل الياقة والأكتاف.',
    fitNoteEn: 'Maximum room and comfort while retaining collar structure and clean hemline.',
  },
];

export default function SizeChartModal({
  isOpen,
  onClose,
  lang = 'ar',
  defaultSize = 'L',
}: SizeChartModalProps) {
  const isAr = lang === 'ar';
  const normalizedDefault = defaultSize?.toUpperCase().replace('2XL', 'XXL') || 'L';
  const initialSize = ['S', 'M', 'L', 'XL', 'XXL'].includes(normalizedDefault) ? normalizedDefault : 'L';
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentMeasurement =
    SIZE_MEASUREMENTS.find((m) => m.size === selectedSize) || SIZE_MEASUREMENTS[2];

  const whatsappInquiryUrl = `https://wa.me/962770125316?text=${encodeURIComponent(
    isAr
      ? `مرحباً فريق ميدان، أود الاستفسار عن قياسات وتفاصيل التيشيرت (المقاس المقترح: ${currentMeasurement.displaySize})، طولي ... ووزني ...`
      : `Hello Midaan team, I would like advice on sizing for the collaboration tee (interested in size: ${currentMeasurement.displaySize}), my height is ... and weight is ...`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
    >
      {/* Modal Box */}
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0A0A0A] border border-[#262626] rounded-3xl shadow-2xl flex flex-col p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1F1F1F] pb-5 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#D80032]/10 border border-[#D80032]/30 text-[#D80032]">
                <Ruler size={16} />
              </span>
              <h2 id="size-guide-title" className="text-xl sm:text-2xl font-black text-white font-sans">
                {isAr ? 'دليل المقاسات والقصة الصندوقية' : 'Size & Relaxed Boxy Fit Guide'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              {isAr
                ? 'قياسات دقيقة لقصة Relaxed Boxy Fit المعتمدة مع توصيات الطول والوزن المناسبين.'
                : 'Exact measurements for our approved Relaxed Boxy Fit with height & weight guidelines.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-900 transition-colors shrink-0"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quality Badges */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-6 text-[11px] font-sans">
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#2A2A2A] text-neutral-200 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#D80032]" />
            <span>{isAr ? 'قصة صندوقية واسعة (Relaxed Boxy Fit)' : 'Relaxed Boxy Fit'}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#2A2A2A] text-neutral-200">
            {isAr ? 'تفاوت القياس: ± 1.5 سم' : '± 1.5 cm tolerance'}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#2A2A2A] text-neutral-200">
            {isAr ? 'معالج مسبقاً ضد الانكماش (Preshrunk)' : 'Preshrunk Cotton'}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#2A2A2A] text-neutral-200">
            {isAr ? 'صناعة يدوية في إندونيسيا' : 'Handmade in Indonesia'}
          </span>
        </div>

        {/* Interactive Size Selector */}
        <div className="mb-6 space-y-2">
          <label className="text-xs font-bold text-neutral-300 font-sans block">
            {isAr ? 'اختر المقاس لعرض التوصيات المخصصة:' : 'Select size to view tailored recommendations:'}
          </label>
          <div className="grid grid-cols-5 gap-2" dir="ltr">
            {SIZE_MEASUREMENTS.map((m) => {
              const isSelected = selectedSize === m.size;
              return (
                <button
                  key={m.size}
                  type="button"
                  onClick={() => setSelectedSize(m.size)}
                  className={`py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-lg shadow-white/20 scale-[1.02]'
                      : 'bg-[#121212] border-[#262626] text-neutral-300 hover:text-white hover:border-neutral-500'
                  }`}
                  aria-label={`Size ${m.displaySize}`}
                >
                  <span>{m.displaySize}</span>
                  {isSelected && <Check size={12} className="text-black" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Selection Highlights Card */}
        <div className="bg-gradient-to-br from-[#161616] via-[#111111] to-[#0D0D0D] border border-[#2B2B2B] rounded-2xl p-4 sm:p-5 mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-400 font-sans">
                {isAr ? 'المقاس المختار:' : 'Selected Size:'}
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#D80032] text-white font-mono font-bold text-sm" dir="ltr">
                {currentMeasurement.displaySize}
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-sans italic">
              {isAr ? currentMeasurement.fitNoteAr : currentMeasurement.fitNoteEn}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {/* Chest Width */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-3">
              <span className="text-[10px] text-neutral-400 font-sans block mb-1">
                {isAr ? 'عرض الصدر' : 'Chest Width'}
              </span>
              <span className="text-lg font-black text-white font-mono" dir="ltr">
                {currentMeasurement.chestCm} cm
              </span>
            </div>

            {/* Length */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-3">
              <span className="text-[10px] text-neutral-400 font-sans block mb-1">
                {isAr ? 'الطول' : 'Length'}
              </span>
              <span className="text-lg font-black text-white font-mono" dir="ltr">
                {currentMeasurement.lengthCm} cm
              </span>
            </div>

            {/* Shoulder */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-3">
              <span className="text-[10px] text-neutral-400 font-sans block mb-1">
                {isAr ? 'عرض الكتف' : 'Shoulder'}
              </span>
              <span className="text-lg font-black text-white font-mono" dir="ltr">
                {currentMeasurement.shoulderCm} cm
              </span>
            </div>

            {/* Height Rec */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-3">
              <span className="text-[10px] text-amber-400 font-sans block mb-1">
                {isAr ? 'الطول الموصى به' : 'Height Range'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white font-sans" dir="ltr">
                {currentMeasurement.heightRange}
              </span>
            </div>

            {/* Weight Rec */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-3 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-emerald-400 font-sans block mb-1">
                {isAr ? 'الوزن الموصى به' : 'Weight Range'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white font-sans" dir="ltr">
                {currentMeasurement.weightRange}
              </span>
            </div>
          </div>
        </div>

        {/* Full Comparison Table */}
        <div className="mb-6 space-y-2">
          <span className="text-xs font-bold text-neutral-300 font-sans block">
            {isAr ? 'جدول القياسات الكامل (Relaxed Boxy Fit):' : 'Complete Measurement Table:'}
          </span>
          <div className="overflow-x-auto rounded-2xl border border-[#222]">
            <table className="w-full text-xs font-sans text-start border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-[#141414] text-neutral-400 border-b border-[#222]">
                  <th className="py-3 px-3 text-start font-semibold">{isAr ? 'المقاس' : 'Size'}</th>
                  <th className="py-3 px-3 text-center font-semibold">{isAr ? 'الصدر' : 'Chest'}</th>
                  <th className="py-3 px-3 text-center font-semibold">{isAr ? 'الطول' : 'Length'}</th>
                  <th className="py-3 px-3 text-center font-semibold">{isAr ? 'الكتف' : 'Shoulder'}</th>
                  <th className="py-3 px-3 text-center font-semibold">{isAr ? 'الطول المقترح' : 'Height'}</th>
                  <th className="py-3 px-3 text-center font-semibold">{isAr ? 'الوزن المقترح' : 'Weight'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {SIZE_MEASUREMENTS.map((m) => {
                  const isSelected = selectedSize === m.size;
                  return (
                    <tr
                      key={m.size}
                      onClick={() => setSelectedSize(m.size)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#D80032]/10 text-white font-semibold'
                          : 'hover:bg-neutral-900/60 text-neutral-300'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold" dir="ltr">
                        {m.displaySize}
                      </td>
                      <td className="py-3 px-3 text-center font-mono" dir="ltr">
                        {m.chestCm} cm
                      </td>
                      <td className="py-3 px-3 text-center font-mono" dir="ltr">
                        {m.lengthCm} cm
                      </td>
                      <td className="py-3 px-3 text-center font-mono" dir="ltr">
                        {m.shoulderCm} cm
                      </td>
                      <td className="py-3 px-3 text-center" dir="ltr">
                        {m.heightRange}
                      </td>
                      <td className="py-3 px-3 text-center" dir="ltr">
                        {m.weightRange}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Helpful Advice & WhatsApp Consultation */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div className="text-xs text-neutral-400 font-sans space-y-0.5 leading-relaxed text-center sm:text-start">
            <p className="font-semibold text-neutral-200">
              {isAr ? 'محتار بين مقاسين؟' : 'Between two sizes?'}
            </p>
            <p>
              {isAr
                ? 'قصتنا مصممة بأكتاف مائلة وبنية مريحة. إذا كنت تفضل مظهراً أكثر اتساعاً اختر المقاس الأكبر، أو استشر فريقنا مباشرة.'
                : 'Our boxy cut features dropped shoulders. For a more oversized drape choose the larger size, or chat with us.'}
            </p>
          </div>

          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-white hover:bg-neutral-200 text-black px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-2 shadow active:scale-95"
          >
            <MessageSquare size={14} className="text-[#D80032]" />
            <span>{isAr ? 'استشارة المقاس عبر واتساب' : 'WhatsApp Fit Advice'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
