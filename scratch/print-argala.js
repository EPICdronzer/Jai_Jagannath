import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
const horoscope = data.horoscope;

console.log('--- ARGALA ---');
console.log(horoscope.argala);

console.log('--- VIRODHARGALA ---');
console.log(horoscope.virodhargala);
