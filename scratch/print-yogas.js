import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
const horoscope = data.horoscope;

console.log('--- YOGAS ---');
console.log('Keys in yogas:', Object.keys(horoscope.yogas || {}));
if (horoscope.yogas) {
  // Let's print out what a typical yoga object contains
  const firstKey = Object.keys(horoscope.yogas)[0];
  console.log(`First key: "${firstKey}"`);
  console.log('Value:', horoscope.yogas[firstKey]);
}

console.log('--- DOSHAS ---');
console.log('Keys in doshas:', Object.keys(horoscope.doshas || {}));
if (horoscope.doshas) {
  const firstKey = Object.keys(horoscope.doshas)[0];
  console.log(`First key: "${firstKey}"`);
  console.log('Value:', horoscope.doshas[firstKey]);
}
