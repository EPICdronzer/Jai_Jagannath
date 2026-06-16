import * as Astronomy from 'astronomy-engine';

// --- Astrological Constants ---

export const ZODIAC_SIGNS = [
  { name: 'Aries', ruler: 'Mars', symbol: '♈', hindi: 'Mesha', element: 'Fire', nature: 'Movable' },
  { name: 'Taurus', ruler: 'Venus', symbol: '♉', hindi: 'Vrishabha', element: 'Earth', nature: 'Fixed' },
  { name: 'Gemini', ruler: 'Mercury', symbol: '♊', hindi: 'Mithuna', element: 'Air', nature: 'Dual' },
  { name: 'Cancer', ruler: 'Moon', symbol: '♋', hindi: 'Karka', element: 'Water', nature: 'Movable' },
  { name: 'Leo', ruler: 'Sun', symbol: '♌', hindi: 'Simha', element: 'Fire', nature: 'Fixed' },
  { name: 'Virgo', ruler: 'Mercury', symbol: '♍', hindi: 'Kanya', element: 'Earth', nature: 'Dual' },
  { name: 'Libra', ruler: 'Venus', symbol: '♎', hindi: 'Tula', element: 'Air', nature: 'Movable' },
  { name: 'Scorpio', ruler: 'Mars', symbol: '♏', hindi: 'Vrishchika', element: 'Water', nature: 'Fixed' },
  { name: 'Sagittarius', ruler: 'Jupiter', symbol: '♐', hindi: 'Dhanu', element: 'Fire', nature: 'Dual' },
  { name: 'Capricorn', ruler: 'Saturn', symbol: '♑', hindi: 'Makara', element: 'Earth', nature: 'Movable' },
  { name: 'Aquarius', ruler: 'Saturn', symbol: '♒', hindi: 'Kumbha', element: 'Air', nature: 'Fixed' },
  { name: 'Pisces', ruler: 'Jupiter', symbol: '♓', hindi: 'Meena', element: 'Water', nature: 'Dual' }
];

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', gana: 'Deva', animal: 'Horse', nadi: 'Adi' },
  { name: 'Bharani', lord: 'Venus', gana: 'Manushya', animal: 'Elephant', nadi: 'Madhya' },
  { name: 'Krittika', lord: 'Sun', gana: 'Rakshasa', animal: 'Sheep', nadi: 'Antya' },
  { name: 'Rohini', lord: 'Moon', gana: 'Manushya', animal: 'Serpent', nadi: 'Antya' },
  { name: 'Mrigashira', lord: 'Mars', gana: 'Deva', animal: 'Serpent', nadi: 'Madhya' },
  { name: 'Ardra', lord: 'Rahu', gana: 'Manushya', animal: 'Dog', nadi: 'Adi' },
  { name: 'Punarvasu', lord: 'Jupiter', gana: 'Deva', animal: 'Cat', nadi: 'Adi' },
  { name: 'Pushya', lord: 'Saturn', gana: 'Deva', animal: 'Sheep', nadi: 'Madhya' },
  { name: 'Ashlesha', lord: 'Mercury', gana: 'Rakshasa', animal: 'Cat', nadi: 'Antya' },
  { name: 'Magha', lord: 'Ketu', gana: 'Rakshasa', animal: 'Rat', nadi: 'Antya' },
  { name: 'Purva Phalguni', lord: 'Venus', gana: 'Manushya', animal: 'Rat', nadi: 'Madhya' },
  { name: 'Uttara Phalguni', lord: 'Sun', gana: 'Manushya', animal: 'Cow', nadi: 'Adi' },
  { name: 'Hasta', lord: 'Moon', gana: 'Deva', animal: 'Buffalo', nadi: 'Adi' },
  { name: 'Chitra', lord: 'Mars', gana: 'Rakshasa', animal: 'Tiger', nadi: 'Madhya' },
  { name: 'Swati', lord: 'Rahu', gana: 'Deva', animal: 'Buffalo', nadi: 'Antya' },
  { name: 'Vishakha', lord: 'Jupiter', gana: 'Rakshasa', animal: 'Tiger', nadi: 'Antya' },
  { name: 'Anuradha', lord: 'Saturn', gana: 'Deva', animal: 'Deer', nadi: 'Madhya' },
  { name: 'Jyeshtha', lord: 'Mercury', gana: 'Rakshasa', animal: 'Deer', nadi: 'Adi' },
  { name: 'Moola', lord: 'Ketu', gana: 'Rakshasa', animal: 'Dog', nadi: 'Adi' },
  { name: 'Purva Ashadha', lord: 'Venus', gana: 'Manushya', animal: 'Monkey', nadi: 'Madhya' },
  { name: 'Uttara Ashadha', lord: 'Sun', gana: 'Manushya', animal: 'Mongoose', nadi: 'Antya' },
  { name: 'Shravana', lord: 'Moon', gana: 'Deva', animal: 'Monkey', nadi: 'Antya' },
  { name: 'Dhanishta', lord: 'Mars', gana: 'Rakshasa', animal: 'Lion', nadi: 'Madhya' },
  { name: 'Shatabhisha', lord: 'Rahu', gana: 'Rakshasa', animal: 'Horse', nadi: 'Adi' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', gana: 'Manushya', animal: 'Lion', nadi: 'Adi' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', gana: 'Manushya', animal: 'Cow', nadi: 'Madhya' },
  { name: 'Revati', lord: 'Mercury', gana: 'Deva', animal: 'Elephant', nadi: 'Antya' }
];

