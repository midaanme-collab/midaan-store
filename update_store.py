import re

with open('src/store/index.ts', 'r') as f:
    store = f.read()

store = store.replace("lang: Language;", "lang: Language;\n  theme: 'dark' | 'light';\n  setTheme: (theme: 'dark' | 'light') => void;")
store = store.replace("lang: 'ar',", "lang: 'ar',\n  theme: 'dark',\n  setTheme: (theme) => set({ theme }),")
store = store.replace("isCartOpen: boolean;", "isCartOpen: boolean;\n  cart: CartItem[];\n  addToCart: (item: CartItem) => void;")

with open('src/store/index.ts', 'w') as f:
    f.write(store)
