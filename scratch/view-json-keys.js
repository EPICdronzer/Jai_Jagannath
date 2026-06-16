import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
const horoscope = data.horoscope;

console.log('--- Divisional Charts ---');
console.log('D1 keys:', Object.keys(horoscope.divisional_charts?.D1 || {}));
if (horoscope.divisional_charts?.D1) {
  console.log('D1 Sun:', horoscope.divisional_charts.D1.Sun);
  console.log('D1 Ascendant:', horoscope.divisional_charts.D1.Ascendant);
}

console.log('--- Planetary States ---');
console.log('Planetary States keys:', Object.keys(horoscope.planetary_states || {}));
if (horoscope.planetary_states) {
  console.log('Sun state:', horoscope.planetary_states.Sun);
}

console.log('--- Ayanamsa Value ---');
console.log(horoscope.ayanamsa_value);

console.log('--- Moon Dasha details ---');
console.log('graha_dashas keys/sample:', Object.keys(horoscope.graha_dashas || {}).slice(0, 5));
