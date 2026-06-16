import React, { useState } from 'react';
import { calculateBirthData } from '../utils/astrology';
import { PRESET_CITIES } from '../utils/cities';
import { Heart, Award, Star, Users, Sparkles, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

// ─── JHora Ashtakoota Tables ─────────────────────────────────────────────────

const NAKSHATRAS = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Moola','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha',
  'Purva Bhadrapada','Uttara Bhadrapada','Revati'
];

const NAKSHATRA_LORDS = [
  'Ketu','Venus','Sun','Moon','Mars','Rahu',
  'Jupiter','Saturn','Mercury','Ketu','Venus','Sun',
  'Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
  'Ketu','Venus','Sun','Moon','Mars','Rahu',
  'Jupiter','Saturn','Mercury'
];

// Gana: Deva=0, Manushya=1, Rakshasa=2
const NAKSHATRA_GANA = [
  0,1,2,1,0,1,0,0,2,2,1,1,
  0,2,0,2,0,2,2,1,1,0,2,2,
  1,1,0
];

// Nadi: Adi=0, Madhya=1, Antya=2
const NAKSHATRA_NADI = [
  0,1,2,2,1,0,0,1,2,2,1,0,
  0,1,2,2,1,0,0,1,2,2,1,0,
  0,1,2
];

// Yoni animal for each nakshatra
const NAKSHATRA_YONI = [
  'Horse','Elephant','Sheep','Serpent','Serpent','Dog',
  'Cat','Sheep','Cat','Rat','Rat','Cow',
  'Buffalo','Tiger','Buffalo','Tiger','Deer','Deer',
  'Dog','Monkey','Mongoose','Monkey','Lion','Horse',
  'Lion','Cow','Elephant'
];

// Yoni compatibility matrix (girl x boy): 4=best, 0=worst
const YONI_MATRIX = {
  Horse:    { Horse:4,Elephant:2,Sheep:2,Serpent:3,Dog:2,Cat:2,Rat:2,Cow:1,Buffalo:0,Tiger:1,Deer:3,Monkey:3,Mongoose:2,Lion:1 },
  Elephant: { Horse:2,Elephant:4,Sheep:3,Serpent:3,Dog:2,Cat:2,Rat:1,Cow:2,Buffalo:3,Tiger:1,Deer:2,Monkey:2,Mongoose:2,Lion:0 },
  Sheep:    { Horse:2,Elephant:3,Sheep:4,Serpent:2,Dog:1,Cat:2,Rat:2,Cow:3,Buffalo:3,Tiger:0,Deer:3,Monkey:2,Mongoose:2,Lion:1 },
  Serpent:  { Horse:3,Elephant:3,Sheep:2,Serpent:4,Dog:2,Cat:1,Rat:1,Cow:2,Buffalo:2,Tiger:2,Deer:2,Monkey:0,Mongoose:0,Lion:2 },
  Dog:      { Horse:2,Elephant:2,Sheep:1,Serpent:2,Dog:4,Cat:1,Rat:2,Cow:2,Buffalo:2,Tiger:1,Deer:0,Monkey:2,Mongoose:1,Lion:1 },
  Cat:      { Horse:2,Elephant:2,Sheep:2,Serpent:1,Dog:1,Cat:4,Rat:0,Cow:2,Buffalo:2,Tiger:2,Deer:3,Monkey:2,Mongoose:1,Lion:2 },
  Rat:      { Horse:2,Elephant:1,Sheep:2,Serpent:1,Dog:2,Cat:0,Rat:4,Cow:2,Buffalo:2,Tiger:2,Deer:2,Monkey:2,Mongoose:2,Lion:2 },
  Cow:      { Horse:1,Elephant:2,Sheep:3,Serpent:2,Dog:2,Cat:2,Rat:2,Cow:4,Buffalo:3,Tiger:0,Deer:3,Monkey:2,Mongoose:2,Lion:1 },
  Buffalo:  { Horse:0,Elephant:3,Sheep:3,Serpent:2,Dog:2,Cat:2,Rat:2,Cow:3,Buffalo:4,Tiger:1,Deer:2,Monkey:2,Mongoose:2,Lion:2 },
  Tiger:    { Horse:1,Elephant:1,Sheep:0,Serpent:2,Dog:1,Cat:2,Rat:2,Cow:0,Buffalo:1,Tiger:4,Deer:1,Monkey:2,Mongoose:2,Lion:2 },
  Deer:     { Horse:3,Elephant:2,Sheep:3,Serpent:2,Dog:0,Cat:3,Rat:2,Cow:3,Buffalo:2,Tiger:1,Deer:4,Monkey:2,Mongoose:2,Lion:2 },
  Monkey:   { Horse:3,Elephant:2,Sheep:2,Serpent:0,Dog:2,Cat:2,Rat:2,Cow:2,Buffalo:2,Tiger:2,Deer:2,Monkey:4,Mongoose:2,Lion:2 },
  Mongoose: { Horse:2,Elephant:2,Sheep:2,Serpent:0,Dog:1,Cat:1,Rat:2,Cow:2,Buffalo:2,Tiger:2,Deer:2,Monkey:2,Mongoose:4,Lion:2 },
  Lion:     { Horse:1,Elephant:0,Sheep:1,Serpent:2,Dog:1,Cat:2,Rat:2,Cow:1,Buffalo:2,Tiger:2,Deer:2,Monkey:2,Mongoose:2,Lion:4 }
};

