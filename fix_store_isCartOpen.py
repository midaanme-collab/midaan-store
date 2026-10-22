with open('src/store/index.ts', 'r') as f:
    content = f.read()

# Make sure interface has isCartOpen and setIsCartOpen
if "isCartOpen: boolean;" not in content:
    content = content.replace("  isCheckoutOpen: boolean;", "  isCartOpen: boolean;\n  setIsCartOpen: (isOpen: boolean) => void;\n  removeFromCart: (id: string) => void;\n  isCheckoutOpen: boolean;")

# Make sure store definition has isCartOpen and setIsCartOpen and removeFromCart
if "setIsCartOpen:" not in content:
    content = content.replace("  setIsCheckoutOpen: (isCheckoutOpen) => set({ isCheckoutOpen }),", "  setIsCartOpen: (isCartOpen) => set({ isCartOpen }),\n  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),\n  setIsCheckoutOpen: (isCheckoutOpen) => set({ isCheckoutOpen }),")

with open('src/store/index.ts', 'w') as f:
    f.write(content)
