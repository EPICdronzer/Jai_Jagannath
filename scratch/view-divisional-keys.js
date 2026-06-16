import fs from 'fs';
const data = JSON.parse(fs.readFileSync('scratch/poornima-charts.json', 'utf8'));
console.log('--- Divisional Charts Keys in API Response ---');
console.log(Object.keys(data));
