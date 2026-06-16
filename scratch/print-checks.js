import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
const horoscope = data.horoscope;

if (horoscope.longevity_prediction) {
  console.log('Sample check:', horoscope.longevity_prediction.baladrishta_checks.checks[0]);
}
