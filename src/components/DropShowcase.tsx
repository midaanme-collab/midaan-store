"use client";

import React, { useState } from "react";
import { Language, Product, GarmentSize } from "@/types";
import { Flame, ShoppingBag, Check, ShieldCheck } from "lucide-react";
import { useStore } from "@/store";
import Interactive3DTilt from "./Interactive3DTilt";

interface DropShowcaseProps {
  lang?: Language;
}

export const REAL_PRODUCTS: Product[] = [
  {
    id: "drop-helmet-white",
    slug: "keffiyeh-helmet-tee",
    titleEn: "Keffiyeh Helmet Tee",
    titleAr: "تيشيرت خوذة الكوفية — الإصدار الأبيض",
    category: "drops",
    descriptionEn: "100% Bamboo Cotton • Production in Indonesia • DTG Print • Palestine Support",
    descriptionAr: "قطن خيزران 100% • إنتاج إندونيسيا • طباعة DTG رقمية • دعم فلسطين",
    basePriceJOD: 35.0,
    printSpec: "DTG_DIRECT_TO_GARMENT",
    images: ["/helmet-back-white.jpg"],
    variants: [
      { id: "v-hlm-s", sku: "HLM-W-S", size: "S", inStock: true, stockCount: 4 },
      { id: "v-hlm-m", sku: "HLM-W-M", size: "M", inStock: true, stockCount: 5 },
      { id: "v-hlm-l", sku: "HLM-W-L", size: "L", inStock: true, stockCount: 6 },
      { id: "v-hlm-xl", sku: "HLM-W-XL", size: "XL", inStock: true, stockCount: 2 },
      { id: "v-hlm-xxl", sku: "HLM-W-XXL", size: "XXL", inStock: true, stockCount: 4 },
    ],
    orderToPrintTimeHours: 24,
    isPrePrinted: true,
  },
  {
    id: "drop-poster-white",
    slug: "palestine-poster-tee",
    titleEn: "Palestine Poster Tee",
    titleAr: "تيشيرت بوستر فلسطين — الإصدار الأبيض",
    category: "drops",
    descriptionEn: "100% Bamboo Cotton • Production in Indonesia • DTG Print • Palestine Support",
    descriptionAr: "قطن خيزران 100% • إنتاج إندونيسيا • طباعة DTG رقمية • دعم فلسطين",
    basePriceJOD: 35.0,
    printSpec: "DTG_DIRECT_TO_GARMENT",
    images: ["/palestine-back-white.jpg"],
    variants: [
      { id: "v-pst-s", sku: "PST-W-S", size: "S", inStock: true, stockCount: 3 },
      { id: "v-pst-m", sku: "PST-W-M", size: "M", inStock: true, stockCount: 1 },
      { id: "v-pst-l", sku: "PST-W-L", size: "L", inStock: true, stockCount: 1 },
      { id: "v-pst-xl", sku: "PST-W-XL", size: "XL", inStock: true, stockCount: 8 },
      { id: "v-pst-xxl", sku: "PST-W-XXL", size: "XXL", inStock: true, stockCount: 1 },
    ],
    orderToPrintTimeHours: 24,
    isPrePrinted: true,
  },
];

