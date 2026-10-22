'use client';

import React, { useRef } from 'react';
import { Upload, Ruler, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { SIZES, STUDIO_MOCKUPS, basePrices } from '@/constants';
import { GarmentType, TextColor, TextFont, PresetArt } from '@/types';

const ARCHIVE_PRESETS = [
  { id: 'calligraphy', name: 'Midaan Logo', designer: 'Midaan Core', meaning: 'Primary brutalist logo mark.' },
  { id: 'press', name: 'Basic Type', designer: 'Midaan Core', meaning: 'Standard editorial type.' },
  { id: 'far3i', name: 'El Far3i', designer: 'Tareq Abu Kwaik', meaning: 'Acoustic hip-hop capsule.' },
  { id: 'archive_1', name: 'Entehab', designer: 'Issue Zero', meaning: 'On loss and collective memory.' },
  { id: 'archive_2', name: 'Underground', designer: 'Amman Scene', meaning: 'Raw street manifesto.' },
  { id: 'archive_3', name: 'Diraa Al Turab', designer: 'Cinema Club', meaning: 'Visual storytelling emblem.' }
] as const;

export default function Studio() {
  const { 
    lang, garment, setGarment, view, setView, color, setColor, size, setSize,
    placement, setPlacement, artMode, setArtMode, selectedPreset, setSelectedPreset,
    customText, setCustomText, uploadedImage, setUploadedImage, setIsSizeChartOpen,
    artworkScale, setArtworkScale, verticalOffset, setVerticalOffset, customTextColor, setCustomTextColor, customTextFont, setCustomTextFont,
    addToCart, setIsCartOpen
  } = useStore();
  
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
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

  const getFontFamily = (font: TextFont) => {
    if (font === 'sans') return 'font-sans';
    if (font === 'serif') return 'font-heading';
    return 'font-mono';
  };

  const renderArtwork = () => {
    const isBack = view === 'back';
    const placementBase = placement === 'small_corpo' 
      ? (isBack ? 'scale-[0.4] -translate-y-8' : 'scale-[0.2] translate-x-12 -translate-y-12') 
      : 'scale-100';
    
    const dynamicScale = `scale(${artworkScale / 100})`;
    const dynamicTransform = `translateY(${verticalOffset * 4}px) ${dynamicScale}`;

    const styleObj = {
      transform: placement === 'small_corpo' ? undefined : dynamicTransform,
      color: customTextColor
    };

    if (artMode === 'presets') {
      if (selectedPreset === 'calligraphy' || selectedPreset === 'archive_2') {
        return <img src="/logo.png" alt={selectedPreset} style={{ transform: placement === 'small_corpo' ? undefined : dynamicTransform }} className={`w-48 invert opacity-80 ${placementBase} transition-all duration-300`} />;
      }
      return <div style={styleObj} className={`text-5xl font-black uppercase tracking-widest ${placementBase} transition-all duration-300`}>
        {selectedPreset === 'far3i' ? 'FAR3I' : selectedPreset === 'archive_1' ? 'ENTEHAB' : selectedPreset === 'archive_3' ? 'DIRAA' : 'MIDAAN'}
      </div>;
    }
    
    if (artMode === 'text') {
      return (
        <div style={styleObj} className={`text-4xl font-black break-words w-48 text-center uppercase tracking-widest ${getFontFamily(customTextFont)} ${placementBase} transition-all duration-300`}>
          {customText}
        </div>
      );
    }

    if (artMode === 'upload' && uploadedImage) {
      return <img src={uploadedImage} alt="Custom Upload" style={{ transform: placement === 'small_corpo' ? undefined : dynamicTransform }} className={`w-48 object-contain ${placementBase} transition-all duration-300`} />;
    }

    return null;
  };

  const currentPrice = basePrices[garment as keyof typeof basePrices];

  const handleAddToCart = () => {
    addToCart({
      id: Math.random().toString(36).substring(2, 9),
      garment,
      color,
      size,
      placement,
      artMode,
      price: currentPrice,
      customText: artMode === 'text' ? customText : undefined,
      selectedPreset: artMode === 'presets' ? selectedPreset : undefined,
    });
    setIsCartOpen(true);
  };

  const activePreset = ARCHIVE_PRESETS.find(p => p.id === selectedPreset);

  return (
    <section id="studio" className="w-full bg-[#050505] py-24 px-4 md:px-8 font-sans relative overflow-hidden">
      {/* Texture / Noise */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: 'url("/noise.png")' }}></div>

      <div className="max-w-7xl mx-auto flex items-end justify-between border-b border-[#262626] pb-6 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#D80032] uppercase font-bold tracking-widest mb-2">
            <span>{}
            {strings.studio.tag}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter">
            {}
            {strings.studio.title}
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 relative z-10">
        {/* Mockup Canvas */}
        <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#262626] rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl">
          <div className="absolute top-4 start-4 z-20 flex flex-col gap-2">
            <button 
              onClick={() => setView('front')}
              className={`px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${view === 'front' ? 'bg-white text-black shadow-lg scale-105' : 'bg-black/50 text-neutral-400 border border-[#262626] hover:bg-[#1A1A1A] hover:text-white'}`}
            >
              FRONT
            </button>
            <button 
              onClick={() => setView('back')}
              className={`px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${view === 'back' ? 'bg-white text-black shadow-lg scale-105' : 'bg-black/50 text-neutral-400 border border-[#262626] hover:bg-[#1A1A1A] hover:text-white'}`}
            >
              BACK
            </button>
          </div>

          <div className="absolute top-4 end-4 z-20">
             <div className="bg-black/60 backdrop-blur-xl border border-[#262626] px-4 py-2 rounded-lg font-mono text-sm font-bold text-white tracking-widest shadow-lg">
                {}
                {currentPrice.toFixed(2)} {strings.studio.jod}
             </div>
          </div>
          
          <div className="absolute bottom-4 start-4 end-4 z-20 text-center pointer-events-none">
             <div className="inline-block bg-black/60 backdrop-blur-md border border-[#262626] px-3 py-1 rounded font-mono text-[9px] font-bold text-[#E5E0D0] tracking-[0.2em] shadow-lg">
                KingJet 602A DTF • 3200 DPI • CMYK+W
             </div>
          </div>

          <div className="relative w-full h-full flex items-center justify-center pt-8">
            {getMockup() && (
              <img 
                src={getMockup()} 
                alt="Garment Mockup" 
                className="w-full max-w-lg object-contain transition-all duration-700 ease-out" 
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-8 pointer-events-none drop-shadow-lg">
              {renderArtwork()}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-10">
          
          {/* Garment Type */}
          <div className="space-y-4">
            <label className="font-mono text-[10px] text-neutral-500 font-black uppercase tracking-widest block pb-1 border-b border-[#1A1A1A]">
              {}
              {strings.studio.garmentLabel}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['tshirt', 'hoodie', 'tote'] as GarmentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setGarment(type)}
                  className={`p-4 border rounded-xl text-center transition-all ${garment === type ? 'border-[#D80032] bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] shadow-lg shadow-[#D80032]/10 scale-[1.02]' : 'border-[#262626] bg-[#0A0A0A] hover:border-neutral-500'}`}
                >
                  {}
                  <span className={`block text-xs font-bold ${garment === type ? 'text-white' : 'text-neutral-400'}`}>{strings.studio[type as keyof typeof strings.studio]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color & Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="font-mono text-[10px] text-neutral-500 font-black uppercase tracking-widest block pb-1 border-b border-[#1A1A1A]">
                {}
                {strings.studio.colorLabel}
              </label>
              <div className="flex gap-4">
                <button onClick={() => setColor('black')} className={`w-10 h-10 rounded-full bg-[#101010] border-2 shadow-inner transition-transform ${color === 'black' ? 'border-[#D80032] scale-110' : 'border-[#333] hover:scale-105'}`} />
                <button onClick={() => setColor('offwhite')} className={`w-10 h-10 rounded-full bg-[#E5E0D0] border-2 shadow-inner transition-transform ${color === 'offwhite' ? 'border-[#D80032] scale-110' : 'border-[#333] hover:scale-105'}`} />
                <button onClick={() => setColor('charcoal')} className={`w-10 h-10 rounded-full bg-[#242424] border-2 shadow-inner transition-transform ${color === 'charcoal' ? 'border-[#D80032] scale-110' : 'border-[#555] hover:scale-105'}`} />
              </div>
            </div>

            {garment !== 'tote' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-1">
                  <label className="font-mono text-[10px] text-neutral-500 font-black uppercase tracking-widest">
                    {}
                    {strings.studio.sizeLabel}
                  </label>
                  <button onClick={() => setIsSizeChartOpen(true)} className="flex items-center gap-1.5 text-[10px] text-[#D80032] hover:text-red-400 font-mono font-bold uppercase transition-colors">
                    <Ruler size={12} /> Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-10 h-10 border rounded-lg font-mono text-xs font-bold transition-all ${size === s ? 'border-[#D80032] bg-[#D80032]/10 text-white scale-110' : 'border-[#262626] bg-[#0A0A0A] text-neutral-500 hover:border-neutral-400 hover:text-white'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Placement */}
          <div className="space-y-4">
            <label className="font-mono text-[10px] text-neutral-500 font-black uppercase tracking-widest block pb-1 border-b border-[#1A1A1A]">
              {}
              {strings.studio.zoneLabel}
            </label>
            <div className="flex gap-4">
              <button 
                onClick={() => setPlacement('center')}
                className={`flex-1 py-3 border rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${placement === 'center' ? 'border-white bg-[#141414] text-white shadow-lg scale-[1.02]' : 'border-[#262626] bg-[#0A0A0A] text-neutral-500 hover:border-neutral-400 hover:text-neutral-300'}`}
              >
                {}
                {'Center Heavy'}
              </button>
              <button 
                onClick={() => setPlacement('small_corpo')}
                className={`flex-1 py-3 border rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${placement === 'small_corpo' ? 'border-white bg-[#141414] text-white shadow-lg scale-[1.02]' : 'border-[#262626] bg-[#0A0A0A] text-neutral-500 hover:border-neutral-400 hover:text-neutral-300'}`}
              >
                {}
                {'Pocket Stamp'}
              </button>
            </div>
          </div>

          {/* Interactive Artwork Controls (Studio 2.0) */}
          {placement === 'center' && (
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-bold border-b border-[#1F1F1F] pb-2">
                <SlidersHorizontal size={14} /> Adjustments
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-neutral-300">
                  <span>Scale</span>
                  <span>{artworkScale}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" max="130" 
                  value={artworkScale} 
                  onChange={(e) => setArtworkScale(Number(e.target.value))}
                  className="w-full accent-[#D80032] h-1 bg-[#262626] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-neutral-300">
                  <span>Vertical Offset</span>
                  <span>{verticalOffset}</span>
                </div>
                <input 
                  type="range" 
                  min="-32" max="32" 
                  value={verticalOffset} 
                  onChange={(e) => setVerticalOffset(Number(e.target.value))}
                  className="w-full accent-white h-1 bg-[#262626] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Upload / Text */}
          <div className="space-y-6 border-t border-[#1A1A1A] pt-8">
            <div className="flex gap-6 border-b border-[#1A1A1A]">
              <button onClick={() => setArtMode('presets')} className={`text-xs font-bold uppercase tracking-widest pb-3 border-b-2 transition-all ${artMode === 'presets' ? 'border-[#D80032] text-white' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}>Midaan Archive</button>
              <button onClick={() => setArtMode('text')} className={`text-xs font-bold uppercase tracking-widest pb-3 border-b-2 transition-all ${artMode === 'text' ? 'border-[#D80032] text-white' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}>Text</button>
              <button onClick={() => setArtMode('upload')} className={`text-xs font-bold uppercase tracking-widest pb-3 border-b-2 transition-all ${artMode === 'upload' ? 'border-[#D80032] text-white' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}>Upload</button>
            </div>

            {artMode === 'presets' && (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  {ARCHIVE_PRESETS.map(preset => (
                    <button 
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id as PresetArt)} 
                      className={`aspect-square border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${selectedPreset === preset.id ? 'border-white bg-[#141414] text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-[#262626] text-neutral-500 hover:border-neutral-400 hover:bg-[#0A0A0A]'}`}
                    >
                      <ImageIcon size={20} className={selectedPreset === preset.id ? 'text-[#D80032]' : ''} />
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-center px-1">{preset.name}</span>
                    </button>
                  ))}
                </div>
                {activePreset && (
                  <div className="bg-[#111] border border-[#262626] rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <div className="font-sans font-bold text-white text-sm">{activePreset.name}</div>
                      <div className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">{activePreset.meaning}</div>
                    </div>
                    <div className="font-mono text-[9px] text-[#D80032] uppercase tracking-widest border border-[#D80032]/30 px-2 py-1 rounded bg-[#D80032]/10">
                      {activePreset.designer}
                    </div>
                  </div>
                )}
              </div>
            )}

            {artMode === 'text' && (
              <div className="space-y-6 pt-2">
                <input 
                  type="text" 
                  value={customText} 
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-[#111] border border-[#262626] rounded-xl p-4 text-white font-bold placeholder-neutral-700 outline-none focus:border-white transition-colors"
                  placeholder="Type statement..."
                />
                
                <div className="flex justify-between items-center bg-[#0A0A0A] border border-[#1A1A1A] p-2 rounded-xl">
                  <div className="flex gap-2 p-1">
                    <button onClick={() => setCustomTextColor('white')} className={`w-8 h-8 rounded-full bg-white border-2 ${customTextColor === 'white' ? 'border-[#050505] ring-2 ring-white' : 'border-transparent'}`} />
                    <button onClick={() => setCustomTextColor('#D80032')} className={`w-8 h-8 rounded-full bg-[#D80032] border-2 ${customTextColor === '#D80032' ? 'border-[#050505] ring-2 ring-[#D80032]' : 'border-transparent'}`} />
                    <button onClick={() => setCustomTextColor('#E5E0D0')} className={`w-8 h-8 rounded-full bg-[#E5E0D0] border-2 ${customTextColor === '#E5E0D0' ? 'border-[#050505] ring-2 ring-[#E5E0D0]' : 'border-transparent'}`} />
                    <button onClick={() => setCustomTextColor('black')} className={`w-8 h-8 rounded-full bg-[#101010] border-2 ${customTextColor === 'black' ? 'border-[#050505] ring-2 ring-[#101010]' : 'border-[#333]'}`} />
                  </div>
                  <div className="flex gap-1 bg-[#111] border border-[#262626] p-1 rounded-lg">
                    <button onClick={() => setCustomTextFont('sans')} className={`px-4 py-2 font-sans text-xs font-bold rounded-md transition-colors ${customTextFont === 'sans' ? 'bg-[#262626] text-white' : 'text-neutral-500 hover:text-white'}`}>Sans</button>
                    <button onClick={() => setCustomTextFont('serif')} className={`px-4 py-2 font-heading text-xs font-bold rounded-md transition-colors ${customTextFont === 'serif' ? 'bg-[#262626] text-white' : 'text-neutral-500 hover:text-white'}`}>Serif</button>
                    <button onClick={() => setCustomTextFont('mono')} className={`px-4 py-2 font-mono text-xs font-bold rounded-md transition-colors ${customTextFont === 'mono' ? 'bg-[#262626] text-white' : 'text-neutral-500 hover:text-white'}`}>Mono</button>
                  </div>
                </div>
              </div>
            )}

            {artMode === 'upload' && (
              <div className="pt-2">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/png, image/svg+xml" className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#262626] hover:border-[#D80032] bg-[#0A0A0A] rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all group hover:bg-[#111]"
                >
                  <div className="bg-[#1A1A1A] p-4 rounded-full group-hover:bg-[#D80032]/20 transition-colors">
                    <Upload size={24} className="text-neutral-400 group-hover:text-[#D80032] transition-colors" />
                  </div>
                  <div className="text-center">
                    {}
                    <p className="text-sm font-bold text-white mb-2">{strings.studio.uploadLabel}</p>
                    {}
                    <p className="text-[10px] text-neutral-500 font-mono tracking-widest">{strings.studio.uploadHelp}</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-white text-black hover:bg-neutral-200 py-5 font-mono text-sm font-black uppercase tracking-[0.2em] transition-all rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-8"
          >
            {}
            {strings.studio.addToCart || "Add to Bag"}
          </button>
        </div>
      </div>
    </section>
  );
}
