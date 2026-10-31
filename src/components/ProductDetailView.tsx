'use client';

import React, { useState } from 'react';
import { Product, GarmentSize } from '@/types';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { formatProductPrice, normalizeSize } from '@/constants/products';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Check, 
  MessageSquare, 
  ZoomIn, 
  X, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const { lang, currency, addToCart, setIsCartOpen } = useStore();
  const isAr = lang === 'ar';
  const strings = content[isAr ? 'ar' : 'en'];

  const [selectedSize, setSelectedSize] = useState<GarmentSize>('L');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const title = isAr ? product.titleAr : product.titleEn;
  const priceDisplay = formatProductPrice(currency, isAr ? 'ar' : 'en');
  const imageUrl = product.images[0] || '/helmet-back-white.jpg';

  const isHelmet = product.id.includes('helmet');

  // Documented design story
  const designStory = isHelmet
    ? {
        ar: 'صُمم هذا التيشيرت بالتعاون بين ميدان وسوتسورا ليعبر عن روح الشارع الفلسطيني المقاوم؛ حيث تلتقي خوذة الدراجة النارية مع نقشة الكوفية التقليدية كرمز للحماية واليقظة والصمود اليومي لجيل يتمسك بحقه في البقاء والتعبير.',
        en: 'Created in collaboration between Midaan and Sotusura, reflecting the raw pulse of the Palestinian street. The motorcycle helmet converges with the traditional keffiyeh weave as an emblem of urban protection, youth vigilance, and unyielding identity.'
      }
    : {
        ar: 'عمل جرافيكي توثيقي يستحضر ملصقات الذاكرة الوطنية برؤية معاصرة، مؤكداً على مركزية فلسطين كقضية عدالة إنسانية ونضال حي عابر للزمن، صُنع ليكون بياناً بصرياً يرافقك في الساحات والميادين.',
        en: 'An archival graphic work echoing national poster traditions with contemporary typography, asserting Palestine as an enduring cause of human justice and living resistance, crafted as a wearable statement for public squares.'
      };

  // Documented garment specifications
  const specs = [
    {
      labelAr: 'الخامة والنسيج',
      labelEn: 'Material & Fabric',
      valAr: 'قطن خيزران 100% طبيعي (100% Bamboo Cotton) فائق النعومة ومسامي.',
      valEn: '100% Bamboo Cotton, ultra-soft, breathable, and sustainably woven.'
    },
    {
      labelAr: 'بلد الصنع',
      labelEn: 'Origin & Manufacturing',
      valAr: 'صنع في إندونيسيا بشراكة تصنيعية حرفية مع سوتسورا.',
      valEn: 'Crafted in Indonesia through dedicated artisan partnership with Sotusura.'
    },
    {
      labelAr: 'تقنية الطباعة',
      labelEn: 'Print Execution',
      valAr: 'طباعة مباشرة على النسيج (DTG) عالية الدقة تندمج في ألياف القطن.',
      valEn: 'High-definition Direct-to-Garment (DTG) print embedded in fiber.'
    },
    {
      labelAr: 'القَصّة والمقاس',
      labelEn: 'Fit & Silhouette',
      valAr: 'قَصّة مريحة مناسبة للجنسين (Relaxed Unisex Fit).',
      valEn: 'Relaxed unisex silhouette tailored for everyday comfort.'
    }
  ];

  const selectedVariant = product.variants.find((v) => normalizeSize(v.size) === normalizeSize(selectedSize));
  const isVariantInStock = selectedVariant ? selectedVariant.inStock && selectedVariant.stockCount > 0 : false;

  const handleAddToCart = () => {
    if (!isVariantInStock) return;

    addToCart({
      id: `${product.id}-${selectedSize}`,
      garment: 'tshirt',
      color: 'offwhite',
      size: selectedSize,
      placement: 'back',
      artMode: 'presets',
      price: product.basePriceJOD,
      priceUSD: product.basePriceUSD || 50,
      previewImage: imageUrl,
      isPrePrinted: true,
      productTitle: isAr ? product.titleAr : product.titleEn,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
    setIsCartOpen(true);
  };

  const whatsappInquiryUrl = `https://wa.me/962770125316?text=${encodeURIComponent(
    isAr
      ? `مرحباً فريق ميدان، أود الاستفسار عن قياسات وتفاصيل ${product.titleAr} (المقاس: ${selectedSize}).`
      : `Hello Midaan team, I would like to inquire about sizing and measurements for ${product.titleEn} (Size: ${selectedSize}).`
  )}`;

  return (
    <PageLayout>
      <div 
        className="w-full bg-[#050505] text-[#EDEDED] min-h-screen py-10 md:py-16 px-4 md:px-8 font-sans transition-colors"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8 border-b border-[#1F1F1F] pb-4">
            <Link href="/" className="hover:text-white transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/collab" className="hover:text-white transition-colors">
              {isAr ? 'التعاون' : 'Collaboration'}
            </Link>
            <span>/</span>
            <span className="text-white font-bold truncate">{title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Image Showcase & Lightbox Zoom */}
            <div className="lg:col-span-7">
              <div className="relative group bg-gradient-to-b from-[#111111] to-[#0A0A0A] border border-[#262626] rounded-3xl overflow-hidden p-6 md:p-10 shadow-2xl">
                
                {/* Collaboration & Garment Badges */}
                <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between pointer-events-none">
                  <span className="bg-[#D80032] text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {isAr ? 'إصدار محدود // Midaan × Sotusura' : 'Limited Drop // Midaan × Sotusura'}
                  </span>
                  <span className="bg-black/70 backdrop-blur-md border border-[#333] text-neutral-300 text-[10px] md:text-xs px-2.5 py-1 rounded-full">
                    {isAr ? 'قطن خيزران 100%' : '100% Bamboo Cotton'}
                  </span>
                </div>

                {/* Main Product Image */}
                <div 
                  className="relative aspect-[4/5] w-full flex items-center justify-center cursor-zoom-in"
                  onClick={() => setIsZoomOpen(true)}
                  title={isAr ? 'انقر لتكبير وفحص تفاصيل القطعة' : 'Click to inspect fabric & print details'}
                >
                  <img 
                    src={imageUrl} 
                    alt={title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  
                  {/* Zoom Indicator Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomOpen(true);
                    }}
                    className="absolute bottom-4 right-4 bg-black/80 hover:bg-[#D80032] border border-[#333] text-white p-2.5 rounded-full backdrop-blur-md transition-all shadow-xl flex items-center gap-1.5 text-xs font-bold"
                    aria-label={isAr ? 'تكبير وفحص الصورة' : 'Zoom image'}
                  >
                    <ZoomIn size={16} />
                    <span className="hidden sm:inline">{isAr ? 'تكبير للتفاصيل' : 'Zoom Details'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Details, Size, Price, WhatsApp & Bag */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              
              <div className="mb-6">
                <span className="text-[#D80032] text-xs font-bold tracking-wider uppercase mb-2 block">
                  {isAr ? 'المجموعة التأسيسية • خريف 2026' : 'Founding Collection • Autumn 2026'}
                </span>
                
                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight font-sans mb-3">
                  {title}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-black text-white font-sans" dir={isAr && currency === 'JOD' ? 'rtl' : 'ltr'}>
                    {priceDisplay}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {isAr ? '(شامل الضريبة)' : '(Tax included)'}
                  </span>
                </div>

                {/* Story Statement */}
                <p className="text-sm text-neutral-300 font-sans leading-relaxed bg-[#111] border border-[#262626] rounded-2xl p-4 mb-6">
                  {isAr ? designStory.ar : designStory.en}
                </p>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs text-neutral-300 mb-3">
                  <span className="font-bold">
                    {strings.products.selectSize}: <span className="text-white font-mono">{selectedSize}</span>
                  </span>
                  
                  <span className={`text-xs font-semibold ${isVariantInStock ? 'text-emerald-400' : 'text-neutral-500'}`}>
                    {isVariantInStock ? strings.products.inStock : strings.products.outOfStock}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-3" dir="ltr">
                  {(['S', 'M', 'L', 'XL', '2XL'] as GarmentSize[]).map((sz) => {
                    const variant = product.variants.find(v => normalizeSize(v.size) === sz);
                    const inStock = variant ? variant.inStock && variant.stockCount > 0 : false;
                    const isSelected = selectedSize === sz;

                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={!inStock}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-3 rounded-xl font-mono text-xs font-black transition-all border ${
                          isSelected 
                            ? 'border-[#D80032] bg-[#D80032] text-white shadow-lg shadow-[#D80032]/30 scale-[1.02]' 
                            : inStock 
                              ? 'border-[#262626] bg-[#111] text-neutral-300 hover:border-neutral-500 hover:text-white' 
                              : 'border-[#1A1A1A] bg-[#0A0A0A] text-neutral-600 cursor-not-allowed line-through'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                {/* Sizing on WhatsApp link */}
                <div className="flex justify-end">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 underline underline-offset-4 transition-colors"
                  >
                    <MessageSquare size={13} />
                    <span>{isAr ? 'استفسر عن المقاس عبر واتساب' : 'Ask about sizing on WhatsApp'}</span>
                  </a>
                </div>
              </div>

              {/* Action: Add to Bag */}
              <div className="space-y-3 mb-8">
                <button
                  type="button"
                  disabled={!isVariantInStock}
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-sans text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 ${
                    !isVariantInStock
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-[#262626]'
                      : isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-neutral-200 text-black'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} />
                      <span>{isAr ? 'أُضيف إلى الحقيبة!' : 'Added to Bag!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>
                        {isVariantInStock 
                          ? strings.products.addToCart 
                          : strings.products.outOfStock}
                      </span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-neutral-400 font-sans text-center leading-relaxed">
                  {isAr 
                    ? '* ملاحظة: هذا طلب حجز أولي. يتولى فريق ميدان مراجعة وتأكيد توفر المقاس فعلياً في المستودع وحساب رسوم التوصيل قبل تأكيد الطلب النهائي عبر واتساب.'
                    : '* Note: This is an order reservation request. The Midaan team verifies actual stock availability and confirms delivery fees prior to final WhatsApp confirmation.'}
                </p>
              </div>

              {/* Verified Product Specifications Table */}
              <div className="bg-[#101010] border border-[#222] rounded-2xl p-5 space-y-3 text-xs font-sans">
                <div className="flex items-center gap-2 text-white font-bold border-b border-[#222] pb-3">
                  <ShieldCheck size={16} className="text-[#D80032]" />
                  <span>{isAr ? 'المواصفات المعتمدة للقطعة' : 'Verified Garment Specifications'}</span>
                </div>

                <div className="space-y-2.5">
                  {specs.map((sp, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-neutral-300">
                      <span className="font-semibold text-neutral-400 min-w-[120px]">
                        {isAr ? sp.labelAr : sp.labelEn}:
                      </span>
                      <span className="text-neutral-200">
                        {isAr ? sp.valAr : sp.valEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / High-Resolution Zoom Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-neutral-400 hover:text-white p-3 rounded-full bg-white/10 transition-colors"
            aria-label="Close high-res view"
          >
            <X size={24} />
          </button>

          <div 
            className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={imageUrl} 
              alt={title}
              className="max-h-[80vh] w-auto object-contain filter drop-shadow-2xl rounded-2xl"
            />
            <p className="text-xs text-neutral-400 font-sans mt-4 text-center">
              {title} • {isAr ? 'طباعة مباشرة على القماش (DTG) عالية الجودة' : 'High-Definition DTG Direct-to-Garment Print'}
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
