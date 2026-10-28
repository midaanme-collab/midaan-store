const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

const searchDesc = `<p className="max-w-2xl mx-auto text-neutral-400 text-sm md:text-base leading-relaxed mb-10 font-sans">
        {strings.heroDesc}
      </p>`;
      
const replaceDesc = `<p className="max-w-2xl mx-auto text-neutral-400 text-sm md:text-base leading-relaxed mb-10 font-sans">
        {lang === 'ar' ? 'اكتشف أرشيف التعاون وتصفح العدد صفر من المجلة المستقلة.' : 'Discover the collaboration archive and read Issue Zero of our independent magazine.'}
      </p>`;

content = content.replace(searchDesc, replaceDesc);
fs.writeFileSync('src/components/Hero.tsx', content, 'utf8');
