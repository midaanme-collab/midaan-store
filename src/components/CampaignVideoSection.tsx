'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store';

export default function CampaignVideoSection() {
  const { lang, currency } = useStore();
  const isRtl = lang === 'ar';
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Attempt muted autoplay without blocking initial load
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {
        // Autoplay prevented by browser, poster will be visible
        setIsPlaying(false);
      });
    }
  }, []);

  return (
    <section id="collab" className="w-full bg-[#070707] py-20 px-4 md:px-8 border-t border-[#1F1F1F] relative overflow-hidden">
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
        <div className="inline-flex items-center gap-2 bg-[#D80032] text-white px-4 py-1.5 font-mono text-[11px] md:text-xs font-bold tracking-normal rounded-full shadow-lg shadow-[#D80032]/25 mb-6">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>MIDAAN × SOTUSURA // ARCHIVE 01</span>
        </div>

        {/* Campaign Title */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-normal text-white mb-6 font-sans">
          {isRtl ? "حملة أرشيف 01 — صوت وسردية الشارع" : "ARCHIVE 01 CAMPAIGN — SOUND & STREET NARRATIVE"}
        </h2>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-neutral-300 text-sm md:text-base leading-relaxed mb-12 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
          {isRtl 
            ? 'اندماج بين منصة ميدان للمناصرة عبر الأزياء، وثقافة الشارع المستقلة لصوت صورة. مجموعة "أرشيف 01" تعيد صياغة الذاكرة البصرية وتوثق السردية البديلة على قطع قطنية ثقيلة ومستدامة.'
            : 'A synergy between Midaan\'s wearable advocacy and Sotusura\'s independent underground street culture. The "Archive 01" capsule reframes visual memory, documenting the alternative narrative on heavyweight sustainable cotton.'}
        </p>

        {/* 9:16 Vertical Cinema Frame */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] mx-auto rounded-[2.5rem] p-2 bg-gradient-to-b from-[#2a2a2a] via-[#141414] to-[#0a0a0a] border border-neutral-700/60 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(216,0,50,0.15)]">
          <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden bg-black flex items-center justify-center">
            
            <video
              ref={videoRef}
              src="/collab-video.mp4"
              poster="/video-poster.png"
              preload="metadata"
              loop
              muted={isMuted}
              playsInline
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Edge shadows overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar inside Cinema Frame */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-neutral-300">
                <span className="w-1.5 h-1.5 bg-[#D80032] rounded-full animate-ping" />
                <span>ARCHIVE 01 FILM</span>
              </div>
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-neutral-400">
                9:16 CINEMA
              </div>
            </div>

            {/* Play/Pause center overlay when paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer w-full h-full border-none"
                aria-label="Play Campaign Video"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-105 transition-transform">
                  <Play size={28} className="ml-1" />
                </div>
              </button>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-6 inset-x-6 z-30 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 w-full">
                {/* Play/Pause Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="bg-black/60 hover:bg-black/80 text-white p-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition-colors active:scale-95"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>

                {/* Prominent Unmute / Sound Toggle Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`flex-1 py-3.5 px-4 rounded-2xl font-mono text-xs font-black flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 active:scale-95 border ${
                    isMuted 
                      ? 'bg-[#D80032] hover:bg-[#B00028] text-white border-white/30 shadow-[#D80032]/40' 
                      : 'bg-white hover:bg-neutral-200 text-black border-transparent shadow-white/20'
                  }`}
                  aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={16} />
                      <span className="tracking-normal">
                        {isRtl ? '🔊 تشغيل الصوت' : '🔊 UNMUTE SOUND'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} className="text-[#D80032]" />
                      <span className="tracking-normal">
                        {isRtl ? '🔊 كتم الصوت' : '🔊 MUTE SOUND'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[10px] font-mono text-neutral-400/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{isRtl ? 'صوت أصلي بدقة عالية' : 'HD Master Audio Track'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* CTA to drops */}
        <div className="mt-10">
          <a
            href="#drops"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-mono text-xs md:text-sm font-black px-8 py-3.5 rounded-full transition-transform active:scale-95 shadow-xl hover:shadow-white/20"
          >
            <ShoppingBag size={16} />
            <span>
              {isRtl 
                ? (currency === 'USD' ? 'تسوق قطع التعاون (50 USD)' : 'تسوق قطع التعاون (35 د.أ)')
                : (currency === 'USD' ? 'SHOP COLLAB TEES (50 USD)' : 'SHOP COLLAB TEES (35 JOD)')}
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
