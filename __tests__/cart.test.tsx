import { CartItem } from '../src/types';
import { useStore } from '../src/store';
import { migrateCart, formatArabicJod } from '../src/constants/products';

describe('Cart Store Hydration and Normalization', () => {
  beforeEach(() => {
    useStore.setState({ cart: [] });
  });

  it('adds an item to the cart', () => {
    const item = {
        id: '1',
        productTitle: 'HELMET WHITE TEE',
        size: 'L',
        garment: 'tshirt',
        price: 35,
        priceUSD: 50,
        quantity: 1,
        color: 'offwhite',
        placement: 'back',
        artMode: 'presets'
    } as CartItem;
    
    useStore.getState().addToCart(item);
    expect(useStore.getState().cart.length).toBe(1);
    expect(useStore.getState().cart[0].quantity).toBe(1);
    
    // Add same item again, should merge and respect max stock of 6 for L
    useStore.getState().addToCart(item);
    expect(useStore.getState().cart.length).toBe(1);
    expect(useStore.getState().cart[0].quantity).toBe(2);
    
    // Add 5 more to hit the max limit of 6
    useStore.getState().addToCart(item);
    useStore.getState().addToCart(item);
    useStore.getState().addToCart(item);
    useStore.getState().addToCart(item);
    useStore.getState().addToCart(item);
    
    expect(useStore.getState().cart[0].quantity).toBe(6);
  });
  
  it('prevents quantities below 1', () => {
    const item = {
        id: '2',
        productTitle: 'POSTER WHITE TEE',
        size: 'S',
        garment: 'tshirt',
        price: 35,
        priceUSD: 50,
        quantity: 1,
        color: 'offwhite',
        placement: 'back',
        artMode: 'presets'
    } as CartItem;
    
    useStore.getState().addToCart(item);
    // Try to decrement below 1
    useStore.getState().updateCartQuantity('2', -1);
    
    // quantity should remain 1 because it prevents reducing below 1
    expect(useStore.getState().cart[0].quantity).toBe(1);
  });
  
  it('differentiates by size', () => {
    const itemS = {
        id: '1',
        productTitle: 'HELMET WHITE TEE',
        size: 'S',
        garment: 'tshirt',
        price: 35,
        priceUSD: 50,
        quantity: 1,
        color: 'offwhite',
        placement: 'back',
        artMode: 'presets'
    } as CartItem;
    
    const itemM = {
        id: '2',
        productTitle: 'HELMET WHITE TEE',
        size: 'M',
        garment: 'tshirt',
        price: 35,
        priceUSD: 50,
        quantity: 1,
        color: 'offwhite',
        placement: 'back',
        artMode: 'presets'
    } as CartItem;
    
    useStore.getState().addToCart(itemS);
    useStore.getState().addToCart(itemM);
    
    expect(useStore.getState().cart.length).toBe(2);
  });

  it('normalizes XXL to 2XL and respects 2XL inventory', () => {
    const itemXXL = {
      id: 'drop-helmet-white-2XL',
      productTitle: 'تيشيرت خوذة الكوفية — الإصدار الأبيض',
      size: 'XXL',
      garment: 'tshirt',
      price: 35,
      priceUSD: 50,
      quantity: 1,
      color: 'offwhite',
      placement: 'back',
      artMode: 'presets',
      isPrePrinted: true,
    } as CartItem;

    useStore.getState().addToCart(itemXXL);
    expect(useStore.getState().cart[0].size).toBe('2XL');
    expect(useStore.getState().cart[0].price).toBe(35);
    expect(useStore.getState().cart[0].priceUSD).toBe(50);
  });

  it('migrates legacy cart payload: maps drop-helmet-05 and drop-poster-06, normalizes XXL/2XL, merges duplicates, and enforces inventory caps', () => {
    const legacyCartPayload = [
      {
        id: 'drop-helmet-05',
        productId: 'drop-helmet-05',
        productTitle: 'خوذة الكوفية - إصدار سابق',
        size: 'XXL', // legacy size
        quantity: 3,
        garment: 'tshirt',
        price: 32,
      },
      {
        id: 'drop-helmet-white-2XL',
        productId: 'drop-helmet-white',
        productTitle: 'تيشيرت خوذة الكوفية — الإصدار الأبيض',
        size: '2XL',
        quantity: 3, // 3 + 3 = 6, but max stock for Helmet 2XL is 4!
        garment: 'tshirt',
        price: 35,
      },
      {
        id: 'drop-poster-06',
        productId: 'drop-poster-06',
        productTitle: 'بوستر فلسطين القديم',
        size: 'XL',
        quantity: 2,
        garment: 'tshirt',
        price: 30,
      },
      {
        id: 'drop-hoodie-retired-01',
        productId: 'drop-hoodie-retired-01',
        productTitle: 'هودي قديم متقاعد',
        size: 'L',
        quantity: 1,
        garment: 'hoodie',
        price: 45,
      },
    ];

    const migrated = migrateCart(legacyCartPayload);

    // 1. Retired hoodie must be discarded
    expect(migrated.some(i => i.id.includes('hoodie'))).toBe(false);

    // 2. Exactly 2 unique items remaining (Helmet 2XL and Poster XL)
    expect(migrated.length).toBe(2);

    // 3. Verify Helmet item: legacy drop-helmet-05 mapped and merged with 2XL
    const helmetItem = migrated.find(i => i.id === 'drop-helmet-white-2XL');
    expect(helmetItem).toBeDefined();
    expect(helmetItem?.size).toBe('2XL');
    expect(helmetItem?.price).toBe(35);
    expect(helmetItem?.priceUSD).toBe(50);
    // Quantity capped at max stock (4) instead of 6
    expect(helmetItem?.quantity).toBe(4);

    // 4. Verify Poster item: legacy drop-poster-06 mapped to drop-poster-white
    const posterItem = migrated.find(i => i.id === 'drop-poster-white-XL');
    expect(posterItem).toBeDefined();
    expect(posterItem?.size).toBe('XL');
    expect(posterItem?.price).toBe(35);
    expect(posterItem?.priceUSD).toBe(50);
    expect(posterItem?.quantity).toBe(2);
  });

  it('formats Arabic JOD amounts consistently with Eastern Arabic numerals and Arabic comma', () => {
    // Exact user requirement: For one shirt delivered to Amman: 35, 2.50, and 37.50
    expect(formatArabicJod(35)).toBe('٣٥ د.أ');
    expect(formatArabicJod(2.5)).toBe('٢٫٥٠ د.أ');
    expect(formatArabicJod(37.5)).toBe('٣٧٫٥٠ د.أ');
  });
});
