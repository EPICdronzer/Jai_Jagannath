import fs from 'fs';

const code = fs.readFileSync('scratch/jh-bundle.js', 'utf8');

// Find all URLs or API endpoints in the file
const urls = code.match(/https?:\/\/[^\s'"`]+/g);
console.log('--- URLs found ---');
console.log(urls ? [...new Set(urls)].slice(0, 30) : 'None');

// Search for any context provider or fetch functions
const fetchMatches = code.match(/fetch\([^)]+\)/g);
console.log('--- Fetch calls found ---');
console.log(fetchMatches ? [...new Set(fetchMatches)] : 'None');

// Search for words like "firebase", "backend", "api", "url", "localhost"
const keywords = ['firebase', 'supabase', 'backend', 'api', 'url', 'localhost', 'calculate', 'horoscope'];
console.log('--- Keyword checks ---');
keywords.forEach(kw => {
  const index = code.toLowerCase().indexOf(kw.toLowerCase());
  console.log(`${kw}: ${index !== -1 ? `found at character ${index}` : 'not found'}`);
});
