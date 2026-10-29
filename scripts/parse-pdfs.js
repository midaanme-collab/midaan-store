const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const dir = path.join(__dirname, '..', 'content', 'magazine-sources');

async function parseAll() {
    if (!fs.existsSync(dir)) {
        console.log("No magazine-sources directory found.");
        return;
    }
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));
    
    for (const file of files) {
        console.log(`\n--- File: ${file} ---`);
        const dataBuffer = fs.readFileSync(path.join(dir, file));
        try {
            const data = await pdf(dataBuffer);
            console.log(`Pages: ${data.numpages}`);
            console.log(`Text Preview: ${data.text.substring(0, 500).replace(/\n/g, ' ')}...`);
        } catch (e) {
            console.error(`Error parsing ${file}: ${e.message}`);
        }
    }
}

parseAll();
