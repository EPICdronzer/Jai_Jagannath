import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
const horoscope = data.horoscope;

console.log('--- ASHTAKAVARGA KEYS ---');
console.log(Object.keys(horoscope.ashtakavarga || {}));

if (horoscope.ashtakavarga) {
  console.log('samudhaya_ashtaka_varga:', horoscope.ashtakavarga.samudhaya_ashtaka_varga);
  console.log('binna_ashtaka_varga sample:', JSON.stringify(horoscope.ashtakavarga.binna_ashtaka_varga).slice(0, 500));
  console.log('sodhya_pindas:', horoscope.ashtakavarga.sodhya_pindas);
}
