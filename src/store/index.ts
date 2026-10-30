import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Language, GarmentType, GarmentColor, GarmentView, GarmentSize, 
  PrintPlacement, ArtMode, PresetArt, TextColor, TextFont, CartItem, PaymentMethod
} from '@/types';
import { GOVERNORATES } from '@/constants';
import { getMaxStock, isValidCatalogProduct, normalizeSize, isHelmetProduct, isPosterProduct, migrateCart } from '@/constants/products';

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
  setTheme: () => set({ theme: 'dark' }),
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
    const normSize = normalizeSize(item.size);
    const title = item.productTitle || '';
    const maxStock = getMaxStock(title, normSize);

    // Find existing item by matching product type (helmet or poster) and normalized size
    const existingIndex = state.cart.findIndex(i => {
      const matchProduct = 
        (isHelmetProduct(i.productTitle) && isHelmetProduct(title)) ||
        (isPosterProduct(i.productTitle) && isPosterProduct(title)) ||
        (i.productTitle === title && i.garment === item.garment);
      return matchProduct && normalizeSize(i.size) === normSize;
    });
    
    if (existingIndex > -1) {
      const newCart = [...state.cart];
      const currentQty = newCart[existingIndex].quantity || 1;
      const newQty = Math.min(currentQty + (item.quantity || 1), maxStock);
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newQty,
        size: normSize,
        price: 35.0,
        priceUSD: 50.0,
      };
      return { cart: newCart };
    }
    
    // Add new item with normalized size and stock bounds
    const initialQty = Math.min(item.quantity || 1, maxStock);
    if (initialQty > 0) {
      return {
        cart: [
          ...state.cart,
          {
            ...item,
            size: normSize,
            quantity: initialQty,
            price: 35.0,
            priceUSD: 50.0,
          },
        ],
      };
    }
    return { cart: state.cart };
  }),

  updateCartQuantity: (id, delta) => set((state) => {
    const newCart = [...state.cart];
    const itemIndex = newCart.findIndex(i => i.id === id);
    if (itemIndex > -1) {
      const item = newCart[itemIndex];
      const maxStock = getMaxStock(item.productTitle || '', item.size);
      const currentQty = item.quantity || 1;
      const newQty = currentQty + delta;
      
      // Enforce lower bound of 1 (prevent below 1), and upper bound of maxStock
      if (newQty >= 1 && newQty <= maxStock) {
        newCart[itemIndex].quantity = newQty;
      } else if (newQty > maxStock) {
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
  partialize: (state) => ({ cart: state.cart, currency: state.currency, theme: 'dark' }),
  onRehydrateStorage: () => (state) => {
    if (state) {
      if (state.theme && state.theme !== 'dark') {
        state.theme = 'dark';
      }
      if (state.cart) {
        state.cart = migrateCart(state.cart);
      }
    }
  },
}));
