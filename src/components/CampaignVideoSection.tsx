'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';

export default function CampaignVideoSection() {
  const { lang, currency } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    // Strictly preserve muted attribute - no code path unmutes the video
    videoRef.current.muted = true;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      // Respect prefers-reduced-motion
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, []);

  return (
    <section id="collab" className="w-full bg-[#070707] py-20 px-4 md:px-8 border-t border-[#1F1F1F] relative overflow-hidden scroll-mt-24" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D80032]/10 blur-[140px] pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Dual Collaboration Logos: Midaan x Sotusura */}
        <div className="flex items-center justify-center gap-6 md:gap-12 mb-8">
          <div className="flex flex-col items-center">
            <img 
              src="/logo.png" 
              alt="Midaan" 
              className="h-14 md:h-20 w-auto object-contain brightness-0 invert drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]" 
            />
          </div>

          <div className="text-2xl md:text-4xl font-light text-neutral-600 select-none">
            ×
          </div>

          <div className="flex flex-col items-center">
            <img 
              src="/sotusura.png" 
              alt="Sotusura" 
              className="h-14 md:h-20 w-auto object-contain rounded-xl shadow-xl" 
            />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#D80032] text-white px-4 py-1.5 font-sans text-xs font-bold tracking-normal rounded-full shadow-lg shadow-[#D80032]/25 mb-6">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>{strings.campaign.badge}</span>
        </div>

        {/* Campaign Title */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-normal text-white mb-6 font-sans leading-tight text-balance">
          {strings.campaign.heading}
        </h2>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-neutral-300 text-base md:text-lg leading-relaxed mb-12 font-sans">
          {strings.campaign.desc}
        </p>

        {/* 9:16 Vertical Cinema Frame */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] mx-auto rounded-[2.5rem] p-2 bg-gradient-to-b from-[#2a2a2a] via-[#141414] to-[#0a0a0a] border border-neutral-700/60 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(216,0,50,0.15)]">
          <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden bg-black flex items-center justify-center">
            
            <video
              ref={videoRef}
              src="/collab-video.mp4"
              poster="/video-poster.png"
              preload="metadata"
              autoPlay
              loop
              muted
              playsInline
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Edge shadows overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar inside Cinema Frame */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] font-sans text-neutral-200">
                <span className="w-1.5 h-1.5 bg-[#D80032] rounded-full animate-ping" />
                <span>{strings.campaign.filmBadge}</span>
              </div>
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-neutral-400">
                9:16
              </div>
            </div>

            {/* Play/Pause center overlay when paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer w-full h-full border-none"
                aria-label={strings.campaign.playBtn}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-105 transition-transform">
                  <Play size={28} className={isRtl ? 'mr-0.5' : 'ml-0.5'} />
                </div>
              </button>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-6 inset-x-6 z-30 flex items-center justify-center">
              <button
                type="button"
                onClick={togglePlay}
                className="w-full py-3.5 px-6 rounded-2xl font-sans text-xs font-bold flex items-center justify-center gap-2.5 bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md shadow-xl transition-all active:scale-95"
                aria-label={isPlaying ? strings.campaign.pauseBtn : strings.campaign.playBtn}
              >
                {isPlaying ? (
                  <>
                    <Pause size={16} />
                    <span>{strings.campaign.pauseBtn}</span>
                  </>
                ) : (
                  <>
                    <Play size={16} className={isRtl ? 'mr-0.5' : 'ml-0.5'} />
                    <span>{strings.campaign.playBtn}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* CTA to drops */}
        <div className="mt-10">
          <a
            href="#drops"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-sans text-sm font-bold px-8 py-3.5 rounded-full transition-transform active:scale-95 shadow-xl hover:shadow-white/20"
          >
            <ShoppingBag size={16} />
            <span>{strings.campaign.shopBtn}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
