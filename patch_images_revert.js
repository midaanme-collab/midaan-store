const fs = require('fs');
let code = fs.readFileSync('src/app/collab/page.tsx', 'utf8');

const imgSearch = 'images: ["/logo.png"],';
const imgReplace = 'images: ["/images/studio/tshirt-white-back.png"],';

code = code.replace(imgSearch, imgReplace);
code = code.replace(imgSearch, imgReplace);

const sotusuraSearch = '<img src="/logo.png" alt="Sotusura"';
const sotusuraReplace = '<img src="/sotusura.jpg" alt="Sotusura"'; 
code = code.replace(sotusuraSearch, sotusuraReplace);

fs.writeFileSync('src/app/collab/page.tsx', code);
