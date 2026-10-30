'use client';
import React from 'react';

export default function MidaanLogo({ 
  size = "md",
  className = "" 
}: { 
  size?: "sm" | "md" | "lg" | "xl" | "nav" | "hero";
  className?: string;
}) {
  const heightClass = 
    size === "sm" ? "h-8" :
    size === "md" ? "h-12" :
    size === "lg" ? "h-16" :
    size === "xl" ? "h-20" :
    size === "nav" ? "h-16 md:h-20" :
    size === "hero" ? "h-24 md:h-32" : "h-12";
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/logo.png" 
        alt="Midaan | ميدان" 
        className={`${heightClass} w-auto object-contain brightness-0 invert drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]`} 
      />
    </div>
  );
}