export const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export const DASHA_DURATIONS = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

// --- Basic Calculations ---

export function getJulianCenturies(astroTime) {
  return astroTime.ut / 36525;
}

export function getAyanamsa(astroTime) {
  const T = getJulianCenturies(astroTime);
  // Lahiri Ayanamsa calculation
  return 23.858083 + 1.39697128 * T + 0.00030878 * T * T;
}

export function getRasiInfo(long) {
  const deg = (long + 360) % 360;
  const index = Math.floor(deg / 30);
  const degInRasi = deg % 30;
  return {
    index,
    ...ZODIAC_SIGNS[index],
    deg: degInRasi
  };
}

export function getNakshatraInfo(long) {
  const deg = (long + 360) % 360;
  const nakLen = 360 / 27; // 13.333333 deg
  const index = Math.floor(deg / nakLen);
  const elapsed = deg % nakLen;
  const pada = Math.floor(elapsed / (nakLen / 4)) + 1;
  return {
    index,
    ...NAKSHATRAS[index],
    pada,
    elapsedPercent: elapsed / nakLen
  };
}

// Convert absolute Sidereal Longitude to Rasi Deg Min Sec string
export function formatLongitude(long) {
  const info = getRasiInfo(long);
  const totalSec = Math.round(info.deg * 3600);
  const d = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${d}° ${m}' ${s}" in ${info.name}`;
}

// Calculate retrograde state by evaluating longitude rate of change
function checkRetrograde(body, astroTime, date) {
  if (body === 'Rahu' || body === 'Ketu') return true; // Rahu/Ketu mean nodes are retrograde
  
  const dt = 0.05; // 1.2 hours
  const dateBefore = new Date(date.getTime() - dt * 24 * 60 * 60 * 1000);
  const dateAfter = new Date(date.getTime() + dt * 24 * 60 * 60 * 1000);
  
  const tBefore = Astronomy.MakeTime(dateBefore);
  const tAfter = Astronomy.MakeTime(dateAfter);
  
  const vBefore = Astronomy.GeoVector(body, tBefore, true);
  const eBefore = Astronomy.Ecliptic(vBefore);
  
  const vAfter = Astronomy.GeoVector(body, tAfter, true);
  const eAfter = Astronomy.Ecliptic(vAfter);
  
  let diff = eAfter.elon - eBefore.elon;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  return diff < 0;
}

// --- Main Astrological Calculation Engine ---

