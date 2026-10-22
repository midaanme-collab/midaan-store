with open('src/store/index.ts', 'r') as f:
    content = f.read()

# Make sure interface has cart and addToCart
if "cart: CartItem[];" not in content:
    content = content.replace("isCartOpen: boolean;", "isCartOpen: boolean;\n  cart: CartItem[];\n  addToCart: (item: CartItem) => void;")

# Make sure store definition has cart and addToCart
if "cart: []," not in content:
    content = content.replace("setIsCartOpen: (isCartOpen) => set({ isCartOpen }),", "cart: [],\n  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),\n  setIsCartOpen: (isCartOpen) => set({ isCartOpen }),")

with open('src/store/index.ts', 'w') as f:
    f.write(content)

# Fix missing properties in Studio.tsx
with open('src/components/Studio.tsx', 'r') as f:
    studio_content = f.read()

studio_content = studio_content.replace("{strings.studio.placementCenter || 'Center Heavy'}", "{'Center Heavy'}")
studio_content = studio_content.replace("{strings.studio.placementSmall || 'Pocket Stamp'}", "{'Pocket Stamp'}")

with open('src/components/Studio.tsx', 'w') as f:
    f.write(studio_content)