// Graha Maitri (lord friendship) 5-pt table
const PLANET_FRIENDSHIP = {
  Sun:     { Sun:5, Moon:5, Mars:5, Mercury:4, Jupiter:5, Venus:0, Saturn:0 },
  Moon:    { Sun:5, Moon:5, Mars:4, Mercury:4, Jupiter:4, Venus:4, Saturn:3 },
  Mars:    { Sun:5, Moon:4, Mars:5, Mercury:0, Jupiter:5, Venus:3, Saturn:3 },
  Mercury: { Sun:4, Moon:0, Mars:3, Mercury:5, Jupiter:3, Venus:5, Saturn:4 },
  Jupiter: { Sun:5, Moon:4, Mars:5, Mercury:0, Jupiter:5, Venus:0, Saturn:3 },
  Venus:   { Sun:0, Moon:0, Mars:3, Mercury:5, Jupiter:3, Venus:5, Saturn:5 },
  Saturn:  { Sun:0, Moon:0, Mars:0, Mercury:4, Jupiter:3, Venus:5, Saturn:5 }
};

// Rasi lords (0=Aries .. 11=Pisces)
const RASI_LORDS = [
  'Mars','Venus','Mercury','Moon','Sun','Mercury',
  'Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'
];

// Varna: Brahmin=3, Kshatriya=2, Vaishya=1, Shudra=0
const RASI_VARNA = [2,1,0,3,2,0,1,3,0,1,3,2]; // Aries=Kshatriya, Taurus=Vaishya...

// Vashya categories
function getVashya(rasiIdx) {
  if ([1,4].includes(rasiIdx)) return 'Chatushpada';  // Taurus, Leo (quad)
  if ([0].includes(rasiIdx)) return 'Chatushpada';    // Aries
  if ([2,5,6,10].includes(rasiIdx)) return 'Manava';  // Gemini, Virgo, Libra, Aquarius
  if ([3,11].includes(rasiIdx)) return 'Jalachara';   // Cancer, Pisces
  if ([7].includes(rasiIdx)) return 'Keeta';          // Scorpio
  if ([8].includes(rasiIdx)) return 'Manava';         // Sagittarius (human half)
  if ([9].includes(rasiIdx)) return 'Chatushpada';    // Capricorn
  return 'Manava';
}

