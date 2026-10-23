const fs = require('fs');
let code = fs.readFileSync('src/app/collab/page.tsx', 'utf8');

const imgSearch = 'images: ["/images/studio/tshirt-white-back.png"],';
const imgReplace = 'images: ["/logo.png"],';

code = code.replace(imgSearch, imgReplace);
code = code.replace(imgSearch, imgReplace);

const sotusuraSearch = '<img src="/sotusura.jpg"';
const sotusuraReplace = '<img src="/logo.png"'; // Since /sotusura.jpg is not on disk yet based on ls -la public
code = code.replace(sotusuraSearch, sotusuraReplace);

fs.writeFileSync('src/app/collab/page.tsx', code);
