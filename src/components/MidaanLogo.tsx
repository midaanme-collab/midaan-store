'use client';
import React from 'react';

export default function MidaanLogo({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const heightClass = size === "sm" ? "h-6" : size === "lg" ? "h-12" : size === "xl" ? "h-20" : "h-9";
  
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
