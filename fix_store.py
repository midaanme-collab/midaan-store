with open('src/store/index.ts', 'r') as f:
    content = f.read()

# Fix duplicates in StoreState interface
content = content.replace("  isCartOpen: boolean;\n  cart: CartItem[];\n  addToCart: (item: CartItem) => void;", "  isCartOpen: boolean;")
with open('src/store/index.ts', 'w') as f:
    f.write(content)
