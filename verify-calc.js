import { calculateBirthData } from './src/utils/astrology.js';

const params = {
  dateStr: '2026-06-15',
  timeStr: '17:30:00',
  lat: 19.8135,
  lon: 85.8312,
  timezoneOffset: 5.5
};

const result = calculateBirthData(params);
console.log('--- Planetary Positions ---');
for (const p of Object.keys(result.planets)) {
  const info = result.planets[p];
  console.log(`${p}: ${info.rasi.name} ${Math.floor(info.rasi.deg)}° ${Math.floor((info.rasi.deg % 1) * 60)}' ${Math.floor(((info.rasi.deg % 1) * 60 % 1) * 60)}", Nak: ${info.nakshatra.name} P${info.nakshatra.pada} (${info.nakshatra.lord})`);
}

console.log('--- Panchangam ---');
console.log('Tithi:', result.panchang.tithi);
console.log('Vara:', result.panchang.vara);
console.log('Nakshatra:', result.panchang.nakshatra);
console.log('Yoga:', result.panchang.yoga);
console.log('Karana:', result.panchang.karana);
