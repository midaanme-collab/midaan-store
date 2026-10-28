const fs = require('fs');

let content = fs.readFileSync('src/components/MidaanLogo.tsx', 'utf8');

const search = `  const heightClass = size === "sm" ? "h-6" : size === "lg" ? "h-12" : size === "xl" ? "h-20" : "h-9";`;
const replace = `  const heightClass = size === "sm" ? "h-12 md:h-16" : size === "lg" ? "h-20 md:h-24" : size === "xl" ? "h-32 md:h-40" : "h-16 md:h-20";`;

content = content.replace(search, replace);
fs.writeFileSync('src/components/MidaanLogo.tsx', content, 'utf8');
