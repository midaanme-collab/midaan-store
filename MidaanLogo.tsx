'use client';
import React from 'react';

export default function MidaanLogo({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const heightClass = size === "sm" ? "h-9" : size === "lg" ? "h-16" : size === "xl" ? "h-24" : "h-12";
  
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