export default function DropShowcase({ lang = "ar" }: DropShowcaseProps) {
  const { lang: currentLang, addToCart, setIsCartOpen } = useStore();
  const effectiveLang = currentLang || lang;
  const isRtl = effectiveLang === "ar";

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "drop-helmet-white": "L",
    "drop-poster-white": "XL",
  });
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleAddToCart = (prod: Product) => {
    const size = selectedSizes[prod.id];
    if (!size) {
      alert(isRtl ? "الرجاء اختيار المقاس أولاً" : "Please select a size first");
      return;
    }

    addToCart({
      id: `${prod.id}-${size}`,
      garment: "tshirt",
      color: "offwhite",
      size: size as GarmentSize,
      placement: "back",
      artMode: "presets",
      price: prod.basePriceJOD, // exactly 35 JOD
      isPrePrinted: true,
      productTitle: isRtl ? prod.titleAr : prod.titleEn,
    });

    setAddedItem(prod.id);
    setTimeout(() => setAddedItem(null), 1800);
    setIsCartOpen(true);
  };

  return (
    <section id="drops" dir={isRtl ? "rtl" : "ltr"} className="w-full bg-[#050505] py-24 px-4 md:px-8 font-sans border-t border-[#1F1F1F]">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#262626] pb-8 mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#D80032] uppercase font-bold tracking-normal mb-2">
            <Flame size={16} />
            <span>{isRtl ? "المخزون الفعلي // قطع جاهزة للشحن الفوري" : "PHYSICAL INVENTORY // READY FOR IMMEDIATE DISPATCH"}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-normal font-sans">
            {isRtl ? "الإصدارات الحصرية الرسمية" : "OFFICIAL ARCHIVE DROPS"}
          </h2>
        </div>
        <div className="text-sm font-mono text-neutral-400">
          <span className="text-white font-bold">{isRtl ? "السعر الموحد:" : "Uniform Price:"}</span>{" "}
          <span className="text-[#D80032] font-black text-lg">35 JOD / $50 USD</span>
        </div>
      </div>

      {/* Two Real Product Cards Grid with 3D Tilt & Glare */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {REAL_PRODUCTS.map((prod) => {
          const totalStock = prod.variants.reduce((sum, v) => sum + v.stockCount, 0);
          const currentSelectedSize = selectedSizes[prod.id];
          const activeVariant = prod.variants.find((v) => v.size === currentSelectedSize);

          return (
            <Interactive3DTilt
              key={prod.id}
              maxRotation={10}
              scale={1.02}
              showGlare={true}
              className="bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#262626] hover:border-neutral-500 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/5] bg-gradient-to-b from-[#181818] to-[#0A0A0A] flex items-center justify-center border-b border-[#222] p-8 overflow-hidden group">
                {/* Stock Counter Badge */}
                <div className="absolute top-5 start-5 z-20 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {isRtl ? `${totalStock} قطعة متوفرة فقط` : `Only ${totalStock} in Stock`}
                  </span>
                </div>

                {/* Price Badge on Card */}
                <div className="absolute top-5 end-5 z-20 bg-[#D80032] text-white text-xs font-mono font-black px-3 py-1.5 rounded-full shadow-lg">
                  35 JOD / $50 USD
                </div>

                {/* Product Image with Hover Zoom */}
                <img
                  src={prod.images[0]}
                  alt={isRtl ? prod.titleAr : prod.titleEn}
                  className="w-4/5 h-auto max-h-[380px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105 select-none"
                  loading="lazy"
                />

                {/* Bottom Bar overlay */}
                <div className="absolute bottom-4 inset-x-6 z-20 flex justify-between items-center text-[11px] font-mono text-neutral-400 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                  <span>100% Bamboo Cotton</span>
                  <span className="text-white font-bold">DTG Print</span>
                </div>
              </div>

              {/* Product Info & Controls */}
              <div className="p-7 md:p-8 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 className="font-black text-2xl md:text-3xl text-white leading-tight font-sans mb-2">
                    {isRtl ? prod.titleAr : prod.titleEn}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-300 font-mono leading-relaxed bg-[#161616] border border-[#262626] rounded-xl p-3">
                    {isRtl ? prod.descriptionAr : prod.descriptionEn}
                  </p>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs font-mono text-neutral-400 mb-2.5">
                    <span className="font-bold uppercase tracking-normal">
                      {isRtl ? "اختر المقاس المطلوب:" : "Select Size:"}
                    </span>
                    {activeVariant && (
                      <span className="text-emerald-400 font-mono text-[11px]">
                        {isRtl
                          ? `المتوفر: ${activeVariant.stockCount} قطع`
                          : `Stock: ${activeVariant.stockCount} left`}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {prod.variants.map((v) => {
                      const isSelected = selectedSizes[prod.id] === v.size;
                      const isOutOfStock = v.stockCount === 0;

                      return (
                        <button
                          key={v.id}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSizes({ ...selectedSizes, [prod.id]: v.size })}
                          className={`relative py-3 rounded-xl font-mono text-sm font-black border transition-all flex flex-col items-center justify-center ${
                            isOutOfStock
                              ? "bg-[#111] border-[#222] text-neutral-600 cursor-not-allowed opacity-40 line-through"
                              : isSelected
                              ? "bg-white border-white text-black shadow-lg shadow-white/20 scale-[1.02]"
                              : "bg-[#161616] border-[#2a2a2a] text-neutral-300 hover:border-neutral-400 hover:text-white"
                          }`}
                        >
                          <span>{v.size}</span>
                          <span
                            className={`text-[9px] mt-0.5 ${
                              isSelected ? "text-neutral-700 font-bold" : "text-neutral-500"
                            }`}
                          >
                            ({v.stockCount})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing & Add to Cart Button */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#1F1F1F] mt-auto">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-normal">
                      {isRtl ? "السعر (إتمام عبر كليك أو نقداً)" : "Price (CliQ or COD)"}
                    </div>
                    <div className="font-mono text-2xl md:text-3xl font-black text-white">
                      35 <span className="text-sm text-[#D80032]">{isRtl ? "د.أ" : "JOD"}</span>
                      <span className="text-xs text-neutral-400 font-normal ml-2">($50 USD)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="flex-1 max-w-[200px] bg-white hover:bg-neutral-200 text-black py-4 px-5 rounded-2xl font-mono text-xs md:text-sm font-black uppercase tracking-normal transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-white/20 active:scale-95"
                  >
                    {addedItem === prod.id ? (
                      <>
                        <Check size={16} className="text-emerald-600" />
                        <span>{isRtl ? "تمت الإضافة" : "Added"}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span>{isRtl ? "أضف للحقيبة" : "Add to Bag"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Interactive3DTilt>
          );
        })}
      </div>
    </section>
  );
}
