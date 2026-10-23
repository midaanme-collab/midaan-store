const fs = require('fs');
let code = fs.readFileSync('src/components/PageLayout.tsx', 'utf8');

const navLinksSearch = `
          <div className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest font-bold">
            <a href="#advocacy" className="hover:text-[#D80032] transition-colors">{}{strings.nav.advocacy}</a>
            <a href="#studio" className="hover:text-[#D80032] transition-colors">{}{strings.nav.studio}</a>
            <a href="#hub" className="hover:text-[#D80032] transition-colors">{}{strings.nav.dome}</a>
          </div>
`;
const navLinksReplace = `
          <div className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest font-bold">
            <a href="#advocacy" className="hover:text-[#D80032] transition-colors">{}{strings.nav.advocacy}</a>
            <a href="#studio" className="hover:text-[#D80032] transition-colors">{}{strings.nav.studio}</a>
            <a href="#hub" className="hover:text-[#D80032] transition-colors">{}{strings.nav.dome}</a>
            <a href="/collab" className="text-[#D80032] hover:text-white transition-colors border border-[#D80032]/30 px-3 py-1 rounded bg-[#D80032]/10">Collab // تعاون</a>
          </div>
`;

code = code.replace(navLinksSearch, navLinksReplace);
fs.writeFileSync('src/components/PageLayout.tsx', code);