export function calculateBirthData({ dateStr, timeStr, lat, lon, timezoneOffset }) {
  // 1. Construct UTC birth date
  // dateStr is 'YYYY-MM-DD', timeStr is 'HH:MM:SS'
  // timezoneOffset is in hours (e.g. +5.5 for IST). We subtract it to get UTC.
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute, second] = timeStr.split(':').map(Number);
  
  // Calculate UTC time in a timezone-independent manner
  const utcTimeMs = Date.UTC(year, month - 1, day, hour, minute, second) - timezoneOffset * 60 * 60 * 1000;
  const utcDate = new Date(utcTimeMs);
  
  const astroTime = Astronomy.MakeTime(utcDate);
  const ayanamsa = getAyanamsa(astroTime);
  const T = getJulianCenturies(astroTime);

  // 2. Planets Calculations
  const planetsList = [
    { name: 'Sun', key: Astronomy.Body.Sun },
    { name: 'Moon', key: Astronomy.Body.Moon },
    { name: 'Mars', key: Astronomy.Body.Mars },
    { name: 'Mercury', key: Astronomy.Body.Mercury },
    { name: 'Jupiter', key: Astronomy.Body.Jupiter },
    { name: 'Venus', key: Astronomy.Body.Venus },
    { name: 'Saturn', key: Astronomy.Body.Saturn },
    { name: 'Uranus', key: Astronomy.Body.Uranus },
    { name: 'Neptune', key: Astronomy.Body.Neptune },
    { name: 'Pluto', key: Astronomy.Body.Pluto }
  ];

  const planetsData = {};

  for (const p of planetsList) {
    let tropicalLong, tropicalLat;
    if (p.name === 'Moon') {
      const mSph = Astronomy.EclipticGeoMoon(astroTime);
      tropicalLong = mSph.lon;
      tropicalLat = mSph.lat;
    } else {
      const gv = Astronomy.GeoVector(p.key, astroTime, true);
      const eclip = Astronomy.Ecliptic(gv);
      tropicalLong = eclip.elon;
      tropicalLat = eclip.elat;
    }

    const siderealLong = (tropicalLong - ayanamsa + 360) % 360;
    const rasiInfo = getRasiInfo(siderealLong);
    const naksInfo = getNakshatraInfo(siderealLong);
    const isRetro = checkRetrograde(p.key, astroTime, utcDate);

    planetsData[p.name] = {
      name: p.name,
      tropicalLong,
      siderealLong,
      latitude: tropicalLat,
      rasi: rasiInfo,
      nakshatra: naksInfo,
      isRetrograde: isRetro
    };
  }

  // 3. Rahu and Ketu Calculations (Mean Nodes)
  const T_centuries = astroTime.ut / 36525;
  const omega = 125.0445550 - 1934.1361849 * T_centuries + 0.0020762 * T_centuries * T_centuries + (T_centuries * T_centuries * T_centuries) / 467410 - (T_centuries * T_centuries * T_centuries * T_centuries) / 18999000;
  const rahuTropical = ((omega % 360) + 360) % 360;
  const rahuSidereal = (rahuTropical - ayanamsa + 360) % 360;
  
  const ketuSidereal = (rahuSidereal + 180) % 360;
  const ketuTropical = (rahuTropical + 180) % 360;

  planetsData['Rahu'] = {
    name: 'Rahu',
    tropicalLong: rahuTropical,
    siderealLong: rahuSidereal,
    latitude: 0,
    rasi: getRasiInfo(rahuSidereal),
    nakshatra: getNakshatraInfo(rahuSidereal),
    isRetrograde: true
  };

  planetsData['Ketu'] = {
    name: 'Ketu',
    tropicalLong: ketuTropical,
    siderealLong: ketuSidereal,
    latitude: 0,
    rasi: getRasiInfo(ketuSidereal),
    nakshatra: getNakshatraInfo(ketuSidereal),
    isRetrograde: true
  };

  // 4. Calculate Ascendant (Lagna)
  const ut_days = astroTime.ut;
  const gmst = (280.46061837 + 360.98564736629 * ut_days + 0.000387933 * T * T - (T * T * T) / 38710000) % 360;
  const normalized_gmst = (gmst + 360) % 360;
  const lmst = (normalized_gmst + lon + 360) % 360;

  const theta_L = (lmst * Math.PI) / 180;
  const eps = (23.4392911 - 0.0130041667 * T - 0.00000016389 * T * T + 0.0000005036 * T * T * T) * Math.PI / 180;
  const phi = (lat * Math.PI) / 180;

  const y = Math.cos(theta_L);
  const x = -Math.sin(theta_L) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
  let lagnaTropical = Math.atan2(y, x) * 180 / Math.PI;
  lagnaTropical = (lagnaTropical + 360) % 360;
  const lagnaSidereal = (lagnaTropical - ayanamsa + 360) % 360;

  planetsData['Lagna'] = {
    name: 'Lagna',
    tropicalLong: lagnaTropical,
    siderealLong: lagnaSidereal,
    latitude: 0,
    rasi: getRasiInfo(lagnaSidereal),
    nakshatra: getNakshatraInfo(lagnaSidereal),
    isRetrograde: false
  };

  // 5. Panchang calculations
  const tithiInfo = getTithi(planetsData['Sun'].tropicalLong, planetsData['Moon'].tropicalLong);
  const localDateForVara = new Date(utcTimeMs + timezoneOffset * 60 * 60 * 1000);
  const dayIdx = localDateForVara.getUTCDay();
  const vara = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIdx];
  
  // Yoga
  let sumYoga = (planetsData['Sun'].siderealLong + planetsData['Moon'].siderealLong) % 360;
  const yogaNames = [
    'Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 
    'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 
    'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 
    'Brahma', 'Indra', 'Vaidhriti'
  ];
  const yogaIdx = Math.floor(sumYoga / (360 / 27));
  const yoga = yogaNames[yogaIdx % 27];

  // Karana
  const diffMoonSun = (planetsData['Moon'].tropicalLong - planetsData['Sun'].tropicalLong + 360) % 360;
  const karanaNames = [
    'Kinstughna', 'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Shakuni', 'Chatushpada', 'Naga'
  ];
  const karanaIdx = Math.floor(diffMoonSun / 6);
  const karana = karanaNames[karanaIdx] || 'Unknown';

  const panchang = {
    tithi: tithiInfo,
    vara,
    yoga,
    karana,
    nakshatra: planetsData['Moon'].nakshatra.name
  };

  return {
    ayanamsa,
    astroTime,
    utcDate,
    localDate: localDateForVara,
    planets: planetsData,
    panchang
  };
}

function getTithi(sunLong, moonLong) {
  let diff = moonLong - sunLong;
  if (diff < 0) diff += 360;
  const tithiVal = diff / 12;
  const index = Math.floor(tithiVal);
  const percent = (tithiVal % 1) * 100;
  const paksha = index < 15 ? 'Shukla' : 'Krishna';
  const names = [
    'Pratipat', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 
    'Shasthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Pournami'
  ];
  let name = names[index % 15];
  if (index === 29) name = 'Amavasya';
  return { name, paksha, index: index + 1, percent };
}

// --- Divisional Charts (Vargas) ---

