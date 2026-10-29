const fs = require('fs');
const https = require('https');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
}

// Minimal fonts just for PDF embedding fallback
const fonts = [
    { name: 'Alexandria-Regular.ttf', url: 'https://github.com/googlefonts/alexandria/raw/main/fonts/ttf/Alexandria-Regular.ttf' },
    { name: 'ElMessiri-Bold.ttf', url: 'https://github.com/googlefonts/elmessiri/raw/main/fonts/ttf/ElMessiri-Bold.ttf' }
];

fonts.forEach(font => {
    const dest = path.join(fontsDir, font.name);
    const file = fs.createWriteStream(dest);
    https.get(font.url, response => {
        if (response.statusCode === 302 || response.statusCode === 301) {
            https.get(response.headers.location, redirectResponse => {
                redirectResponse.pipe(file);
            });
        } else {
            response.pipe(file);
        }
    });
});
console.log('Downloading fonts to public/fonts...');
