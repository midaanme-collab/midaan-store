"use client";

import React, { useState } from "react";
import { Language, Product, GarmentSize } from "@/types";
import { Flame, ShoppingBag, Check } from "lucide-react";
import { useStore } from "@/store";
import Interactive3DTilt from "./Interactive3DTilt";
import { SHARED_PRODUCTS, normalizeSize } from "@/constants/products";

interface DropShowcaseProps {
  lang?: Language;
}

export default function DropShowcase({ lang }: DropShowcaseProps) {
  const { lang: storeLang, currency, addToCart, setIsCartOpen } = useStore();
  const effectiveLang = storeLang || lang || "ar";
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

  return (
    <section id="drops" dir={isRtl ? "rtl" : "ltr"} className="w-full bg-[#050505] py-20 px-4 md:px-8 font-sans border-t border-[#1F1F1F]">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#262626] pb-8 mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#D80032] uppercase font-bold tracking-normal mb-2">
            <Flame size={16} />
            <span>{isRtl ? "المخزون الفعلي // قطع جاهزة للشحن" : "PHYSICAL INVENTORY // READY TO SHIP"}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-normal font-sans">
            {isRtl ? "الإصدارات الحصرية الرسمية" : "OFFICIAL ARCHIVE DROPS"}
          </h2>
        </div>
        <div className="text-sm font-mono text-neutral-400">
          <span className="text-white font-bold">{isRtl ? "السعر الموحد:" : "Fixed Price:"}</span>{" "}
          <span className="text-[#D80032] font-black text-lg">
            {currency === "USD" ? "50 USD" : "35 JOD"}
          </span>
        </div>
      </div>

      {/* Two Approved Products Grid with Subtle 3D Tilt */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
        {SHARED_PRODUCTS.map((prod) => {
          const totalStock = prod.variants.reduce((sum, v) => sum + v.stockCount, 0);
          const currentSelectedSize = selectedSizes[prod.id];
          const activeVariant = prod.variants.find((v) => v.size === currentSelectedSize);

          const displayPrice = currency === "USD" 
            ? `${prod.basePriceUSD || 50} USD`
            : `${prod.basePriceJOD} ${isRtl ? "د.أ" : "JOD"}`;

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
                {/* Stock Counter Badge */}
                <div className="absolute top-5 start-5 z-20 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    {isRtl ? "إصدار محدود متوفر" : "Limited Edition In Stock"}
                  </span>
                </div>

                {/* Price Badge on Card */}
                <div className="absolute top-5 end-5 z-20 bg-[#D80032] text-white text-xs font-mono font-black px-3.5 py-1.5 rounded-full shadow-lg">
                  {displayPrice}
                </div>

                {/* Product Image with Hover Zoom */}
                <img
                  src={prod.images[0]}
                  alt={isRtl ? prod.titleAr : prod.titleEn}
                  className="w-4/5 h-auto max-h-[380px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105 select-none"
                  loading="eager"
                />

                {/* Bottom Bar Specs Overlay */}
                <div className="absolute bottom-4 inset-x-6 z-20 flex justify-between items-center text-[11px] font-mono text-neutral-400 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
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
                      {isRtl ? "اختر المقاس:" : "Select Size:"}
                    </span>
                    {activeVariant && (
                      <span className={`font-mono text-[11px] ${activeVariant.stockCount > 0 ? "text-emerald-400" : "text-neutral-500"}`}>
                        {activeVariant.stockCount > 0 
                          ? (isRtl ? "متوفر" : "In Stock")
                          : (isRtl ? "نفدت الكمية" : "Out of Stock")}
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
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSizes({ ...selectedSizes, [prod.id]: v.size })}
                          className={`relative py-3.5 rounded-xl font-mono text-sm font-black border transition-all flex items-center justify-center ${
                            isOutOfStock
                              ? "bg-[#111] border-[#222] text-neutral-600 cursor-not-allowed opacity-40 line-through"
                              : isSelected
                              ? "bg-white border-white text-black shadow-lg shadow-white/20"
                              : "bg-[#161616] border-[#2a2a2a] text-neutral-300 hover:border-neutral-400 hover:text-white"
                          }`}
                        >
                          <span>{v.size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing & Add to Cart Button */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#1F1F1F] mt-auto">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-normal">
                      {isRtl ? "السعر الموحد" : "Fixed Price"}
                    </div>
                    <div className="font-mono text-2xl md:text-3xl font-black text-white">
                      {displayPrice}
                    </div>
                  </div>

                  <button
                    type="button"
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