export function calculateVargaSign(planetLong, vargaNum) {
  const long = (planetLong + 360) % 360;
  const rasiIdx = Math.floor(long / 30);
  const degInRasi = long % 30;

  if (vargaNum === 1) {
    // D1 - Rasi
    return rasiIdx;
  }

  if (vargaNum === 3) {
    // D3 - Drekkana (10 deg each)
    const part = Math.floor(degInRasi / 10); // 0, 1, 2
    return (rasiIdx + part * 4) % 12;
  }

  if (vargaNum === 4) {
    // D4 - Chaturthamsa (7.5 deg each)
    const part = Math.floor(degInRasi / 7.5); // 0, 1, 2, 3
    return (rasiIdx + part * 3) % 12;
  }

  if (vargaNum === 7) {
    // D7 - Saptamsa (~4.2857 deg each)
    const part = Math.floor(degInRasi / (30 / 7)); // 0 to 6
    const isOddRasi = rasiIdx % 2 === 0; // Aries (0) is odd
    const startSign = isOddRasi ? rasiIdx : (rasiIdx + 6) % 12; // itself or 7th sign
    return (startSign + part) % 12;
  }

  if (vargaNum === 9) {
    // D9 - Navamsa (3.3333 deg each)
    return Math.floor(long / (30 / 9)) % 12;
  }

  if (vargaNum === 10) {
    // D10 - Dasamsa (3 deg each)
    const part = Math.floor(degInRasi / 3); // 0 to 9
    if (rasiIdx % 2 === 0) {
      // Odd sign in 1-indexed (which is Even index: 0, 2, 4...)
      return (rasiIdx + part) % 12;
    } else {
      // Even sign in 1-indexed (which is Odd index: 1, 3, 5...)
      return ((rasiIdx + 8) + part) % 12; // starts from 9th sign (+8 in 0-indexed)
    }
  }

  if (vargaNum === 12) {
    // D12 - Dwadasamsa (2.5 deg each)
    const part = Math.floor(degInRasi / 2.5); // 0 to 11
    return (rasiIdx + part) % 12;
  }

  if (vargaNum === 16) {
    // D16 - Shodasamsa (1.875 deg each)
    const part = Math.floor(degInRasi / 1.875); // 0 to 15
    const triplicity = rasiIdx % 3; // 0 = Movable, 1 = Fixed, 2 = Dual
    let startSign = 0; // Aries
    if (triplicity === 1) startSign = 4; // Leo
    if (triplicity === 2) startSign = 8; // Sagittarius
    return (startSign + part) % 12;
  }

  if (vargaNum === 20) {
    // D20 - Vimsamsa (1.5 deg each)
    const part = Math.floor(degInRasi / 1.5); // 0 to 19
    const triplicity = rasiIdx % 3; // 0 = Movable, 1 = Fixed, 2 = Dual
    let startSign = 0; // Aries
    if (triplicity === 1) startSign = 8; // Sagittarius
    if (triplicity === 2) startSign = 4; // Leo
    return (startSign + part) % 12;
  }

  if (vargaNum === 24) {
    // D24 - Chaturvimsamsa / Siddhamsa (1.25 deg each)
    const part = Math.floor(degInRasi / 1.25); // 0 to 23
    const isOddRasi = rasiIdx % 2 === 0; // Aries (0) is odd
    const startSign = isOddRasi ? 4 : 3; // Leo (4) or Cancer (3)
    return (startSign + part) % 12;
  }

  if (vargaNum === 30) {
    // D30 - Trimsamsa (Mars, Venus, Mercury, Jupiter, Saturn)
    const d = degInRasi;
    const isOddRasi = rasiIdx % 2 === 0; // Aries = 0 (odd), Taurus = 1 (even)
    
    if (isOddRasi) {
      if (d <= 5) return 0;   // Mars (Aries)
      if (d <= 10) return 10; // Saturn (Aquarius)
      if (d <= 18) return 8;  // Jupiter (Sagittarius)
      if (d <= 25) return 2;  // Mercury (Gemini)
      return 1;               // Venus (Taurus)
    } else {
      if (d <= 5) return 1;   // Venus (Taurus)
      if (d <= 12) return 5;  // Mercury (Virgo)
      if (d <= 20) return 11; // Jupiter (Pisces)
      if (d <= 25) return 9;  // Saturn (Capricorn)
      return 7;               // Mars (Scorpio)
    }
  }

  if (vargaNum === 60) {
    // D60 - Shastyamsa (0.5 deg each)
    const part = Math.floor(degInRasi * 2) % 12; // Remainder (0 to 11)
    const isOddRasi = rasiIdx % 2 === 0; // Aries (0) is odd
    const startSign = isOddRasi ? rasiIdx : (rasiIdx + 6) % 12; // sign itself or 7th sign
    return (startSign + part) % 12;
  }

  return rasiIdx;
}