// Full Ashtakoota calculation engine (JHora logic)
function calculateAshtakoota(groomMoonLong, brideMoonLong) {
  const nakSize = 360 / 27;
  const padaSize = nakSize / 4;

  const groomNakIdx = Math.floor(groomMoonLong / nakSize);
  const bridgeNakIdx = Math.floor(brideMoonLong / nakSize);
  const groomRasiIdx = Math.floor(groomMoonLong / 30);
  const brideRasiIdx = Math.floor(brideMoonLong / 30);

  const groomPada = Math.floor((groomMoonLong % nakSize) / padaSize) + 1;
  const bridePada = Math.floor((brideMoonLong % nakSize) / padaSize) + 1;

  // 1. VARNA (1 pt) — groom's varna must be >= bride's varna
  const groomVarna = RASI_VARNA[groomRasiIdx];
  const brideVarna = RASI_VARNA[brideRasiIdx];
  const varnaNames = ['Shudra','Vaishya','Kshatriya','Brahmin'];
  const varnaScore = groomVarna >= brideVarna ? 1 : 0;

  // 2. VASHYA (2 pts)
  const groomVashya = getVashya(groomRasiIdx);
  const brideVashya = getVashya(brideRasiIdx);
  let vashyaScore = 0;
  if (groomVashya === brideVashya) vashyaScore = 2;
  else if (
    (groomVashya === 'Manava' && brideVashya === 'Chatushpada') ||
    (groomVashya === 'Jalachara' && brideVashya === 'Chatushpada')
  ) vashyaScore = 1;
  else vashyaScore = 0.5;

  // 3. TARA (3 pts) — count from bride's nakshatra to groom's, divide by 9
  const distGtoB = ((groomNakIdx - bridgeNakIdx + 27) % 27) + 1;
  const distBtoG = ((bridgeNakIdx - groomNakIdx + 27) % 27) + 1;
  const taraG = distGtoB % 9 || 9;
  const taraB = distBtoG % 9 || 9;
  const badTara = [3, 5, 7]; // Vipat, Pratyari, Vadha
  let taraScore = 0;
  if (!badTara.includes(taraG) && !badTara.includes(taraB)) taraScore = 3;
  else if (!badTara.includes(taraG) || !badTara.includes(taraB)) taraScore = 1.5;
  const taraNamesMap = {1:'Janma',2:'Sampat',3:'Vipat',4:'Kshema',5:'Pratyari',6:'Sadhaka',7:'Vadha',8:'Mitra',9:'Parama Mitra'};

  // 4. YONI (4 pts)
  const groomYoni = NAKSHATRA_YONI[groomNakIdx];
  const brideYoni = NAKSHATRA_YONI[bridgeNakIdx];
  const yoniScore = YONI_MATRIX[brideYoni]?.[groomYoni] ?? 2;

  // 5. GRAHA MAITRI (5 pts)
  const groomLord = RASI_LORDS[groomRasiIdx];
  const brideLord = RASI_LORDS[brideRasiIdx];
  const maitriRaw = PLANET_FRIENDSHIP[brideLord]?.[groomLord] ?? 3;
  // Normalize to 5 pts
  const maitriScore = maitriRaw;

  // 6. GANA (6 pts)
  const groomGana = NAKSHATRA_GANA[groomNakIdx]; // 0=Deva, 1=Manushya, 2=Rakshasa
  const brideGana = NAKSHATRA_GANA[bridgeNakIdx];
  const ganaNames = ['Deva','Manushya','Rakshasa'];
  let ganaScore = 0;
  if (groomGana === brideGana) ganaScore = 6;
  else if (Math.abs(groomGana - brideGana) === 1) ganaScore = 5; // adjacent types
  else if (brideGana === 0 && groomGana === 1) ganaScore = 5;   // Deva bride + Manushya groom
  else if (brideGana === 1 && groomGana === 0) ganaScore = 5;
  else ganaScore = 0; // Rakshasa mismatch is 0

  // 7. BHAKOOT (7 pts) — Moon sign relationship
  const rDiff = ((groomRasiIdx - brideRasiIdx + 12) % 12) + 1;
  const rDiffRev = ((brideRasiIdx - groomRasiIdx + 12) % 12) + 1;
  const badBhakoot = new Set([2,12,5,9,6,8]);
  const bhakootScore = (badBhakoot.has(rDiff) || badBhakoot.has(rDiffRev)) ? 0 : 7;

  // 8. NADI (8 pts) — must be different Nadi
  const groomNadi = NAKSHATRA_NADI[groomNakIdx];
  const brideNadi = NAKSHATRA_NADI[bridgeNakIdx];
  const nadiNames = ['Adi (Vata)','Madhya (Pitta)','Antya (Kapha)'];
  const nadiScore = groomNadi !== brideNadi ? 8 : 0;

  const total = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;

  return {
    kootas: {
      varna:   { score: varnaScore,  max: 1,  groomVal: varnaNames[groomVarna],  brideVal: varnaNames[brideVarna] },
      vashya:  { score: vashyaScore, max: 2,  groomVal: groomVashya,             brideVal: brideVashya },
      tara:    { score: taraScore,   max: 3,  groomVal: `${taraNamesMap[taraG]} (${taraG})`, brideVal: `${taraNamesMap[taraB]} (${taraB})` },
      yoni:    { score: yoniScore,   max: 4,  groomVal: groomYoni,               brideVal: brideYoni },
      maitri:  { score: maitriScore, max: 5,  groomVal: groomLord,               brideVal: brideLord },
      gana:    { score: ganaScore,   max: 6,  groomVal: ganaNames[groomGana],    brideVal: ganaNames[brideGana] },
      bhakoot: { score: bhakootScore,max: 7,  groomVal: `${groomRasiIdx+1} from Bride`, brideVal: `${rDiff} from Groom` },
      nadi:    { score: nadiScore,   max: 8,  groomVal: nadiNames[groomNadi],    brideVal: nadiNames[brideNadi] }
    },
    nakshatra: {
      groom: { name: NAKSHATRAS[groomNakIdx], lord: NAKSHATRA_LORDS[groomNakIdx], pada: groomPada, yoni: groomYoni },
      bride: { name: NAKSHATRAS[bridgeNakIdx], lord: NAKSHATRA_LORDS[bridgeNakIdx], pada: bridePada, yoni: brideYoni }
    },
    total,
    doshas: detectKootaDoshas(groomNakIdx, bridgeNakIdx, groomRasiIdx, brideRasiIdx, groomNadi, brideNadi)
  };
}

