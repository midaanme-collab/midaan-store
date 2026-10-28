'use client';
import React from 'react';

export default function MidaanLogo({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const heightClass = size === "sm" ? "h-12 md:h-16" : size === "lg" ? "h-20 md:h-24" : size === "xl" ? "h-32 md:h-40" : "h-16 md:h-20";
  
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/logo.png" 
        alt="MIDAAN" 
        className={`${heightClass} w-auto object-contain brightness-0 invert`} 
      />
    </div>
  );
}