// Generate full coordinates for a Varga chart
export function getVargaChartData(planetsData, vargaNum) {
  const chart = Array.from({ length: 12 }, () => []);
  
  for (const name of Object.keys(planetsData)) {
    const p = planetsData[name];
    const signIdx = calculateVargaSign(p.siderealLong, vargaNum);
    chart[signIdx].push({
      name: p.name === 'Lagna' ? 'Asc' : p.name.substring(0, 2),
      isLagna: p.name === 'Lagna',
      isRetrograde: p.isRetrograde
    });
  }
  
  return chart;
}

// --- Vimshottari Dasha calculations ---

export function calculateVimshottariDasha(moonSiderealLong, birthDateObj) {
  const nak = getNakshatraInfo(moonSiderealLong);
  const startLord = nak.lord;
  const startLordIdx = DASHA_ORDER.indexOf(startLord);
  const elapsedPercent = nak.elapsedPercent;

  const birthTimeMs = birthDateObj.getTime();
  const msInYear = 365.25 * 24 * 60 * 60 * 1000;

  // Calculate Dashas
  const dashas = [];
  let currentStartMs = birthTimeMs;

  // Keep track of total years added to find dates
  let lordIdx = startLordIdx;
  
  // The first dasha is partially elapsed
  const firstDashaDurationYears = DASHA_DURATIONS[DASHA_ORDER[lordIdx]];
  const firstDashaRemainingYears = firstDashaDurationYears * (1 - elapsedPercent);
  
  let currentRemainingYears = firstDashaRemainingYears;

  for (let i = 0; i < 9; i++) {
    const lordName = DASHA_ORDER[lordIdx];
    const totalDurationYears = DASHA_DURATIONS[lordName];
    
    // For the very first dasha, we only experience the remaining years
    const activeDurationYears = i === 0 ? currentRemainingYears : totalDurationYears;
    const endMs = currentStartMs + activeDurationYears * msInYear;

    // Calculate Antar Dashas (Sub-dashas)
    const antarDashas = [];
    let subStartMs = currentStartMs;
    
    let subLordIdx = i === 0 ? startLordIdx : lordIdx; // If first dasha, start sub-dasha from the elapsed portion

    // For the first dasha, we need to find which sub-dashas are already over
    let accumSubYears = 0;
    const firstDashaElapsedYears = firstDashaDurationYears * elapsedPercent;

    for (let j = 0; j < 9; j++) {
      const subLordName = DASHA_ORDER[(subLordIdx + j) % 9];
      const subDurationYears = (totalDurationYears * DASHA_DURATIONS[subLordName]) / 120;
      
      accumSubYears += subDurationYears;
      
      // If it is the first Maha Dasha, some sub-dashas have already finished before birth
      if (i === 0) {
        if (accumSubYears <= firstDashaElapsedYears) {
          // Sub-dasha completed before birth
          continue;
        }
        
        // This sub-dasha is currently running at birth
        const subRemainingYears = accumSubYears - firstDashaElapsedYears;
        const subEndMs = birthTimeMs + subRemainingYears * msInYear;
        
        antarDashas.push({
          lord: subLordName,
          start: new Date(subStartMs),
          end: new Date(subEndMs)
        });
        subStartMs = subEndMs;
      } else {
        // Normal sub-dasha calculation
        const subEndMs = subStartMs + subDurationYears * msInYear;
        antarDashas.push({
          lord: subLordName,
          start: new Date(subStartMs),
          end: new Date(subEndMs)
        });
        subStartMs = subEndMs;
      }
    }

    dashas.push({
      lord: lordName,
      start: new Date(currentStartMs),
      end: new Date(endMs),
      antarDashas
    });

    currentStartMs = endMs;
    lordIdx = (lordIdx + 1) % 9;
  }

  return dashas;
}

// --- Ashtakoota Guna Milan Matchmaking (36 Points) ---