// Detect major marriage doshas
function detectKootaDoshas(groomNakIdx, brideNakIdx, groomRasiIdx, brideRasiIdx, groomNadi, brideNadi) {
  const doshas = [];

  // Nadi Dosha (most severe)
  if (groomNadi === brideNadi) {
    doshas.push({ name: 'Nadi Dosha', severity: 'critical', desc: 'Same Nadi — health issues, genetic incompatibility, and progeny concerns. Major exception: Ashwini–Jyeshtha, Moola–Revati pairs.' });
  }

  // Bhakoot Dosha
  const rDiff = ((groomRasiIdx - brideRasiIdx + 12) % 12) + 1;
  const badBhakoot = [2,12,5,9,6,8];
  if (badBhakoot.includes(rDiff)) {
    doshas.push({ name: 'Bhakoot Dosha', severity: 'severe', desc: `Groom's Moon is ${rDiff} from Bride's — can indicate separation or family discord. Check Nadi and Gana for cancellation.` });
  }

  // Gana Dosha
  const groomGana = NAKSHATRA_GANA[groomNakIdx];
  const brideGana = NAKSHATRA_GANA[brideNakIdx];
  if ((groomGana === 2 && brideGana === 0) || (groomGana === 0 && brideGana === 2)) {
    doshas.push({ name: 'Gana Dosha', severity: 'moderate', desc: 'Deva & Rakshasa Gana combination — temperamental conflicts and lifestyle differences. Needs Raj Yoga or benefic aspects for cancellation.' });
  }

  // Yoni Dosha (enemy yoni)
  const groomYoni = NAKSHATRA_YONI[groomNakIdx];
  const brideYoni = NAKSHATRA_YONI[brideNakIdx];
  const yoniScore = YONI_MATRIX[brideYoni]?.[groomYoni] ?? 2;
  if (yoniScore === 0) {
    doshas.push({ name: 'Yoni Dosha (Enemy)', severity: 'moderate', desc: `${brideYoni} and ${groomYoni} are natural enemies — physical and intimate incompatibility.` });
  }

  return doshas;
}

// Darakaraka calculation: planet with lowest degree in sign = spouse significator
function getDarakaraka(planets) {
  const candidates = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
  let min = 30, dk = null;
  for (const p of candidates) {
    if (!planets[p]) continue;
    const deg = planets[p].siderealLong % 30;
    if (deg < min) { min = deg; dk = p; }
  }
  return { planet: dk, degree: min.toFixed(2) };
}

