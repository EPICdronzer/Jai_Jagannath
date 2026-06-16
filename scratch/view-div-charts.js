import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
const horoscope = data.horoscope;

console.log('--- divisional_charts keys ---');
console.log(Object.keys(horoscope.divisional_charts || {}));

if (horoscope.divisional_charts) {
  // Let's print out what a typical divisional chart object contains (e.g. for D-1 or D1 or whatever key it has)
  const firstKey = Object.keys(horoscope.divisional_charts)[0];
  console.log(`First key: "${firstKey}"`);
  console.log('Type of first value:', typeof horoscope.divisional_charts[firstKey]);
  console.log('First value:', JSON.stringify(horoscope.divisional_charts[firstKey]).slice(0, 500));
}