export function calculateGunaMilan(girlLong, boyLong) {
  const girlNak = getNakshatraInfo(girlLong);
  const boyNak = getNakshatraInfo(boyLong);
  
  const girlRasi = getRasiInfo(girlLong);
  const boyRasi = getRasiInfo(boyLong);

  // 1. Varna (1 Point)
  // Brahmin = 4, Kshatriya = 3, Vaishya = 2, Shudra = 1
  const getVarnaScore = (rasiIdx) => {
    if ([3, 7, 11].includes(rasiIdx)) return 4; // Water
    if ([0, 4, 8].includes(rasiIdx)) return 3;  // Fire
    if ([1, 5, 9].includes(rasiIdx)) return 2;  // Earth
    return 1; // Air (2, 6, 10)
  };
  const girlVarna = getVarnaScore(girlRasi.index);
  const boyVarna = getVarnaScore(boyRasi.index);
  const varnaScore = boyVarna >= girlVarna ? 1 : 0;

  // 2. Vashya (2 Points)
  // Simple check for Rasi categories
  // Chatushpada (0,1,4,8[half],9[half]), Manava (2,5,6,10,8[half]), Jalachara (3,11,9[half]), Keeta (7)
  const getVashyaCat = (rasiIdx) => {
    if ([0, 1, 4].includes(rasiIdx)) return 'Chatushpada';
    if ([2, 5, 6, 10].includes(rasiIdx)) return 'Manava';
    if ([3, 11].includes(rasiIdx)) return 'Jalachara';
    if (rasiIdx === 7) return 'Keeta';
    if (rasiIdx === 8) return 'Manava'; // Sagittarius
    return 'Chatushpada'; // Capricorn
  };
  const girlVash = getVashyaCat(girlRasi.index);
  const boyVash = getVashyaCat(boyRasi.index);
  let vashyaScore = 0;
  if (girlVash === boyVash) vashyaScore = 2;
  else if (girlVash === 'Jalachara' && boyVash === 'Chatushpada') vashyaScore = 1;
  else if (girlVash === 'Manava' && boyVash === 'Chatushpada') vashyaScore = 1;
  else vashyaScore = 0.5;

  // 3. Tara (3 Points)
  const distGtoB = (boyNak.index - girlNak.index + 27) % 27 + 1;
  const distBtoG = (girlNak.index - boyNak.index + 27) % 27 + 1;
  const t1 = distGtoB % 9;
  const t2 = distBtoG % 9;
  const r1 = t1 === 0 ? 9 : t1;
  const r2 = t2 === 0 ? 9 : t2;
  
  const isTaraEvil = (r) => [3, 5, 7].includes(r);
  let taraScore = 0;
  if (!isTaraEvil(r1) && !isTaraEvil(r2)) taraScore = 3;
  else if (!isTaraEvil(r1) || !isTaraEvil(r2)) taraScore = 1.5;
  else taraScore = 0;

  // 4. Yoni (4 Points)
  // Yoni animal types matching table
  const animalFriendship = {
    Horse: { Horse: 4, Elephant: 2, Sheep: 2, Serpent: 3, Dog: 2, Cat: 2, Rat: 2, Cow: 1, Buffalo: 0, Tiger: 1, Deer: 3, Monkey: 3, Mongoose: 2, Lion: 1 },
    Elephant: { Horse: 2, Elephant: 4, Sheep: 3, Serpent: 3, Dog: 2, Cat: 2, Rat: 1, Cow: 2, Buffalo: 3, Tiger: 1, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 0 },
    Sheep: { Horse: 2, Elephant: 3, Sheep: 4, Serpent: 2, Dog: 1, Cat: 2, Rat: 2, Cow: 3, Buffalo: 3, Tiger: 0, Deer: 3, Monkey: 2, Mongoose: 2, Lion: 1 },
    Serpent: { Horse: 3, Elephant: 3, Sheep: 2, Serpent: 4, Dog: 2, Cat: 1, Rat: 1, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 0, Mongoose: 0, Lion: 2 },
    Dog: { Horse: 2, Elephant: 2, Sheep: 1, Serpent: 2, Dog: 4, Cat: 1, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 1, Deer: 0, Monkey: 2, Mongoose: 1, Lion: 1 },
    Cat: { Horse: 2, Elephant: 2, Sheep: 2, Serpent: 1, Dog: 1, Cat: 4, Rat: 0, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 3, Monkey: 2, Mongoose: 1, Lion: 2 },
    Rat: { Horse: 2, Elephant: 1, Sheep: 2, Serpent: 1, Dog: 2, Cat: 0, Rat: 4, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 2 },
    Cow: { Horse: 1, Elephant: 2, Sheep: 3, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 4, Buffalo: 3, Tiger: 0, Deer: 3, Monkey: 2, Mongoose: 2, Lion: 1 },
    Buffalo: { Horse: 0, Elephant: 3, Sheep: 3, Serpent: 2, Dog: 2, Cat: 2, Rat: 2, Cow: 3, Buffalo: 4, Tiger: 1, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 2 },
    Tiger: { Horse: 1, Elephant: 1, Sheep: 0, Serpent: 2, Dog: 1, Cat: 2, Rat: 2, Cow: 0, Buffalo: 1, Tiger: 4, Deer: 1, Monkey: 2, Mongoose: 2, Lion: 2 },
    Deer: { Horse: 3, Elephant: 2, Sheep: 3, Serpent: 2, Dog: 0, Cat: 3, Rat: 2, Cow: 3, Buffalo: 2, Tiger: 1, Deer: 4, Monkey: 2, Mongoose: 2, Lion: 2 },
    Monkey: { Horse: 3, Elephant: 2, Sheep: 2, Serpent: 0, Dog: 2, Cat: 2, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 4, Mongoose: 2, Lion: 2 },
    Mongoose: { Horse: 2, Elephant: 2, Sheep: 2, Serpent: 0, Dog: 1, Cat: 1, Rat: 2, Cow: 2, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 4, Lion: 2 },
    Lion: { Horse: 1, Elephant: 0, Sheep: 1, Serpent: 2, Dog: 1, Cat: 2, Rat: 2, Cow: 1, Buffalo: 2, Tiger: 2, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 4 }
  };
  const girlAnimal = girlNak.animal;
  const boyAnimal = boyNak.animal;
  const yoniScore = animalFriendship[girlAnimal]?.[boyAnimal] ?? 2;

  // 5. Graha Maitri (5 Points)
  // Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6
  // Planetary friendship grid
  const planetsFriendship = {
    Sun: { Sun: 5, Moon: 5, Mars: 5, Mercury: 4, Jupiter: 5, Venus: 0, Saturn: 0 },
    Moon: { Sun: 5, Moon: 5, Mars: 4, Mercury: 4, Jupiter: 4, Venus: 4, Saturn: 3 },
    Mars: { Sun: 5, Moon: 4, Mars: 5, Mercury: 0, Jupiter: 5, Venus: 3, Saturn: 3 },
    Mercury: { Sun: 4, Moon: 0, Mars: 3, Mercury: 5, Jupiter: 3, Venus: 5, Saturn: 4 },
    Jupiter: { Sun: 5, Moon: 4, Mars: 5, Mercury: 0, Jupiter: 5, Venus: 0, Saturn: 3 },
    Venus: { Sun: 0, Moon: 0, Mars: 3, Mercury: 5, Jupiter: 3, Venus: 5, Saturn: 5 },
    Saturn: { Sun: 0, Moon: 0, Mars: 0, Mercury: 4, Jupiter: 3, Venus: 5, Saturn: 5 }
  };
  const girlLord = ZODIAC_SIGNS[girlRasi.index].ruler;
  const boyLord = ZODIAC_SIGNS[boyRasi.index].ruler;
  const maitriScore = planetsFriendship[girlLord]?.[boyLord] ?? 3;

  // 6. Gana (6 Points)
  // Deva, Manushya, Rakshasa
  let ganaScore = 0;
  if (girlNak.gana === boyNak.gana) ganaScore = 6;
  else if ((girlNak.gana === 'Deva' && boyNak.gana === 'Manushya') || (girlNak.gana === 'Manushya' && boyNak.gana === 'Deva')) ganaScore = 5;
  else if (girlNak.gana === 'Deva' && boyNak.gana === 'Rakshasa') ganaScore = 1;
  else if (girlNak.gana === 'Rakshasa' && boyNak.gana === 'Deva') ganaScore = 1;
  else ganaScore = 0;

  // 7. Bhakoot (7 Points)
  const diffRasi = (boyRasi.index - girlRasi.index + 12) % 12 + 1;
  const badBhakoot = [2, 12, 5, 9, 6, 8];
  const bhakootScore = badBhakoot.includes(diffRasi) ? 0 : 7;

  // 8. Nadi (8 Points)
  const nadiScore = girlNak.nadi !== boyNak.nadi ? 8 : 0;

  const totalPoints = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;

  return {
    kootas: {
      varna: { max: 1, score: varnaScore, girl: girlRasi.element, boy: boyRasi.element },
      vashya: { max: 2, score: vashyaScore, girl: girlVash, boy: boyVash },
      tara: { max: 3, score: taraScore, girl: girlNak.lord, boy: boyNak.lord },
      yoni: { max: 4, score: yoniScore, girl: girlAnimal, boy: boyAnimal },
      maitri: { max: 5, score: maitriScore, girl: girlLord, boy: boyLord },
      gana: { max: 6, score: ganaScore, girl: girlNak.gana, boy: boyNak.gana },
      bhakoot: { max: 7, score: bhakootScore, girl: girlRasi.name, boy: boyRasi.name },
      nadi: { max: 8, score: nadiScore, girl: girlNak.nadi, boy: boyNak.nadi }
    },
    totalPoints
  };
}

