import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
const horoscope = data.horoscope;

if (horoscope.yogas && horoscope.yogas.yoga_list) {
  const keys = Object.keys(horoscope.yogas.yoga_list);
  console.log('yoga_list keys sample:', keys.slice(0, 5));
  console.log('first yoga detail:', horoscope.yogas.yoga_list[keys[0]]);
}
if (horoscope.yogas && horoscope.yogas.raja_yoga_list) {
  const keys = Object.keys(horoscope.yogas.raja_yoga_list);
  console.log('raja_yoga_list keys sample:', keys.slice(0, 5));
}
