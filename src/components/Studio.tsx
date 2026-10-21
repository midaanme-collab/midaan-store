'use client';

import React, { useRef } from 'react';
import { Upload, Ruler } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { SIZES, STUDIO_MOCKUPS, basePrices } from '@/constants';
import { GarmentType } from '@/types';

export default function Studio() {
  const { 
    lang, garment, setGarment, view, setView, color, setColor, size, setSize,
    placement, setPlacement, artMode, setArtMode, selectedPreset, setSelectedPreset,
    customText, setCustomText, uploadedImage, setUploadedImage, setIsSizeChartOpen,
    setIsCheckoutOpen
  } = useStore();
  
  const strings = content[lang as keyof typeof content];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setArtMode('upload');
    }
  };

  const getMockup = () => {
    return STUDIO_MOCKUPS[garment as keyof typeof STUDIO_MOCKUPS]?.[color as keyof (typeof STUDIO_MOCKUPS)['tshirt']]?.[view as keyof { front: string; back: string }];
  };

  const renderArtwork = () => {
    const isBack = view === 'back';
    const artScale = placement === 'small_corpo' ? (isBack ? 'scale-[0.4] -translate-y-8' : 'scale-[0.2] translate-x-12 -translate-y-12') : 'scale-100';
    
    if (artMode === 'presets') {
      if (selectedPreset === 'calligraphy') {
        return <img src="/logo.png" alt="Calligraphy" className={`w-48 invert opacity-80 ${artScale} transition-all duration-500`} />;
      }
      return <div className={`text-5xl font-black text-white uppercase tracking-widest ${artScale} transition-all duration-500`}>MIDAAN</div>;
    }
    
    if (artMode === 'text') {
      return (
        <div className={`text-4xl font-black text-white break-words w-48 text-center uppercase tracking-widest ${artScale} transition-all duration-500`}>
          {customText}
        </div>
      );
    }

    if (artMode === 'upload' && uploadedImage) {
      return <img src={uploadedImage} alt="Custom Upload" className={`w-48 object-contain ${artScale} transition-all duration-500`} />;
    }

    return null;
  };

  const currentPrice = basePrices[garment as keyof typeof basePrices];

  return (
    <section id="studio" className="w-full bg-[#080808] py-12 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex items-end justify-between border-b border-[#262626] pb-4 mb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#D80032] uppercase font-bold tracking-widest mb-1">
            <span>{strings.studio.tag}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
            {strings.studio.title}
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mockup Canvas */}
        <div className="relative aspect-square md:aspect-[4/3] bg-[#141414] border border-[#262626] rounded-xl overflow-hidden flex items-center justify-center">
          <div className="absolute top-4 start-4 z-10 flex flex-col gap-2">
            <button 
              onClick={() => setView('front')}
              className={`px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest rounded ${view === 'front' ? 'bg-white text-black' : 'bg-black text-white border border-[#262626]'}`}
            >
              FRONT
            </button>
            <button 
              onClick={() => setView('back')}
              className={`px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest rounded ${view === 'back' ? 'bg-white text-black' : 'bg-black text-white border border-[#262626]'}`}
            >
              BACK
            </button>
          </div>

          <div className="absolute top-4 end-4 z-10">
             <div className="bg-black/80 backdrop-blur border border-[#262626] px-3 py-1.5 rounded font-mono text-xs font-bold text-white tracking-widest">
                {currentPrice.toFixed(2)} {strings.studio.jod}
             </div>
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            {getMockup() && (
              <img 
                src={getMockup()} 
                alt="Garment Mockup" 
                className="w-full max-w-md object-contain -translate-y-16 transition-all duration-500" 
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-16 pointer-events-none">
              {renderArtwork()}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-8">
          
          {/* Garment Type */}
          <div className="space-y-3">
            <label className="font-mono text-[11px] text-neutral-400 font-bold uppercase tracking-widest block border-b border-[#1A1A1A] pb-2">
              {strings.studio.garmentLabel}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['tshirt', 'hoodie', 'tote'] as GarmentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setGarment(type)}
                  className={`p-3 border rounded text-center transition-colors ${garment === type ? 'border-[#D80032] bg-[#141414]' : 'border-[#262626] bg-[#0A0A0A] hover:border-neutral-600'}`}
                >
                  <span className="block text-xs font-bold text-white">{strings.studio[type]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color & Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="font-mono text-[11px] text-neutral-400 font-bold uppercase tracking-widest block border-b border-[#1A1A1A] pb-2">
                {strings.studio.colorLabel}
              </label>
              <div className="flex gap-3">
                <button onClick={() => setColor('black')} className={`w-8 h-8 rounded-full bg-[#111] border-2 ${color === 'black' ? 'border-[#D80032]' : 'border-[#333]'}`} />
                <button onClick={() => setColor('offwhite')} className={`w-8 h-8 rounded-full bg-[#F4F4F0] border-2 ${color === 'offwhite' ? 'border-[#D80032]' : 'border-[#333]'}`} />
                <button onClick={() => setColor('charcoal')} className={`w-8 h-8 rounded-full bg-[#333] border-2 ${color === 'charcoal' ? 'border-[#D80032]' : 'border-[#555]'}`} />
              </div>
            </div>

            {garment !== 'tote' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                  <label className="font-mono text-[11px] text-neutral-400 font-bold uppercase tracking-widest">
                    {strings.studio.sizeLabel}
                  </label>
                  <button onClick={() => setIsSizeChartOpen(true)} className="flex items-center gap-1 text-[10px] text-[#D80032] hover:text-white font-mono uppercase transition-colors">
                    <Ruler size={12} /> Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-10 h-10 border rounded font-mono text-xs font-bold transition-colors ${size === s ? 'border-[#D80032] bg-[#D80032]/10 text-white' : 'border-[#262626] bg-[#0A0A0A] text-neutral-400 hover:border-neutral-500 hover:text-white'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Placement */}
          <div className="space-y-3">
            <label className="font-mono text-[11px] text-neutral-400 font-bold uppercase tracking-widest block border-b border-[#1A1A1A] pb-2">
              {strings.studio.zoneLabel}
            </label>
            <div className="flex gap-3">
              <button 
                onClick={() => setPlacement('center')}
                className={`flex-1 py-2 border rounded font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${placement === 'center' ? 'border-[#D80032] bg-[#141414] text-white' : 'border-[#262626] bg-[#0A0A0A] text-neutral-500 hover:border-neutral-400'}`}
              >
                Center Heavy
              </button>
              <button 
                onClick={() => setPlacement('small_corpo')}
                className={`flex-1 py-2 border rounded font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${placement === 'small_corpo' ? 'border-[#D80032] bg-[#141414] text-white' : 'border-[#262626] bg-[#0A0A0A] text-neutral-500 hover:border-neutral-400'}`}
              >
                Pocket Stamp
              </button>
            </div>
          </div>

          {/* Upload / Text */}
          <div className="space-y-3 border-t border-[#1A1A1A] pt-6">
            <div className="flex gap-4">
              <button onClick={() => setArtMode('presets')} className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 ${artMode === 'presets' ? 'border-[#D80032] text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}>Presets</button>
              <button onClick={() => setArtMode('text')} className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 ${artMode === 'text' ? 'border-[#D80032] text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}>Text</button>
              <button onClick={() => setArtMode('upload')} className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 ${artMode === 'upload' ? 'border-[#D80032] text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}>Upload</button>
            </div>

            {artMode === 'presets' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => setSelectedPreset('calligraphy')} className={`py-3 border rounded font-bold text-xs ${selectedPreset === 'calligraphy' ? 'border-white bg-[#141414] text-white' : 'border-[#262626] text-neutral-400 hover:border-neutral-500'}`}>MIDAAN Logo</button>
                <button onClick={() => setSelectedPreset('press')} className={`py-3 border rounded font-bold text-xs ${selectedPreset === 'press' ? 'border-white bg-[#141414] text-white' : 'border-[#262626] text-neutral-400 hover:border-neutral-500'}`}>Basic Type</button>
              </div>
            )}

            {artMode === 'text' && (
              <div className="pt-2">
                <input 
                  type="text" 
                  value={customText} 
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded p-3 text-white font-bold placeholder-neutral-700 outline-none focus:border-[#D80032] transition-colors"
                  placeholder="Type statement..."
                />
              </div>
            )}

            {artMode === 'upload' && (
              <div className="pt-2">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/png, image/svg+xml" className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-[#333] hover:border-[#D80032] bg-[#0A0A0A] rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors group"
                >
                  <Upload size={24} className="text-neutral-500 group-hover:text-[#D80032] transition-colors" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-white mb-1">{strings.studio.uploadLabel}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">{strings.studio.uploadHelp}</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-white text-black hover:bg-neutral-200 py-4 font-mono text-sm font-black uppercase tracking-widest transition-colors rounded flex items-center justify-center gap-2 mt-4"
          >
            {strings.studio.addToCart}
          </button>
        </div>
      </div>
    </section>
  );
}
