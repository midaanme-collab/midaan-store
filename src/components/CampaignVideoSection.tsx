'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';

export default function CampaignVideoSection() {
  const { lang } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    videoRef.current.volume = 1.0;
    setIsMuted(nextMuted);
    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 1.0;
      setIsMuted(true);
      // Respect prefers-reduced-motion
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(() => {
            setIsPlaying(false);
          });
        }
      }
    }
  }, []);

  return (
    <section id="collab" className="w-full bg-[#070707] py-20 px-4 md:px-8 border-t border-[#1F1F1F] relative overflow-hidden scroll-mt-24" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D80032]/10 blur-[140px] pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Dual Collaboration Logos: Midaan x Sotusura */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 mb-10">
          <div className="flex flex-col items-center">
            <Image 
              src="/logo.png" 
              alt="Midaan" 
              width={200}
              height={100}
              className="h-16 sm:h-20 md:h-24 w-auto object-contain brightness-0 invert drop-shadow-[0_6px_24px_rgba(255,255,255,0.2)] transition-transform" 
            />
          </div>

          <div className="text-3xl sm:text-4xl md:text-5xl font-light text-neutral-600 select-none">
            ×
          </div>

          <div className="flex flex-col items-center">
            <Image 
              src="/sotusura.png" 
              alt="Sotusura" 
              width={200}
              height={100}
              className="h-16 sm:h-20 md:h-24 w-auto object-contain rounded-2xl shadow-2xl transition-transform" 
            />
          </div>
        </div>

        {/* Accessible Heading for Screen Readers */}
        <h2 className="sr-only">
          {isRtl ? 'ميدان × صوت وصورة' : 'Midaan × Sotusura'}
        </h2>

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
              onClick={toggleSound}
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

            {/* Play overlay when paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer w-full h-full border-none"
                aria-label={strings.campaign.playBtn}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-105 transition-transform shadow-2xl">
                  <Play size={28} className={isRtl ? 'mr-0.5' : 'ml-0.5'} />
                </div>
              </button>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-5 inset-x-5 z-30 flex items-center justify-between pointer-events-none">
              {/* Play/Pause Minimal Toggle */}
              <button
                type="button"
                onClick={togglePlay}
                className="pointer-events-auto p-2.5 rounded-full bg-black/65 hover:bg-black/85 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all active:scale-95"
                aria-label={isPlaying ? strings.campaign.pauseBtn : strings.campaign.playBtn}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className={isRtl ? 'mr-0.5' : 'ml-0.5'} />}
              </button>

              {/* Sleek Prominent Floating Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleSound}
                className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/75 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all active:scale-95 group"
                aria-label={isMuted ? (isRtl ? 'تشغيل الصوت' : 'Unmute video') : (isRtl ? 'كتم الصوت' : 'Mute video')}
              >
                {isMuted ? (
                  <>
                    <VolumeX size={16} className="text-[#D80032] group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-[11px] font-bold">
                      {isRtl ? 'تشغيل الصوت' : 'Unmute'}
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-[11px] font-bold">
                      {isRtl ? 'كتم الصوت' : 'Mute'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