// --- High Precision API Integration ---

const JHORA_API_URL = 'https://jagannatha-hora-359167915530.europe-west1.run.app';

export function transformAPIToLocalFormat(horoscope, params) {
  const ayanamsa = horoscope.ayanamsa_value;
  
  // Construct planets list
  const d1Chart = horoscope.divisional_charts['D-1_rasi'];
  const retrogradePlanets = horoscope.planetary_states?.retrograde_planets || [];
  
  const signNames = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const planetsData = {};
  
  // List of planets to map
  const planetsList = [
    { apiKey: 'Sun', localKey: 'Sun' },
    { apiKey: 'Moon', localKey: 'Moon' },
    { apiKey: 'Mars', localKey: 'Mars' },
    { apiKey: 'Mercury', localKey: 'Mercury' },
    { apiKey: 'Jupiter', localKey: 'Jupiter' },
    { apiKey: 'Venus', localKey: 'Venus' },
    { apiKey: 'Saturn', localKey: 'Saturn' },
    { apiKey: 'Rahu', localKey: 'Rahu' },
    { apiKey: 'Ketu', localKey: 'Ketu' },
    { apiKey: 'Uranus', localKey: 'Uranus' },
    { apiKey: 'Neptune', localKey: 'Neptune' },
    { apiKey: 'Pluto', localKey: 'Pluto' },
    { apiKey: 'Ascendant', localKey: 'Lagna' }
  ];

  for (const item of planetsList) {
    const apiPlanet = d1Chart[item.apiKey];
    if (!apiPlanet) continue;
    
    const signIdx = signNames.indexOf(apiPlanet.sign);
    const siderealLong = (signIdx * 30 + apiPlanet.longitude + 360) % 360;
    const tropicalLong = (siderealLong + ayanamsa + 360) % 360;
    
    planetsData[item.localKey] = {
      name: item.localKey,
      tropicalLong,
      siderealLong,
      latitude: 0,
      rasi: getRasiInfo(siderealLong),
      nakshatra: getNakshatraInfo(siderealLong),
      isRetrograde: retrogradePlanets.includes(item.apiKey)
    };
  }

  // Calculate Panchangam using high-precision values
  const tithiInfo = getTithi(planetsData['Sun'].tropicalLong, planetsData['Moon'].tropicalLong);
  
  const [year, month, day] = params.dateStr.split('-').map(Number);
  const [hour, minute, second] = params.timeStr.split(':').map(Number);
  const utcTimeMs = Date.UTC(year, month - 1, day, hour, minute, second) - parseFloat(params.timezoneOffset) * 60 * 60 * 1000;
  const localDateForVara = new Date(utcTimeMs + parseFloat(params.timezoneOffset) * 60 * 60 * 1000);
  const dayIdx = localDateForVara.getUTCDay();
  const vara = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIdx];
  
  let sumYoga = (planetsData['Sun'].siderealLong + planetsData['Moon'].siderealLong) % 360;
  const yogaNames = [
    'Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 
    'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 
    'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 
    'Brahma', 'Indra', 'Vaidhriti'
  ];
  const yogaIdx = Math.floor(sumYoga / (360 / 27));
  const yoga = yogaNames[yogaIdx % 27];

  const diffMoonSun = (planetsData['Moon'].tropicalLong - planetsData['Sun'].tropicalLong + 360) % 360;
  const karanaNames = [
    'Kinstughna', 'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Shakuni', 'Chatushpada', 'Naga'
  ];
  const karanaIdx = Math.floor(diffMoonSun / 6);
  const karana = karanaNames[karanaIdx] || 'Unknown';

  const panchang = {
    tithi: tithiInfo,
    vara,
    yoga,
    karana,
    nakshatra: planetsData['Moon'].nakshatra.name
  };

  return {
    ayanamsa,
    astroTime: { ut: utcTimeMs / 1000 / 24 / 3600 },
    utcDate: new Date(utcTimeMs),
    localDate: localDateForVara,
    planets: planetsData,
    panchang,
    raw: horoscope
  };
}

