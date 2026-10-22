with open('src/store/index.ts', 'r') as f:
    content = f.read()

import re

# Remove the duplicates at the end instead of the interface!
content = re.sub(r'  cart: \[\],\n  addToCart: \(item\) => set\(\(state\) => \(\{ cart: \[\.\.\.state.cart, item\] \}\)\),\n', '', content)
# Ensure we leave one version of cart in the zustand definition

with open('src/store/index.ts', 'w') as f:
    f.write(content)
