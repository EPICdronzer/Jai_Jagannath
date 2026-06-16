import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/horoscope-response.json', 'utf8'));
console.log('--- birth_details ---');
console.log(data.birth_details);
console.log('--- horoscope keys ---');
if (data.horoscope) {
  console.log(Object.keys(data.horoscope));
}
