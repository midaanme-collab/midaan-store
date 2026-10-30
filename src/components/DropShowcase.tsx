"use client";

import React, { useState } from "react";
import { Language, Product, GarmentSize } from "@/types";
import { ShoppingBag, Check, Ruler } from "lucide-react";
import { useStore } from "@/store";
import Interactive3DTilt from "./Interactive3DTilt";
import { SHARED_PRODUCTS, normalizeSize, formatProductPrice } from "@/constants/products";
import { content } from "@/locales/dictionary";

interface DropShowcaseProps {
  lang?: Language;
}

export default function DropShowcase({ lang }: DropShowcaseProps) {
  const { lang: storeLang, currency, addToCart, setIsCartOpen, setIsSizeChartOpen } = useStore();
  const effectiveLang = (storeLang || lang || "ar") as "ar" | "en";
  const strings = content[effectiveLang];
  const isRtl = effectiveLang === "ar";

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "drop-helmet-white": "L",
    "drop-poster-white": "XL",
  });
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleAddToCart = (prod: Product) => {
    const rawSize = selectedSizes[prod.id];
    if (!rawSize) {
      alert(isRtl ? "الرجاء اختيار المقاس أولاً" : "Please select a size first");
      return;
    }

    const normSize = normalizeSize(rawSize);

    addToCart({
      id: `${prod.id}-${normSize}`,
      garment: "tshirt",
      color: "offwhite",
      size: normSize as GarmentSize,
      placement: "back",
      artMode: "presets",
      price: prod.basePriceJOD, // 35.0 JOD
      priceUSD: prod.basePriceUSD || 50.0, // 50.0 USD
      isPrePrinted: true,
      productTitle: isRtl ? prod.titleAr : prod.titleEn,
    });

    setAddedItem(prod.id);
    setTimeout(() => setAddedItem(null), 1800);
    setIsCartOpen(true);
  };

  const displayPrice = formatProductPrice(currency, effectiveLang);

  return (
    <section id="drops" dir={isRtl ? "rtl" : "ltr"} className="w-full bg-[#050505] py-20 px-4 md:px-8 font-sans border-t border-[#1F1F1F] scroll-mt-24">
      {/* Section Header */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#262626] pb-8 mb-16 gap-6">
        <div>
          <div className="inline-block bg-[#D80032]/10 border border-[#D80032]/30 text-[#D80032] px-3.5 py-1 rounded-full text-xs font-bold uppercase mb-3">
            <span>{strings.products.label}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-normal font-sans leading-tight">
            {strings.products.heading}
          </h2>
        </div>
        
        <div className="text-sm text-neutral-300 font-medium">
          <span className="text-neutral-400">{strings.products.fixedPriceLabel}:</span>{" "}
          <span className="text-white font-bold text-xl ml-1" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
            {displayPrice}
          </span>
        </div>
      </div>

      {/* Two Approved Products Grid with Subtle 3D Tilt */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
        {SHARED_PRODUCTS.map((prod) => {
          const currentSelectedSize = selectedSizes[prod.id] || "L";
          const activeVariant = prod.variants.find((v) => v.size === currentSelectedSize);
          const isVariantInStock = activeVariant ? activeVariant.stockCount > 0 : true;

          return (
            <Interactive3DTilt
              key={prod.id}
              maxRotation={6}
              scale={1.015}
              showGlare={true}
              className="bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#262626] hover:border-neutral-500 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl transition-colors duration-300"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/5] bg-gradient-to-b from-[#181818] to-[#0A0A0A] flex items-center justify-center border-b border-[#222] p-8 overflow-hidden group">
                {/* Limited Edition Badge */}
                <div className="absolute top-5 start-5 z-20 bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{strings.products.label}</span>
                </div>

                {/* Price Badge on Card */}
                <div className="absolute top-5 end-5 z-20 bg-[#D80032] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                  {displayPrice}
                </div>

                {/* Product Image with Hover Zoom */}
                <img
                  src={prod.images[0]}
                  alt={isRtl ? prod.titleAr : prod.titleEn}
                  className="w-4/5 h-auto max-h-[380px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105 select-none"
                  loading="eager"
                />

                {/* Localized Bottom Bar Specs */}
                <div className="absolute bottom-4 inset-x-6 z-20 flex justify-between items-center text-xs text-neutral-300 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <span>{strings.products.bambooFabric}</span>
                  <span className="text-white font-bold">{strings.products.dtgPrint}</span>
                </div>
              </div>

              {/* Product Info & Controls */}
              <div className="p-7 md:p-8 flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className="font-black text-2xl md:text-3xl text-white leading-tight font-sans mb-3">
                    {isRtl ? prod.titleAr : prod.titleEn}
                  </h3>
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed bg-[#161616] border border-[#262626] rounded-xl p-3.5">
                    {isRtl ? prod.descriptionAr : prod.descriptionEn}
                  </p>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs text-neutral-300 mb-3">
                    <span className="font-bold">
                      {strings.products.selectSize}:
                    </span>
                    
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsSizeChartOpen(true)}
                        className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 underline underline-offset-4 transition-colors"
                      >
                        <Ruler size={13} />
                        <span>{isRtl ? "دليل المقاسات" : "Size Guide"}</span>
                      </button>

                      <span className={`text-xs font-semibold ${isVariantInStock ? "text-emerald-400" : "text-neutral-500"}`}>
                        {isVariantInStock ? strings.products.inStock : strings.products.outOfStock}
                      </span>
                    </div>
                  </div>

                  {/* Size Choice in Predictable S, M, L, XL, 2XL Order */}
                  <div className="grid grid-cols-5 gap-2.5" dir="ltr">
                    {prod.variants.map((v) => {
                      const isSelected = selectedSizes[prod.id] === v.size;
                      const isOutOfStock = v.stockCount === 0;

                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSizes({ ...selectedSizes, [prod.id]: v.size })}
                          className={`relative py-3.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${
                            isOutOfStock
                              ? "bg-[#111] border-[#222] text-neutral-600 cursor-not-allowed opacity-40 line-through"
                              : isSelected
                              ? "bg-white border-white text-black shadow-lg shadow-white/20"
                              : "bg-[#161616] border-[#2A2A2A] text-neutral-200 hover:border-neutral-400 hover:text-white"
                          }`}
                          aria-label={`Size ${v.size}`}
                        >
                          <span>{v.size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing & Add to Cart Button */}
                <div className="flex items-center justify-between gap-4 pt-5 border-t border-[#1F1F1F] mt-auto">
                  <div>
                    <div className="text-xs text-neutral-400 font-medium">
                      {strings.products.fixedPriceLabel}
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-white" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                      {displayPrice}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod)}
                    className="flex-1 max-w-[210px] bg-white hover:bg-neutral-200 text-black py-4 px-5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-white/20 active:scale-95"
                  >
                    {addedItem === prod.id ? (
                      <>
                        <Check size={16} className="text-emerald-600" />
                        <span>{strings.products.added}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span>{strings.products.addToBag}</span>
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
