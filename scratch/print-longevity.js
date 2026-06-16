import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
const horoscope = data.horoscope;

console.log('--- LONGEVITY PREDICTION ---');
console.log(horoscope.longevity_prediction);
