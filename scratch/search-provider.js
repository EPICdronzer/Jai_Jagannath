import fs from 'fs';

const code = fs.readFileSync('scratch/jh-bundle.js', 'utf8');

// Find all matches for jagannathaHoraData
const regex = /jagannathaHoraData/gi;
let match;
const matches = [];
while ((match = regex.exec(code)) !== null) {
  const start = Math.max(0, match.index - 300);
  const end = Math.min(code.length, match.index + 300);
  matches.push(code.substring(start, end));
}

console.log(`Found ${matches.length} occurrences:`);
matches.forEach((m, idx) => {
  console.log(`\n--- Occurrence ${idx + 1} ---`);
  console.log(m);
});
