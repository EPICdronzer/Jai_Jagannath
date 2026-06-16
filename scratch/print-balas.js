import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
const horoscope = data.horoscope;

console.log('--- SHADBALA ---');
console.log(horoscope.shad_bala);

console.log('--- BHAVA BALA ---');
console.log(horoscope.bhava_bala);
