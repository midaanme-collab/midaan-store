"use client";

import React from "react";
import { Language, Product } from "../types";
import { Flame, ArrowUpRight } from "lucide-react";

interface DropShowcaseProps {
  lang?: Language;
  onSelectProduct?: (product: Product) => void;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: "drop-elfar3i-01",
    slug: "elfar3i-nas-min-khashab",
    titleEn: "MIDAAN × ELFAR3I // ناس من خشب",
    titleAr: "ميدان × الفرعي // ناس من خشب",
    category: "collabs",
    descriptionEn: "Official limited capsule celebrating Arabic acoustic hip-hop underground. Heavyweight 300GSM carded cotton.",
    descriptionAr: "التعاون الرسمي الحصري مع طارق أبو كويك (الفرعي). قطن ثقيل معالج 300 غرام بطباعة حرارية مزدوجة.",
    basePriceJOD: 24.0,
    printSpec: "DTF_INDUSTRIAL_602A",
    images: ["/merch/elfar3i-black-front.jpg"],
    variants: [
      { id: "v1", sku: "FR3-S", size: "S", inStock: true, stockCount: 14 },
      { id: "v2", sku: "FR3-M", size: "M", inStock: true, stockCount: 22 },
      { id: "v3", sku: "FR3-L", size: "L", inStock: true, stockCount: 8 },
      { id: "v4", sku: "FR3-XL", size: "XL", inStock: true, stockCount: 5 },
    ],
    isCollab: true,
    collabArtist: "Elfar3i / طارق الفرعي",
    orderToPrintTimeHours: 24,
  },
  {
    id: "drop-core-02",
    slug: "midaan-statement-hoodie",
    titleEn: "MIDAAN HEAVY STATEMENT HOODIE",
    titleAr: "هودي ميدان الأساسي الثقيل 460GSM",
    category: "drops",
    descriptionEn: "Boxy brutalist silhouette crafted in Jordan. High-density embroidery with DTF underprint.",
    descriptionAr: "قصة بوكسي ستريت عريضة مصنعة في الأردن. تطريز عالي الكثافة مع تفاصيل دقيقة خلفية.",
    basePriceJOD: 36.0,
    printSpec: "DTF_INDUSTRIAL_602A",
    images: ["/merch/hoodie-black-front.jpg"],
    variants: [
      { id: "v5", sku: "MDN-H-M", size: "M", inStock: true, stockCount: 15 },
      { id: "v6", sku: "MDN-H-L", size: "L", inStock: true, stockCount: 20 },
    ],
    orderToPrintTimeHours: 18,
  },
];

export default function DropShowcase({ lang = "ar", onSelectProduct }: DropShowcaseProps) {
  const isRtl = lang === "ar";

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="w-full bg-[#0A0A0A] py-12 px-4 md:px-8 font-sans border-t border-[#1F1F1F]">
      {/* Live Badge */}
      <div className="max-w-7xl mx-auto mb-10 bg-[#141414] border border-[#262626] p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D80032] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D80032]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase text-white tracking-widest">
                {isRtl ? "مشغل قبة ميدان للطباعة الحية — عمان" : "AMMAN DOME PRINT-STATION — ONLINE"}
              </span>
              <span className="bg-[#262626] text-[10px] font-mono px-2 py-0.5 text-neutral-300 rounded">
                KINGJET 602A DTF
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
              {isRtl
                ? "طباعة وتجهيز الطلبات الحالية يتم فورياً داخل مشغلنا في عمان خلال 24 ساعة كحد أقصى."
                : "Live order-to-print cycle operational. Turnaround 24h dispatched to all HKJ Governorates."}
            </p>
          </div>
        </div>

        <div className="font-mono text-[11px] text-neutral-400 border-s border-[#262626] ps-4">
          <div>LOC: AMMAN / SWIEFIEH</div>
          <div className="text-green-500 font-bold">STATUS: READY TO PRINT</div>
        </div>
      </div>

      {/* Section Title */}
      <div className="max-w-7xl mx-auto flex items-end justify-between border-b border-[#262626] pb-4 mb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#D80032] uppercase font-bold tracking-widest mb-1">
            <Flame size={14} />
            <span>{isRtl ? "إصدارات المشهد المستقل" : "UNDERGROUND DROPS & COLLABS"}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
            {isRtl ? "مجموعات الشارع الرسمية" : "OFFICIAL MERCHANDISE"}
          </h2>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {FEATURED_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="group bg-[#141414] border border-[#262626] hover:border-neutral-500 transition-all rounded-xl overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] bg-black flex items-center justify-center border-b border-[#262626]">
              {prod.isCollab && (
                <div className="absolute top-3 start-3 z-10 bg-[#D80032] text-white text-[10px] font-mono font-bold px-2.5 py-1 uppercase tracking-widest rounded">
                  {prod.collabArtist}
                </div>
              )}

              <div className="w-44 h-44 border border-neutral-800 flex flex-col items-center justify-center p-4 text-center group-hover:scale-105 transition-transform">
                <span className="text-4xl font-black text-white/20 uppercase tracking-widest">
                  {isRtl ? "ميدان" : "MIDAAN"}
                </span>
                <span className="font-mono text-[9px] text-[#D80032] mt-2 tracking-widest">
                  [DTF DUAL PASS 300DPI]
                </span>
              </div>

              <div className="absolute bottom-3 end-3 font-mono text-[10px] text-neutral-400 bg-black/90 px-2 py-1 border border-neutral-800 rounded">
                {prod.orderToPrintTimeHours}H FULFILLMENT
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-black text-xl md:text-2xl text-white group-hover:text-[#D80032] transition-colors">
                  {isRtl ? prod.titleAr : prod.titleEn}
                </h3>
                <span className="font-mono text-xl font-bold text-white whitespace-nowrap">
                  {prod.basePriceJOD.toFixed(2)}{" "}
                  <span className="text-xs text-[#D80032]">{isRtl ? "د.أ" : "JOD"}</span>
                </span>
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2 mb-6">
                {isRtl ? prod.descriptionAr : prod.descriptionEn}
              </p>

              <button
                onClick={() => onSelectProduct && onSelectProduct(prod)}
                className="w-full bg-black hover:bg-white text-white hover:text-black border border-[#262626] py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded"
              >
                <span>{isRtl ? "معاينة القطعة وتحديد المقاس" : "INSPECT & PRINT SPEC"}</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
