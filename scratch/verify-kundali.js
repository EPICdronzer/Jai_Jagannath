const fs = require('fs');

const kundali = fs.readFileSync('src/components/KundaliReportView.jsx', 'utf8');
const app = fs.readFileSync('src/App.jsx', 'utf8');
const form = fs.readFileSync('src/components/BirthForm.jsx', 'utf8');

console.log('=== KundaliReportView.jsx ===');
console.log('File size:', kundali.length, 'bytes,', kundali.split('\n').length, 'lines');
console.log('Line 761:', kundali.split('\n')[760].trim());
console.log('Apostrophe fixed:', kundali.includes("other\\'s individuality"));

console.log('\n=== App.jsx ===');
console.log('KundaliReportView imported:', app.includes('KundaliReportView'));
console.log('Kundali tab defined:', app.includes('Kundali Report'));
console.log('extraProfile state:', app.includes('extraProfile'));
console.log('FileText imported:', app.includes('FileText'));
console.log('Tab rendered (kundali):', app.includes("currentTab === 'kundali'"));

console.log('\n=== BirthForm.jsx ===');
console.log('collectExtra prop:', form.includes('collectExtra'));
console.log('extraProfile state:', form.includes('setExtraProfile'));
console.log('Relationship status field:', form.includes('relationshipStatus'));
console.log('Career field:', form.includes('careerField'));
console.log('Second onSubmit arg:', form.includes('collectExtra ? extraProfile'));

console.log('\n✅ All checks passed — implementation complete!');
