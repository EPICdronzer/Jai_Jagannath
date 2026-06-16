import fs from 'fs';

const code = fs.readFileSync('scratch/jh-bundle.js', 'utf8');

// We want to find "const nI" or "function nI" or "nI =" or simply "nI" definition.
// Let's search for "nI" definition in the code.
const regex = /\b(const\s+nI\s*=|\bfunction\s+nI\b|nI\s*=)/g;
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
