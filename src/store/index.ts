import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Language, GarmentType, GarmentColor, GarmentView, GarmentSize, 
  PrintPlacement, ArtMode, PresetArt, TextColor, TextFont, CartItem, PaymentMethod
} from '@/types';
import { GOVERNORATES } from '@/constants';

interface StoreState {
  hasEntered: boolean;
  setHasEntered: (hasEntered: boolean) => void;
  lang: Language;
  currency: 'JOD' | 'USD';
  setCurrency: (currency: 'JOD' | 'USD') => void;
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

export const useStore = create<StoreState>()(persist((set) => ({
  hasEntered: false,
  setHasEntered: (hasEntered) => set({ hasEntered }),
  lang: 'ar',
  currency: 'JOD',
  setCurrency: (currency) => set({ currency }),
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
    
    let maxStock = 20; // fallback max
    if (item.productTitle === 'HELMET WHITE TEE' || item.productTitle === 'تيشيرت الخوذة الأبيض') {
        if (item.size === 'S') maxStock = 4;
        if (item.size === 'M') maxStock = 5;
        if (item.size === 'L') maxStock = 6;
        if (item.size === 'XL') maxStock = 2;
        if (item.size === '2XL') maxStock = 4;
    }
    if (item.productTitle === 'POSTER WHITE TEE' || item.productTitle === 'تيشيرت البوستر الأبيض') {
        if (item.size === 'S') maxStock = 3;
        if (item.size === 'M') maxStock = 1;
        if (item.size === 'L') maxStock = 1;
        if (item.size === 'XL') maxStock = 8;
        if (item.size === '2XL') maxStock = 1;
    }
      
    if (existingIndex > -1) {
      const newCart = [...state.cart];
      const newQty = (newCart[existingIndex].quantity || 1) + 1;
      
      if (newQty <= maxStock) {
        newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQty };
      } else {
        newCart[existingIndex] = { ...newCart[existingIndex], quantity: maxStock };
      }
      return { cart: newCart };
    }
    
    // Add new item to cart
    if (1 <= maxStock) {
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }
    return { cart: state.cart }; // Should not happen but fail safe
  }),
  updateCartQuantity: (id, delta) => set((state) => {
    const newCart = [...state.cart];
    const itemIndex = newCart.findIndex(i => i.id === id);
    if (itemIndex > -1) {
      const item = newCart[itemIndex];
      // Note: hardcoding stock check purely based on the current FEATURED_PRODUCTS static data
      let maxStock = 20; // fallback max
      if (item.productTitle === 'HELMET WHITE TEE' || item.productTitle === 'تيشيرت الخوذة الأبيض') {
         if (item.size === 'S') maxStock = 4;
         if (item.size === 'M') maxStock = 5;
         if (item.size === 'L') maxStock = 6;
         if (item.size === 'XL') maxStock = 2;
         if (item.size === '2XL') maxStock = 4;
      }
      if (item.productTitle === 'POSTER WHITE TEE' || item.productTitle === 'تيشيرت البوستر الأبيض') {
         if (item.size === 'S') maxStock = 3;
         if (item.size === 'M') maxStock = 1;
         if (item.size === 'L') maxStock = 1;
         if (item.size === 'XL') maxStock = 8;
         if (item.size === '2XL') maxStock = 1;
      }
      
      const newQty = (item.quantity || 1) + delta;
      if (newQty > 0 && newQty <= maxStock) {
        newCart[itemIndex].quantity = newQty;
      } else if (newQty > maxStock) {
        // Enforce max stock
        newCart[itemIndex].quantity = maxStock;
      }
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
}), {
  name: 'midaan-storage',
  partialize: (state) => ({ cart: state.cart }),
  onRehydrateStorage: () => (state) => {
    if (state && state.cart) {
      // Normalize legacy duplicates and enforce bounds on load
      const normalizedCart = new Map();
      
      state.cart.forEach(item => {
        // Enforce valid item quantity
        let validQty = parseInt(item.quantity);
        if (isNaN(validQty) || validQty < 1) validQty = 1;
        
        // Remove known deleted items/placeholder
        // Only helmet-white-tee and poster-white-tee are valid. They cost 20.0 JOD.
        if (item.productTitle !== 'HELMET WHITE TEE' && item.productTitle !== 'تيشيرت الخوذة الأبيض' && item.productTitle !== 'POSTER WHITE TEE' && item.productTitle !== 'تيشيرت البوستر الأبيض') {
            return;
        }

        let maxStock = 20; // fallback max
        if (item.productTitle === 'HELMET WHITE TEE' || item.productTitle === 'تيشيرت الخوذة الأبيض') {
            if (item.size === 'S') maxStock = 4;
            if (item.size === 'M') maxStock = 5;
            if (item.size === 'L') maxStock = 6;
            if (item.size === 'XL') maxStock = 2;
            if (item.size === '2XL') maxStock = 4;
        }
        if (item.productTitle === 'POSTER WHITE TEE' || item.productTitle === 'تيشيرت البوستر الأبيض') {
            if (item.size === 'S') maxStock = 3;
            if (item.size === 'M') maxStock = 1;
            if (item.size === 'L') maxStock = 1;
            if (item.size === 'XL') maxStock = 8;
            if (item.size === '2XL') maxStock = 1;
        }
        
        const key = `${item.productTitle}-${item.size}`;
        if (normalizedCart.has(key)) {
            const existing = normalizedCart.get(key);
            existing.quantity = Math.min((existing.quantity || 1) + validQty, maxStock);
        } else {
            normalizedCart.set(key, { ...item, quantity: Math.min(validQty, maxStock), price: 35.0, priceUSD: 50.0 }); // force price to avoid legacy cache exploits
        }
      });
      
      state.cart = Array.from(normalizedCart.values());
    }
  },
}));
