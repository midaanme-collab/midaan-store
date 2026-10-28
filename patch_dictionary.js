const fs = require('fs');

let content = fs.readFileSync('src/locales/dictionary.ts', 'utf8');

// The instruction is to translate "BAG" product actions to "أضف إلى الحقيبة" in Arabic and "Add to Bag" in English.
// We also need to fix occurrences of "Midan Collective" in footer to "Midaan Collective"
// and "Midan Mag" / "Midan Magazine" to "Midaan Magazine"

content = content.replaceAll("Midan Collective", "Midaan Collective");
content = content.replaceAll("Midan Magazine", "Midaan Magazine");
content = content.replaceAll("Midan Mag", "Midaan Magazine");
content = content.replaceAll("Midan Studio", "Midaan Studio");
content = content.replaceAll("Midan Graphics", "Midaan Graphics");

// Ensure "cart" translations are correct
const searchArCart = `cart: "أضف إلى الحقيبة"`;
// Make sure we have the correct replacement if it's there
content = content.replace(`cart: "Bag",`, `cart: "Add to Bag",`);

// Voice Section Heading (Arabic)
const searchVoiceAr = `voiceSectionTitle: "3. صوت ميدان: الإعلام المستقل والفنون (The Voice)",`;
const replaceVoiceAr = `voiceSectionTitle: "صوت ميدان: المجلة",`;

content = content.replace(searchVoiceAr, replaceVoiceAr);

fs.writeFileSync('src/locales/dictionary.ts', content, 'utf8');
