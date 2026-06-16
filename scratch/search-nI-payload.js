import fs from 'fs';

const code = fs.readFileSync('scratch/jh-bundle.js', 'utf8');

// Find nI and print 1500 characters after it to see the API endpoint path and body
const index = code.indexOf('async function nI(');
if (index !== -1) {
  console.log('--- nI Implementation ---');
  console.log(code.substring(index, index + 3000));
} else {
  console.log('nI not found');
}
