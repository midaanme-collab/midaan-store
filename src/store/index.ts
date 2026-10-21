import { create } from 'zustand';
import { 
  Language, GarmentType, GarmentColor, GarmentView, GarmentSize, 
  PrintPlacement, ArtMode, PresetArt 
} from '@/types';
import { GOVERNORATES } from '@/constants';

interface StoreState {
  hasEntered: boolean;
  setHasEntered: (hasEntered: boolean) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  
  garment: GarmentType;
  setGarment: (garment: GarmentType) => void;
  view: GarmentView;
  setView: (view: GarmentView) => void;
  color: GarmentColor;
  setColor: (color: GarmentColor) => void;
  size: GarmentSize;
  setSize: (size: GarmentSize) => void;
  placement: PrintPlacement;
  setPlacement: (placement: PrintPlacement) => void;
  
  artMode: ArtMode;
  setArtMode: (mode: ArtMode) => void;
  selectedPreset: PresetArt;
  setSelectedPreset: (preset: PresetArt) => void;
  customText: string;
  setCustomText: (text: string) => void;
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (isOpen: boolean) => void;
  isSizeChartOpen: boolean;
  setIsSizeChartOpen: (isOpen: boolean) => void;
  activeChartTab: 'tshirt' | 'hoodie';
  setActiveChartTab: (tab: 'tshirt' | 'hoodie') => void;
  
  selectedGov: typeof GOVERNORATES[0];
  setSelectedGov: (gov: typeof GOVERNORATES[0]) => void;
  copiedCliq: boolean;
  setCopiedCliq: (copied: boolean) => void;
  
  isWorkshopModalOpen: boolean;
  setIsWorkshopModalOpen: (isOpen: boolean) => void;
  selectedWorkshop: string;
  setSelectedWorkshop: (workshop: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  hasEntered: false,
  setHasEntered: (hasEntered) => set({ hasEntered }),
  lang: 'ar',
  setLang: (lang) => set((state) => {
    let customText = state.customText;
    if (customText === 'مَـيـدَان' && lang === 'en') customText = 'MIDAAN';
    if (customText === 'MIDAAN' && lang === 'ar') customText = 'مَـيـدَان';
    return { lang, customText };
  }),
  
  garment: 'tshirt',
  setGarment: (garment) => set({ garment }),
  view: 'front',
  setView: (view) => set({ view }),
  color: 'black',
  setColor: (color) => set({ color }),
  size: 'L',
  setSize: (size) => set({ size }),
  placement: 'center',
  setPlacement: (placement) => set({ placement }),
  
  artMode: 'presets',
  setArtMode: (artMode) => set({ artMode }),
  selectedPreset: 'calligraphy',
  setSelectedPreset: (selectedPreset) => set({ selectedPreset }),
  customText: 'مَـيـدَان',
  setCustomText: (customText) => set({ customText }),
  uploadedImage: null,
  setUploadedImage: (uploadedImage) => set({ uploadedImage }),
  
  isCheckoutOpen: false,
  setIsCheckoutOpen: (isCheckoutOpen) => set({ isCheckoutOpen }),
  isSizeChartOpen: false,
  setIsSizeChartOpen: (isSizeChartOpen) => set({ isSizeChartOpen }),
  activeChartTab: 'tshirt',
  setActiveChartTab: (activeChartTab) => set({ activeChartTab }),
  
  selectedGov: GOVERNORATES[0],
  setSelectedGov: (selectedGov) => set({ selectedGov }),
  copiedCliq: false,
  setCopiedCliq: (copiedCliq) => set({ copiedCliq }),
  
  isWorkshopModalOpen: false,
  setIsWorkshopModalOpen: (isWorkshopModalOpen) => set({ isWorkshopModalOpen }),
  selectedWorkshop: '',
  setSelectedWorkshop: (selectedWorkshop) => set({ selectedWorkshop }),
}));