export async function calculateBirthDataAsync(params) {
  const payload = {
    date: params.dateStr,
    time: params.timeStr,
    place: params.cityPreset || 'Preset Location',
    latitude: parseFloat(params.lat),
    longitude: parseFloat(params.lon),
    timezone: parseFloat(params.timezoneOffset),
    elevation: 0,
    ayanamsa_mode: 'Lahiri'
  };

  try {
    const res = await fetch(`${JHORA_API_URL}/horoscope`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }

    const data = await res.json();
    if (data && data.horoscope) {
      const transformed = transformAPIToLocalFormat(data.horoscope, params);
      return { data: transformed, mode: 'api' };
    }
    throw new Error('Invalid response structure');
  } catch (err) {
    console.warn('High precision API call failed, falling back to local engine:', err);
    const localData = calculateBirthData(params);
    return { data: localData, mode: 'local' };
  }
}

// Maps high-precision divisional charts from API directly to chart rendering grid
export function getVargaChartDataFromAPI(divisionalCharts, vargaNum, planetsData) {
  const chart = Array.from({ length: 12 }, () => []);
  const keyMap = {
    1: 'D-1_rasi',
    2: 'D-2_hora',
    3: 'D-3_drekkana',
    4: 'D-4_chaturthamsa',
    5: 'D-5_panchamsa',
    6: 'D-6_shashthamsa',
    7: 'D-7_saptamsa',
    8: 'D-8_ashtamsa',
    9: 'D-9_navamsa',
    10: 'D-10_dasamsa',
    11: 'D-11_rudramsa',
    12: 'D-12_dwadasamsa',
    16: 'D-16_shodasamsa',
    20: 'D-20_vimsamsa',
    24: 'D-24_chaturvimsamsa',
    27: 'D-27_nakshatramsa',
    30: 'D-30_trimsamsa',
    40: 'D-40_khavedamsa',
    45: 'D-45_akshavedamsa',
    60: 'D-60_shastiamsa'
  };
  
  const key = keyMap[vargaNum] || `D-${vargaNum}`;
  const chartData = divisionalCharts?.[key];
  if (!chartData) {
    return getVargaChartData(planetsData, vargaNum);
  }

  const signNames = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  for (const name of Object.keys(chartData)) {
    const pInfo = chartData[name];
    const signIdx = signNames.indexOf(pInfo.sign);
    if (signIdx !== -1) {
      const isRetro = planetsData[name === 'Ascendant' ? 'Lagna' : name]?.isRetrograde || false;
      chart[signIdx].push({
        name: name === 'Ascendant' ? 'Asc' : name.substring(0, 2),
        isLagna: name === 'Ascendant',
        isRetrograde: isRetro
      });
    }
  }

  return chart;
}
