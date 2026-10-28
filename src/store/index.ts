import { create } from 'zustand';
import { 
  Language, GarmentType, GarmentColor, GarmentView, GarmentSize, 
  PrintPlacement, ArtMode, PresetArt, TextColor, TextFont, CartItem, PaymentMethod
} from '@/types';
import { GOVERNORATES } from '@/constants';

interface StoreState {
  hasEntered: boolean;
  setHasEntered: (hasEntered: boolean) => void;
  lang: Language;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  setLang: (lang: Language) => void;
  
  // Studio State
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

  // Studio 2.0 State
  artworkScale: number;
  setArtworkScale: (scale: number) => void;
  verticalOffset: number;
  setVerticalOffset: (offset: number) => void;
  customTextColor: TextColor;
  setCustomTextColor: (color: TextColor) => void;
  customTextFont: TextFont;
  setCustomTextFont: (font: TextFont) => void;

  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  
  // UI State
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (isOpen: boolean) => void;
  isSizeChartOpen: boolean;
  setIsSizeChartOpen: (isOpen: boolean) => void;
  activeChartTab: 'tshirt' | 'hoodie';
  setActiveChartTab: (tab: 'tshirt' | 'hoodie') => void;
  isDossierOpen: boolean;
  setIsDossierOpen: (isOpen: boolean) => void;
  
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
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
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

  artworkScale: 100,
  setArtworkScale: (artworkScale) => set({ artworkScale }),
  verticalOffset: -16,
  setVerticalOffset: (verticalOffset) => set({ verticalOffset }),
  customTextColor: 'white',
  setCustomTextColor: (customTextColor) => set({ customTextColor }),
  customTextFont: 'sans',
  setCustomTextFont: (customTextFont) => set({ customTextFont }),

  cart: [],
  addToCart: (item) => set((state) => {
    const existingIndex = state.cart.findIndex(i => i.productTitle === item.productTitle && i.size === item.size && i.garment === item.garment);
    if (existingIndex > -1) {
      const newCart = [...state.cart];
      newCart[existingIndex] = { ...newCart[existingIndex], quantity: (newCart[existingIndex].quantity || 1) + 1 };
      return { cart: newCart };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  updateCartQuantity: (id, delta) => set((state) => {
    const newCart = [...state.cart];
    const itemIndex = newCart.findIndex(i => i.id === id);
    if (itemIndex > -1) {
      const newQty = (newCart[itemIndex].quantity || 1) + delta;
      if (newQty > 0) newCart[itemIndex].quantity = newQty;
    }
    return { cart: newCart };
  }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),
  isCartOpen: false,
  setIsCartOpen: (isCartOpen) => set({ isCartOpen }),
  paymentMethod: 'cliq',
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  
  isCheckoutOpen: false,
  setIsCheckoutOpen: (isCheckoutOpen) => set({ isCheckoutOpen }),
  isSizeChartOpen: false,
  setIsSizeChartOpen: (isSizeChartOpen) => set({ isSizeChartOpen }),
  activeChartTab: 'tshirt',
  setActiveChartTab: (activeChartTab) => set({ activeChartTab }),
  isDossierOpen: false,
  setIsDossierOpen: (isDossierOpen) => set({ isDossierOpen }),
  
  selectedGov: GOVERNORATES[0],
  setSelectedGov: (selectedGov) => set({ selectedGov }),
  copiedCliq: false,
  setCopiedCliq: (copiedCliq) => set({ copiedCliq }),
  
  isWorkshopModalOpen: false,
  setIsWorkshopModalOpen: (isWorkshopModalOpen) => set({ isWorkshopModalOpen }),
  selectedWorkshop: '',
  setSelectedWorkshop: (selectedWorkshop) => set({ selectedWorkshop }),
}));
