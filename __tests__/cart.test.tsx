import { CartItem } from '../src/types';
import { useStore } from '../src/store';

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
});