// Marriage timing periods from Dasha
function getMarriagePeriods(birthData, lagnaRasiIdx) {
  const planets = birthData.planets;
  const lord7sign = (lagnaRasiIdx + 6) % 12;
  const lord7 = RASI_LORDS[lord7sign];
  const dk = getDarakaraka(planets);
  const significators = new Set([lord7, 'Venus', 'Jupiter', dk.planet]);

  // Use the raw dasha data from the API if available
  if (birthData.raw?.graha_dashas) return null; // handled by API

  return { lord7, darakaraka: dk, significators: [...significators] };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CompatibilityView() {
  const [partnerA, setPartnerA] = useState({
    name: 'Groom',
    dateStr: '1995-05-15', timeStr: '08:30:00',
    lat: 28.6139, lon: 77.2090, timezoneOffset: 5.5,
    cityPreset: 'New Delhi, India'
  });
  const [partnerB, setPartnerB] = useState({
    name: 'Bride',
    dateStr: '1997-08-20', timeStr: '14:15:00',
    lat: 19.0760, lon: 72.8777, timezoneOffset: 5.5,
    cityPreset: 'Mumbai, India'
  });
  const [result, setResult] = useState(null);
  const [calcError, setCalcError] = useState(null);
  const [activeTab, setActiveTab] = useState('ashtakoota');

  const handleCity = (who, e) => {
    const setter = who === 'A' ? setPartnerA : setPartnerB;
    const city = PRESET_CITIES.find(c => c.name === e.target.value);
    if (city) setter(p => ({ ...p, cityPreset: e.target.value, lat: city.lat, lon: city.lon, timezoneOffset: city.timezone }));
    else setter(p => ({ ...p, cityPreset: '' }));
  };

  const handleChange = (who, e) => {
    const { name, value } = e.target;
    const setter = who === 'A' ? setPartnerA : setPartnerB;
    setter(p => ({ ...p, [name]: ['lat','lon','timezoneOffset'].includes(name) ? parseFloat(value)||0 : value }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    try {
      setCalcError(null);
      const dataA = calculateBirthData(partnerA);
      const dataB = calculateBirthData(partnerB);
      const groomMoon = dataA.planets['Moon'].siderealLong;
      const brideMoon = dataB.planets['Moon'].siderealLong;
      const milan = calculateAshtakoota(groomMoon, brideMoon);
      const groomLagna = dataA.planets['Lagna'].rasi.index;
      const brideLagna = dataB.planets['Lagna'].rasi.index;

      setResult({
        nameA: partnerA.name,
        nameB: partnerB.name,
        moonA: dataA.planets['Moon'],
        moonB: dataB.planets['Moon'],
        lagnaA: dataA.planets['Lagna'],
        lagnaB: dataB.planets['Lagna'],
        darakarakaA: getDarakaraka(dataA.planets),
        darakarakaB: getDarakaraka(dataB.planets),
        marriageA: getMarriagePeriods(dataA, groomLagna),
        marriageB: getMarriagePeriods(dataB, brideLagna),
        ...milan
      });
    } catch (err) {
      setCalcError(err.message);
    }
  };

  const getVerdict = (pts) => {
    if (pts >= 32) return { cls: 'excellent', text: 'Exceptional Match', sub: 'Highly auspicious — rarely achieved', icon: '✨', color: '#34d399' };
    if (pts >= 25) return { cls: 'excellent', text: 'Excellent Compatibility', sub: 'Very auspicious union', icon: '💚', color: '#34d399' };
    if (pts >= 18) return { cls: 'good', text: 'Good Compatibility', sub: 'Acceptable match with minor remedies', icon: '💛', color: '#f59e0b' };
    if (pts >= 12) return { cls: 'average', text: 'Average Compatibility', sub: 'Proceed with astrological guidance', icon: '🔶', color: '#f97316' };
    return { cls: 'poor', text: 'Poor Compatibility', sub: 'Strong remedial measures required', icon: '⚠️', color: '#f87171' };
  };

  const kootaInfo = {
    varna:   { name: 'Varna', fullName: 'Varna (Mindset & Ego)', max: 1, desc: 'Spiritual ego level and mental capability alignment', icon: '🧠' },
    vashya:  { name: 'Vashya', fullName: 'Vashya (Influence & Control)', max: 2, desc: 'Mutual attraction, dominance and submission dynamics', icon: '🔗' },
    tara:    { name: 'Tara', fullName: 'Tara (Destiny & Luck)', max: 3, desc: 'Interpersonal fate alignment and destined bond quality', icon: '⭐' },
    yoni:    { name: 'Yoni', fullName: 'Yoni (Biological Nature)', max: 4, desc: 'Physical, sexual and instinctive compatibility', icon: '🦋' },
    maitri:  { name: 'Maitri', fullName: 'Graha Maitri (Friendship)', max: 5, desc: 'Planetary lord friendship — mental and emotional bond', icon: '🤝' },
    gana:    { name: 'Gana', fullName: 'Gana (Temperament)', max: 6, desc: 'Deva/Manushya/Rakshasa nature — lifestyle and values', icon: '🕉️' },
    bhakoot: { name: 'Bhakoot', fullName: 'Bhakoot (Sign Relation)', max: 7, desc: 'Moon sign positional relationship — love & prosperity', icon: '🌙' },
    nadi:    { name: 'Nadi', fullName: 'Nadi (Health & Genetics)', max: 8, desc: 'Physiological and DNA compatibility — progeny health', icon: '🧬' }
  };

  return (
    <div className="card compat-card">
      <div className="card-header">
        <h3 className="card-title text-gold" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <Heart style={{ width:18, height:18, color:'#f87171', fill:'rgba(248,113,113,0.2)' }} />
          Ashtakoota Kundali Milan
        </h3>
        <span className="subtitle">Complete 36-Point JHora Marriage Compatibility Engine</span>
      </div>

      {/* Form */}
      <form onSubmit={handleCalculate}>
        <div className="compat-form-grid">
          {[['A', partnerA, 'Groom'], ['B', partnerB, 'Bride']].map(([who, partner, label]) => (
            <div key={who} className="partner-panel">
              <div className={`partner-header-${who === 'A' ? 'a' : 'b'}`} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <Users style={{ width:15, height:15 }} /> {partner.name || label}
              </div>
              <div className="partner-mini-grid">
                <div className="full-col">
                  <div className="mini-label">Name</div>
                  <input name="name" value={partner.name} onChange={e => handleChange(who, e)} className="mini-input" placeholder={label} />
                </div>
                <div>
                  <div className="mini-label">Date of Birth</div>
                  <input type="date" name="dateStr" value={partner.dateStr} onChange={e => handleChange(who, e)} className="mini-input" />
                </div>
                <div>
                  <div className="mini-label">Time of Birth</div>
                  <input type="time" step="1" name="timeStr" value={partner.timeStr} onChange={e => handleChange(who, e)} className="mini-input" />
                </div>
                <div className="full-col">
                  <div className="mini-label">City Preset</div>
                  <select value={partner.cityPreset} onChange={e => handleCity(who, e)} className="mini-input" style={{ cursor:'pointer', colorScheme:'dark' }}>
                    <option value="">-- Manual Entry --</option>
                    {PRESET_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <div className="mini-label">Latitude</div>
                  <input type="number" step="0.0001" name="lat" value={partner.lat} onChange={e => handleChange(who, e)} className="mini-input" />
                </div>
                <div>
                  <div className="mini-label">Timezone (hrs)</div>
                  <input type="number" step="0.5" name="timezoneOffset" value={partner.timezoneOffset} onChange={e => handleChange(who, e)} className="mini-input" />
                </div>
              </div>
            </div>
          ))}

          <div className="compat-submit-row">
            <button type="submit" className="btn-compat">
              <Heart style={{ width:15, height:15, fill:'currentColor' }} />
              Calculate Kundali Milan
            </button>
          </div>
        </div>
      </form>

      {calcError && (
        <div style={{ padding:'10px 14px', background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:'8px', color:'#fca5a5', fontSize:'12px', fontFamily:'JetBrains Mono, monospace' }}>
          ⚠️ {calcError}
        </div>
      )}

      {/* Results */}
      {result && (() => {
        const verdict = getVerdict(result.total);
        return (
          <div className="animate-fade-in" style={{ display:'flex', flexDirection:'column', gap:'20px', borderTop:'1px solid rgba(100,116,139,0.15)', paddingTop:'20px' }}>

            {/* Hero Score Card */}
            <div style={{
              background: `linear-gradient(135deg, rgba(10,12,22,0.95), rgba(16,18,34,0.95))`,
              border: `1px solid ${verdict.color}33`,
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              flexWrap: 'wrap',
              boxShadow: `0 0 40px ${verdict.color}15`
            }}>
              {/* Score Circle */}
              <div style={{ textAlign: 'center', minWidth: '120px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(100,116,139,0.15)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke={verdict.color}
                    strokeWidth="8"
                    strokeDasharray={`${(result.total / 36) * 327} 327`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ filter: `drop-shadow(0 0 6px ${verdict.color})` }}
                  />
                  <text x="60" y="55" textAnchor="middle" fill={verdict.color} fontSize="28" fontWeight="900" fontFamily="JetBrains Mono">
                    {Math.round(result.total * 2) / 2}
                  </text>
                  <text x="60" y="72" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="Inter">
                    / 36
                  </text>
                </svg>
              </div>

              {/* Verdict Text */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Guna Milan Result
                </div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: verdict.color, marginBottom: '4px' }}>
                  {verdict.icon} {verdict.text}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{verdict.sub}</div>

                {/* Partner Moon Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                  {[
                    { label: result.nameA, moon: result.moonA, nak: result.nakshatra.groom, color: 'var(--cyan)', dk: result.darakarakaA },
                    { label: result.nameB, moon: result.moonB, nak: result.nakshatra.bride, color: 'var(--gold)', dk: result.darakarakaB }
                  ].map((p, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>{p.label}</div>
                      <div style={{ fontWeight: 700, color: p.color }}>{p.nak.name} Pada {p.nak.pada}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Moon in {p.moon.rasi.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
                        Lord: {p.nak.lord} • Yoni: {p.nak.yoni}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'JetBrains Mono' }}>
                        Darakaraka: {p.dk.planet} ({p.dk.degree}°)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0' }}>
              {[
                { id: 'ashtakoota', label: '8 Kootas' },
                { id: 'doshas', label: `Doshas ${result.doshas.length > 0 ? `(${result.doshas.length})` : '✓'}` },
                { id: 'analysis', label: 'Analysis' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === t.id ? '2px solid var(--gold)' : '2px solid transparent',
                    color: activeTab === t.id ? 'var(--gold)' : 'var(--text-muted)',
                    fontWeight: activeTab === t.id ? 700 : 400,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'all 0.2s',
                    marginBottom: '-1px'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Ashtakoota Table */}
            {activeTab === 'ashtakoota' && (
              <div style={{ overflowX: 'auto' }}>
                <table className="astro-table" style={{ width: '100%', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', width: '40px' }}>Icon</th>
                      <th style={{ textAlign: 'left' }}>Koota</th>
                      <th style={{ textAlign: 'center', width: '60px' }}>Max</th>
                      <th style={{ textAlign: 'center', width: '80px' }}>Score</th>
                      <th>{result.nameA} (Groom)</th>
                      <th>{result.nameB} (Bride)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.kootas).map(([key, k]) => {
                      const info = kootaInfo[key];
                      const pct = k.score / k.max;
                      const color = pct === 0 ? '#f87171' : pct >= 0.75 ? '#34d399' : pct >= 0.5 ? '#f59e0b' : '#f97316';
                      return (
                        <tr key={key}>
                          <td style={{ textAlign: 'center', fontSize: '18px' }}>{info.icon}</td>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>{info.fullName}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{info.desc}</div>
                          </td>
                          <td style={{ textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>{k.max}</td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '16px', fontWeight: 900, color, fontFamily: 'JetBrains Mono' }}>{k.score}</span>
                              <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                                <div style={{ width: `${(k.score / k.max) * 100}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 600 }}>{k.groomVal}</td>
                          <td style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 600 }}>{k.brideVal}</td>
                        </tr>
                      );
                    })}
                    {/* Total row */}
                    <tr style={{ borderTop: '2px solid rgba(100,116,139,0.3)', background: 'rgba(245,158,11,0.04)' }}>
                      <td></td>
                      <td style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '14px' }}>TOTAL GUNA SCORE</td>
                      <td style={{ textAlign: 'center', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>36</td>
                      <td style={{ textAlign: 'center', fontSize: '20px', fontWeight: 900, fontFamily: 'JetBrains Mono', color: verdict.color }}>
                        {Math.round(result.total * 2) / 2}
                      </td>
                      <td colSpan={2} style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        {verdict.icon} {verdict.text} — {verdict.sub}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Doshas Tab */}
            {activeTab === 'doshas' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.doshas.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px' }}>
                    <CheckCircle2 size={32} style={{ color: '#34d399', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>No Major Doshas Detected</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Nadi, Bhakoot, and Gana are all compatible. This is an auspicious sign for a harmonious marriage.
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '8px 12px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px' }}>
                      ℹ️ Doshas can often be cancelled by Raja Yogas, lagna compatibility, or strong 7th house planets. Consult a qualified Jyotishi for remedies.
                    </div>
                    {result.doshas.map((d, i) => (
                      <div key={i} style={{
                        padding: '16px',
                        borderRadius: '10px',
                        background: d.severity === 'critical' ? 'rgba(239,68,68,0.04)' : 'rgba(249,115,22,0.04)',
                        border: `1px solid ${d.severity === 'critical' ? 'rgba(239,68,68,0.25)' : 'rgba(249,115,22,0.2)'}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, color: d.severity === 'critical' ? '#f87171' : '#f97316', fontSize: '14px' }}>
                            {d.severity === 'critical' ? '🔴' : '🟠'} {d.name}
                          </span>
                          <span style={{
                            fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase',
                            background: d.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)',
                            color: d.severity === 'critical' ? '#f87171' : '#f97316'
                          }}>
                            {d.severity}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>{d.desc}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Darakaraka Analysis */}
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} style={{ color: 'var(--gold)' }} /> Darakaraka (Spouse Significator)
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.6 }}>
                    The Darakaraka is the planet with the lowest degree in its sign in the birth chart. It represents the qualities and karma of the spouse.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: result.nameA, dk: result.darakarakaA, color: 'var(--cyan)' },
                      { label: result.nameB, dk: result.darakarakaB, color: 'var(--gold)' }
                    ].map((p, i) => (
                      <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>{p.label}'s Darakaraka</div>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: p.color }}>{p.dk.planet}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'JetBrains Mono' }}>{p.dk.degree}° in sign</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marriage Significators */}
                {result.marriageA && (
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} style={{ color: 'var(--cyan)' }} /> Marriage Dasha Significators
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.6 }}>
                      Marriage typically occurs during the dasha/antardasha of these planets: 7th Lord, Venus, Jupiter, and Darakaraka.
                    </p>
                    {[
                      { label: result.nameA, marriage: result.marriageA, color: 'var(--cyan)' },
                      { label: result.nameB, marriage: result.marriageB, color: 'var(--gold)' }
                    ].map((p, i) => (
                      p.marriage && (
                        <div key={i} style={{ marginBottom: '12px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: p.color, marginBottom: '6px' }}>{p.label}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>7th Lord:</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: p.color, fontFamily: 'JetBrains Mono' }}>{p.marriage.lord7}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>Key Periods:</span>
                            {p.marriage.significators.map(s => (
                              <span key={s} style={{
                                fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                                background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono'
                              }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '8px', background: 'rgba(6,182,212,0.05)', borderRadius: '6px', border: '1px solid rgba(6,182,212,0.1)' }}>
                      💡 Fetch high-precision API data on the main chart to see the complete Vimshottari Dasha timeline with exact marriage prediction windows.
                    </div>
                  </div>
                )}

                {/* Remedies */}
                {result.doshas.length > 0 && (
                  <div style={{ padding: '16px', background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={16} /> Suggested Remedies
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {result.doshas.some(d => d.name === 'Nadi Dosha') && (
                        <div>🔹 <strong style={{ color: 'var(--text-primary)' }}>Nadi Dosha:</strong> Mahamrityunjaya Japa (1.25 lakh), Nadi Dosha Nivarana Puja, donate clothes/food to poor on the wedding day.</div>
                      )}
                      {result.doshas.some(d => d.name === 'Bhakoot Dosha') && (
                        <div>🔹 <strong style={{ color: 'var(--text-primary)' }}>Bhakoot Dosha:</strong> Navagrah Shanti Puja, Jupiter or Venus strengthening remedies.</div>
                      )}
                      {result.doshas.some(d => d.name === 'Gana Dosha') && (
                        <div>🔹 <strong style={{ color: 'var(--text-primary)' }}>Gana Dosha:</strong> Gauri-Shankar worship, Shiva-Parvati Puja on Mondays before marriage.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
