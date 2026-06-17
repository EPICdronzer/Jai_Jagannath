import React, { useState, useMemo } from 'react';
import {
  ScrollText, Star, Briefcase, DollarSign, Heart, Users, Activity,
  Home, Calendar, Sparkles, ChevronDown, ChevronUp, AlertTriangle,
  ShieldCheck, BookOpen, Sun, Moon, Zap, Globe, Eye, Award
} from 'lucide-react';
import { calculateVimshottariDasha, DASHA_DURATIONS, DASHA_ORDER, getNakshatraInfo } from '../utils/astrology';

// ─── DATA TABLES ────────────────────────────────────────────────────────────

const RASI_LORD = {
  Aries:'Mars', Taurus:'Venus', Gemini:'Mercury', Cancer:'Moon', Leo:'Sun',
  Virgo:'Mercury', Libra:'Venus', Scorpio:'Mars', Sagittarius:'Jupiter',
  Capricorn:'Saturn', Aquarius:'Saturn', Pisces:'Jupiter'
};

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

const PLANET_EXALTATION = { Sun:'Aries', Moon:'Taurus', Mars:'Capricorn', Mercury:'Virgo', Jupiter:'Cancer', Venus:'Pisces', Saturn:'Libra', Rahu:'Gemini', Ketu:'Sagittarius' };
const PLANET_DEBILITATION = { Sun:'Libra', Moon:'Scorpio', Mars:'Cancer', Mercury:'Pisces', Jupiter:'Capricorn', Venus:'Virgo', Saturn:'Aries', Rahu:'Sagittarius', Ketu:'Gemini' };
const PLANET_OWN = {
  Sun:['Leo'], Moon:['Cancer'], Mars:['Aries','Scorpio'], Mercury:['Gemini','Virgo'],
  Jupiter:['Sagittarius','Pisces'], Venus:['Taurus','Libra'], Saturn:['Capricorn','Aquarius'],
  Rahu:[], Ketu:[]
};

const PLANET_FRIEND = {
  Sun:['Moon','Mars','Jupiter'], Moon:['Sun','Mercury'], Mars:['Sun','Moon','Jupiter'],
  Mercury:['Sun','Venus'], Jupiter:['Sun','Moon','Mars'], Venus:['Mercury','Saturn'],
  Saturn:['Mercury','Venus']
};

const LAGNA_ELEMENT = {
  Aries:'Fire', Taurus:'Earth', Gemini:'Air', Cancer:'Water', Leo:'Fire',
  Virgo:'Earth', Libra:'Air', Scorpio:'Water', Sagittarius:'Fire',
  Capricorn:'Earth', Aquarius:'Air', Pisces:'Water'
};

const DASHA_RESULTS = {
  Sun:   { career:'Authority, Govt recognition, leadership roles rise', health:'Vitality good but watch heart/spine', wealth:'Income from senior roles', relation:'Father relationship key, some ego issues in love' },
  Moon:  { career:'Creative, public dealings, emotional intelligence shines', health:'Mind-body balance critical, fluids/digestion', wealth:'Fluctuating income, family-related gains', relation:'Emotional bonds deepen, mother important period' },
  Mars:  { career:'Aggressive growth, entrepreneurship, real-estate', health:'Accidents, blood/surgery risk if afflicted', wealth:'Gains through property, courage earns money', relation:'Passion high, conflicts possible, decisive phase' },
  Mercury: { career:'Business, communication, education, IT, writing', health:'Nervous system, skin, digestion watch', wealth:'Multiple income streams, smart investments', relation:'Intellectual bonds, marriage talks likely' },
  Jupiter: { career:'Expansion, wisdom roles, teaching, spirituality', health:'Generally blessed, watch liver/fat', wealth:'Major wealth accumulation possible', relation:'Auspicious for marriage, children, spiritual union' },
  Venus:  { career:'Arts, luxury, diplomacy, beauty industry, entertainment', health:'Kidney/urinary, sugar; but generally comfortable', wealth:'Good material comforts, artistic earnings', relation:'Romance peaks, marriage very likely, harmony' },
  Saturn: { career:'Delays then discipline-based rewards, service, law', health:'Joints, bones, chronic conditions if weak', wealth:'Slow but steady; avoid debt during early phase', relation:'Karmic relationships surface, tests in love' },
  Rahu:  { career:'Foreign connections, technology, unconventional success', health:'Unusual ailments, mental restlessness', wealth:'Sudden gains AND losses; speculative risk', relation:'Karmic, obsessive attachments; foreign partner possible' },
  Ketu:  { career:'Research, spirituality, detachment from material goals', health:'Mysterious ailments, past-life physical debts', wealth:'Expenditure, losses if not careful; moksha path', relation:'Separations, letting go of attachments, spiritual bonds' }
};

const HOUSE_SIGNIFICATION = {
  1:'Self, Body, Personality', 2:'Wealth, Family, Speech', 3:'Courage, Siblings, Short Journeys',
  4:'Home, Mother, Vehicles, Education', 5:'Intelligence, Children, Past-life Karma', 6:'Enemies, Debts, Health, Service',
  7:'Marriage, Partnership, Business', 8:'Longevity, Occult, Sudden Events', 9:'Dharma, Father, Luck, Higher Learning',
  10:'Career, Status, Authority', 11:'Gains, Income, Desires', 12:'Losses, Foreign, Moksha, Hospital'
};

const NAKSHATRA_PERSONALITY = {
  Ashwini:'energetic healer, quick starts, pioneering nature',
  Bharani:'intense will-power, transformation, pleasure-seeking',
  Krittika:'sharp, critical, leadership, purifying fire',
  Rohini:'creative, materialistic, charming, artistic',
  Mrigashira:'curious, searching, gentle yet restless',
  Ardra:'turbulent yet insightful, emotional storms leading to growth',
  Punarvasu:'optimistic, returns to goodness, philosophical',
  Pushya:'nurturing, disciplined, protective of family',
  Ashlesha:'perceptive, strategic, clinging tendencies',
  Magha:'ancestral pride, authority, royal bearing',
  'Purva Phalguni':'pleasure-loving, romantic, creative',
  'Uttara Phalguni':'service-oriented, partnerships, stable success',
  Hasta:'skillful hands, practical, witty, resourceful',
  Chitra:'artistic brilliance, glamour, perfectionism',
  Swati:'independent, diplomatic, scattered yet flexible',
  Vishakha:'goal-focused, competitive, extremes of emotion',
  Anuradha:'devoted friendship, occult knowledge, travel',
  Jyeshtha:'protective, eldest-sibling energy, hidden powers',
  Moola:'root-level research, truth-seeking, transformative destruction',
  'Purva Ashadha':'invincible pride, philosophical, water element',
  'Uttara Ashadha':'principled success, late bloomer, patient',
  Shravana:'listening, learning, Vishnu energy, media/communication',
  Dhanishta:'wealth, music, ambition, Mars-Saturn blend',
  Shatabhisha:'healer, reclusive, futuristic, independent',
  'Purva Bhadrapada':'passionate idealism, transformation through fire',
  'Uttara Bhadrapada':'depth, patience, cosmic wisdom, profundity',
  Revati:'nurturing, completion, spiritual, endings and beginnings'
};

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

function getHouse(lagnaIdx, planetIdx) {
  return ((planetIdx - lagnaIdx + 12) % 12) + 1;
}

function getPlanetStrength(planet) {
  const sign = planet?.rasi?.name;
  if (!sign) return 'neutral';
  const name = planet.name;
  if (PLANET_EXALTATION[name] === sign) return 'exalted';
  if (PLANET_DEBILITATION[name] === sign) return 'debilitated';
  if (PLANET_OWN[name]?.includes(sign)) return 'own-sign';
  if (PLANET_FRIEND[name]?.includes(RASI_LORD[sign])) return 'friendly';
  return 'neutral';
}

function strengthLabel(s) {
  return { exalted:'Exalted ⬆', debilitated:'Debilitated ⬇', 'own-sign':'Own Sign ★', friendly:'Friendly House', neutral:'Neutral' }[s] || 'Neutral';
}
function strengthColor(s) {
  return { exalted:'#10b981', debilitated:'#ef4444', 'own-sign':'#eab308', friendly:'#06b6d4', neutral:'var(--text-muted)' }[s] || 'var(--text-muted)';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' });
}

function getAge(birthDate, targetDate) {
  const b = new Date(birthDate);
  const t = new Date(targetDate);
  let age = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
  return age;
}

// ─── SECTION CARD ───────────────────────────────────────────────────────────

function Section({ id, icon: Icon, title, subtitle, color = 'var(--gold)', children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} style={{
      background: 'linear-gradient(135deg, rgba(10,12,22,0.97), rgba(16,18,34,0.97))',
      border: `1px solid rgba(${color === 'var(--gold)' ? '234,179,8' : '6,182,212'},0.15)`,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: open ? `1px solid rgba(255,255,255,0.06)` : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: `rgba(${color === 'var(--gold)' ? '234,179,8' : '6,182,212'},0.12)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={18} color={color} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: color, fontSize: '15px' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</div>}
          </div>
        </div>
        {open ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </button>
      {open && <div style={{ padding: '22px' }}>{children}</div>}
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px',
      padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'start'
    }}>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, paddingTop: '1px' }}>{label}</span>
      <span style={{ fontSize: '13px', color: highlight ? 'var(--gold)' : 'var(--text-secondary)', lineHeight: '1.5' }}>{value}</span>
    </div>
  );
}

function Tag({ text, type = 'info' }) {
  const colors = {
    info: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', text: '#06b6d4' },
    warn: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
    danger: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: '#ef4444' },
    success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#10b981' },
    gold: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)', text: '#eab308' }
  };
  const c = colors[type];
  return (
    <span style={{
      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      display: 'inline-block', margin: '3px'
    }}>{text}</span>
  );
}

function InfoBox({ type = 'note', children }) {
  const map = {
    note: { bg: 'rgba(6,182,212,0.06)', border: 'rgba(6,182,212,0.2)', icon: '💡', color: '#06b6d4' },
    warn: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', icon: '⚠️', color: '#f59e0b' },
    danger: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)', icon: '🔴', color: '#ef4444' },
    success: { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)', icon: '✅', color: '#10b981' },
    gold: { bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.2)', icon: '⭐', color: '#eab308' }
  };
  const s = map[type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '10px', padding: '14px 16px', marginTop: '12px', display: 'flex', gap: '10px', lineHeight: '1.6' }}>
      <span style={{ fontSize: '15px', flexShrink: 0 }}>{s.icon}</span>
      <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{children}</span>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function KundaliReportView({ birthData, params, extraProfile }) {
  if (!birthData || !params) return null;

  const planets = birthData.planets;
  const now = new Date();
  const birthDateObj = new Date(birthData.utcDate);

  // ── Core derived values ──────────────────────────────────────────────────
  const lagna = planets['Lagna'];
  const sun   = planets['Sun'];
  const moon  = planets['Moon'];
  const mars  = planets['Mars'];
  const merc  = planets['Mercury'];
  const jup   = planets['Jupiter'];
  const ven   = planets['Venus'];
  const sat   = planets['Saturn'];
  const rahu  = planets['Rahu'];
  const ketu  = planets['Ketu'];

  const lagnaSign    = lagna.rasi.name;
  const lagnaIdx     = lagna.rasi.index;
  const sunSign      = sun.rasi.name;
  const moonSign     = moon.rasi.name;
  const moonNak      = moon.nakshatra;
  const lagnaLord    = RASI_LORD[lagnaSign];
  const lagnaLordPl  = planets[lagnaLord];
  const lagnaLordHouse = lagnaLordPl ? getHouse(lagnaIdx, lagnaLordPl.rasi.index) : 1;

  // 7th house
  const seventhSignIdx  = (lagnaIdx + 6) % 12;
  const seventhSign     = SIGNS[seventhSignIdx];
  const seventhLordName = RASI_LORD[seventhSign];
  const seventhLord     = planets[seventhLordName];
  const seventhLordHouse = seventhLord ? getHouse(lagnaIdx, seventhLord.rasi.index) : 7;

  // 10th house
  const tenthSignIdx  = (lagnaIdx + 9) % 12;
  const tenthSign     = SIGNS[tenthSignIdx];
  const tenthLordName = RASI_LORD[tenthSign];
  const tenthLord     = planets[tenthLordName];
  const tenthLordHouse = tenthLord ? getHouse(lagnaIdx, tenthLord.rasi.index) : 10;

  // 2nd and 11th lords (wealth)
  const secondSignIdx   = (lagnaIdx + 1) % 12;
  const eleventhSignIdx = (lagnaIdx + 10) % 12;
  const secondLord      = RASI_LORD[SIGNS[secondSignIdx]];
  const eleventhLord    = RASI_LORD[SIGNS[eleventhSignIdx]];

  // Planetary house positions
  const planetHouses = {};
  for (const [k, p] of Object.entries(planets)) {
    if (k !== 'Lagna') planetHouses[k] = getHouse(lagnaIdx, p.rasi.index);
  }

  // Planetary strengths
  const planetStrengths = {};
  for (const [k, p] of Object.entries(planets)) {
    if (!['Lagna','Uranus','Neptune','Pluto'].includes(k)) {
      planetStrengths[k] = getPlanetStrength(p);
    }
  }

  // Dasha
  const dashas = useMemo(() =>
    calculateVimshottariDasha(moon.siderealLong, birthDateObj),
  [moon.siderealLong, birthDateObj.getTime()]);

  let currentDasha = null, currentAntar = null;
  for (const d of dashas) {
    if (now >= new Date(d.start) && now <= new Date(d.end)) {
      currentDasha = d;
      for (const a of d.antarDashas) {
        if (now >= new Date(a.start) && now <= new Date(a.end)) {
          currentAntar = a;
          break;
        }
      }
      break;
    }
  }

  // Next dasha
  let nextDasha = null;
  if (currentDasha) {
    const idx = dashas.findIndex(d => d.lord === currentDasha.lord && d.start.toString() === currentDasha.start.toString());
    if (idx !== -1 && idx < dashas.length - 1) nextDasha = dashas[idx + 1];
  }

  // Age at birth date
  const currentAge = getAge(birthDateObj, now);

  // Check Kaal Sarp (simplified: all planets between Rahu and Ketu)
  const mainPlanetKeys = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
  function isInArcRahuKetu() {
    const rahuDeg = rahu?.siderealLong || 0;
    const ketuDeg = ketu?.siderealLong || 0;
    const arc = (ketuDeg - rahuDeg + 360) % 360;
    return mainPlanetKeys.every(k => {
      const p = planets[k];
      if (!p) return false;
      const rel = (p.siderealLong - rahuDeg + 360) % 360;
      return rel <= arc;
    });
  }
  const hasKaalSarp = isInArcRahuKetu();

  // Manglik check (Mars in 1,4,7,8,12)
  const marsHouse = planetHouses['Mars'];
  const isManglik = [1,4,7,8,12].includes(marsHouse);

  // Gajakesari yoga (Jupiter-Moon in kendra)
  const moonH = planetHouses['Moon'];
  const jupH  = planetHouses['Jupiter'];
  const kendraDiff = Math.abs(moonH - jupH);
  const hasGajakesari = [0,3,6,9].includes(kendraDiff) || [0,3,6,9].includes(12 - kendraDiff);

  // Check retrogrades
  const retroPlanets = Object.entries(planets).filter(([k,p]) => !['Lagna','Sun','Moon'].includes(k) && p.isRetrograde).map(([k]) => k);

  // Functional benefics/malefics by lagna
  const FUNC_BENEFICS = {
    Aries:['Jupiter','Sun','Mars','Moon'], Taurus:['Saturn','Venus','Mercury','Sun'],
    Gemini:['Venus','Saturn','Mercury'], Cancer:['Moon','Jupiter','Mars'],
    Leo:['Mars','Sun','Jupiter'], Virgo:['Mercury','Venus'],
    Libra:['Saturn','Venus','Mercury'], Scorpio:['Moon','Jupiter','Sun'],
    Sagittarius:['Jupiter','Mars','Sun'], Capricorn:['Venus','Mercury','Saturn'],
    Aquarius:['Venus','Saturn','Mercury'], Pisces:['Jupiter','Moon','Mars']
  };
  const funcBenefics = FUNC_BENEFICS[lagnaSign] || [];

  // Yogas from raw data if available
  const rawYogas = birthData.raw?.yogas;
  const rawDoshas = birthData.raw?.doshas;
  const rajaYogaCount = rawYogas?.summary?.total_raja_yogas_found || 0;
  const totalYogaCount = rawYogas?.summary?.total_yogas_found || 0;

  // ── Prediction helpers ────────────────────────────────────────────────────

  function careerBestFields() {
    const fields = [];
    if ([1,4,9,10].includes(planetHouses['Sun'])) fields.push('Government / Administration');
    if ([1,5,9,10].includes(planetHouses['Jupiter'])) fields.push('Education / Law / Finance / Consulting');
    if ([3,6,10].includes(planetHouses['Mars']) || lagnaSign === 'Aries' || lagnaSign === 'Scorpio') fields.push('Engineering / Defense / Surgery / Sports');
    if ([1,2,5,11].includes(planetHouses['Venus'])) fields.push('Arts / Entertainment / Fashion / Hospitality');
    if ([1,2,3,6,10].includes(planetHouses['Mercury'])) fields.push('IT / Writing / Business / Commerce / Media');
    if (planetHouses['Saturn'] === 10 || lagnaSign === 'Capricorn' || lagnaSign === 'Aquarius') fields.push('Politics / Real Estate / Labour / Judiciary');
    if (planetHouses['Moon'] === 10 || [3,4].includes(planetHouses['Moon'])) fields.push('Public Relations / Food Industry / Healthcare / Hospitality');
    if ([8,12].includes(planetHouses['Jupiter']) || [8,12].includes(planetHouses['Ketu'])) fields.push('Research / Occult / Spirituality / Psychology');
    if (!fields.length) fields.push('Multi-domain — adaptability is your career strength');
    return fields;
  }

  function wealthPotential() {
    let score = 5;
    if (planetStrengths[secondLord] === 'exalted') score += 2;
    if (planetStrengths[eleventhLord] === 'exalted') score += 2;
    if (hasGajakesari) score += 1;
    if (rajaYogaCount > 2) score += 1;
    if (planetStrengths['Jupiter'] === 'debilitated') score -= 2;
    if (planetStrengths['Venus'] === 'debilitated') score -= 1;
    if (hasKaalSarp) score -= 1;
    score = Math.max(2, Math.min(10, score));
    if (score >= 8) return { label: 'High', color: '#10b981', desc: 'Excellent wealth potential — prosperity comes through focused effort and the right timing.' };
    if (score >= 6) return { label: 'Above Average', color: '#06b6d4', desc: 'Good earning capacity — smart decisions during favorable Dashas will consolidate wealth.' };
    if (score >= 4) return { label: 'Moderate', color: '#eab308', desc: 'Moderate financial growth — requires consistent planning, discipline, and avoiding speculation.' };
    return { label: 'Challenging', color: '#ef4444', desc: 'Financial growth requires significant effort — prioritise savings, avoid debt, and seek wise counsel.' };
  }

  function marriageTiming() {
    const periods = [];
    for (const d of dashas) {
      if (['Venus','Jupiter','Moon','Mars'].includes(d.lord)) {
        const dStart = new Date(d.start);
        const dEnd   = new Date(d.end);
        if (dEnd > birthDateObj) {
          const ageStart = getAge(birthDateObj, dStart);
          const ageEnd   = getAge(birthDateObj, dEnd);
          periods.push(`${d.lord} Mahadasha: Age ${Math.max(18, ageStart)}–${ageEnd}`);
        }
      }
    }
    return periods.slice(0, 3);
  }

  function healthZones() {
    const zones = [];
    const lagnaElem = LAGNA_ELEMENT[lagnaSign];
    if (lagnaElem === 'Fire') zones.push({ zone:'Heart, Eyes, Spine', risk:'moderate', note:'Stress and overexertion affect heart health — rest and sunlight are important.' });
    if (lagnaElem === 'Earth') zones.push({ zone:'Stomach, Bones, Teeth', risk:'low', note:'Generally strong constitution — watch metabolic and digestive health with age.' });
    if (lagnaElem === 'Air') zones.push({ zone:'Lungs, Nervous System, Skin', risk:'moderate', note:'Anxiety and overthinking can affect respiratory health — breathing exercises help.' });
    if (lagnaElem === 'Water') zones.push({ zone:'Lungs, Lymphatic, Hormonal', risk:'moderate', note:'Emotional state directly impacts immune system — emotional hygiene is critical.' });
    if (planetStrengths['Saturn'] === 'debilitated') zones.push({ zone:'Joints, Knees, Chronic Fatigue', risk:'high', note:'Saturn debilitated: chronic conditions, arthritis, or mobility issues possible after 40.' });
    if (planetStrengths['Mars'] === 'debilitated') zones.push({ zone:'Blood, Muscles, Surgery Risk', risk:'high', note:'Mars debilitated: accidents, surgical interventions, or blood-related issues — drive carefully.' });
    if (isManglik && marsHouse === 8) zones.push({ zone:'Accident / Surgical Risk', risk:'high', note:'Mars in 8th house: take precautions in physical activities, especially around Mars Dasha.' });
    if ([6,8,12].includes(planetHouses['Moon'])) zones.push({ zone:'Mental Health, Stress, Anxiety', risk:'moderate', note:'Moon in 6th/8th/12th: emotional sensitivity, anxiety tendencies — meditation is strongly advised.' });
    return zones;
  }

  const wealth = wealthPotential();
  const marriagePeriods = marriageTiming();
  const healthAreas = healthZones();
  const careerFields = careerBestFields();

  // Year predictions (2026–2027)
  function getYearDasha(year) {
    const targetDate = new Date(`${year}-01-01`);
    for (const d of dashas) {
      if (targetDate >= new Date(d.start) && targetDate <= new Date(d.end)) {
        for (const a of d.antarDashas) {
          if (targetDate >= new Date(a.start) && targetDate <= new Date(a.end)) {
            return { maha: d.lord, antar: a.lord };
          }
        }
        return { maha: d.lord, antar: d.antarDashas[0]?.lord || '—' };
      }
    }
    return null;
  }

  const dasha2026 = getYearDasha(2026);
  const dasha2027 = getYearDasha(2027);

  function yearForecast(dInfo) {
    if (!dInfo) return { summary:'Dasha period beyond available calculation range.', career:'—', wealth:'—', health:'—', relation:'—' };
    const m = DASHA_RESULTS[dInfo.maha] || {};
    const a = DASHA_RESULTS[dInfo.antar] || {};
    const isStrong = funcBenefics.includes(dInfo.maha);
    return {
      summary: `${dInfo.maha} Mahadasha / ${dInfo.antar} Antardasha — ${isStrong ? 'a powerful and growth-oriented period for you as ' + dInfo.maha + ' is a functional benefic for ' + lagnaSign + ' Lagna' : 'a karmic learning period requiring patience and strategy'}.`,
      career: m.career || '—',
      wealth: m.wealth || '—',
      health: m.health || '—',
      relation: m.relation || '—'
    };
  }

  const forecast2026 = yearForecast(dasha2026);
  const forecast2027 = yearForecast(dasha2027);

  // Remedies by lagna lord
  const REMEDIES = {
    Sun:  { mantra:'Om Hram Hrim Hraum Sah Suryaya Namah (108x Sunday)', gem:'Ruby (only if Sun is strong and functional benefic)', fast:'Sunday fast', donation:'Wheat, jaggery, red cloth to poor on Sundays', temple:'Sun temple — Konark, Surya mandir', color:'Red/Orange on Sundays' },
    Moon: { mantra:'Om Shram Shrim Shraum Sah Chandraya Namah (108x Monday)', gem:'Natural Pearl or Moonstone', fast:'Monday fast, offer white flowers to Shiva', donation:'Rice, milk, white cloth on Mondays', temple:'Shiva temple — pour milk on Shivling Monday mornings', color:'White/Silver on Mondays' },
    Mars: { mantra:'Om Kram Krim Kraum Sah Bhaumaya Namah (108x Tuesday)', gem:'Red Coral (only if Mars is benefic)', fast:'Tuesday Hanuman fast', donation:'Red lentils (masoor dal), copper vessel on Tuesdays', temple:'Hanuman temple — offer sindoor and flowers on Tuesdays', color:'Red on Tuesdays' },
    Mercury: { mantra:'Om Bram Brim Braum Sah Budhaya Namah (108x Wednesday)', gem:'Emerald or Green Tourmaline if Mercury is strong', fast:'Wednesday fast or satvik food', donation:'Green moong dal, green cloth on Wednesdays', temple:'Vishnu temple — recite Vishnu Sahasranam', color:'Green/Parrot-green on Wednesdays' },
    Jupiter: { mantra:'Om Gram Grim Graum Sah Guruve Namah (108x Thursday)', gem:'Yellow Sapphire (Pukhraj) — highly recommended if Jupiter is benefic', fast:'Thursday fast, eat yellow foods', donation:'Chana dal, yellow cloth, turmeric on Thursdays', temple:'Brihaspati puja or Vishnu temple Thursdays', color:'Yellow on Thursdays' },
    Venus: { mantra:'Om Dram Drim Draum Sah Shukraya Namah (108x Friday)', gem:'Diamond or White Sapphire if Venus is strong benefic', fast:'Friday fast', donation:'White sugar, white flowers, rice pudding on Fridays', temple:'Devi temple — Lakshmi puja on Fridays', color:'White/Pink on Fridays' },
    Saturn: { mantra:'Om Pram Prim Praum Sah Shanaishcharaya Namah (108x Saturday)', gem:'Blue Sapphire — ONLY after professional astrologer confirms it suits you', fast:'Saturday fast, oil lamp to Shani', donation:'Black sesame, mustard oil, iron vessel on Saturdays', temple:'Shani temple — offer oil on Shani Yantra Saturdays', color:'Dark blue/Black on Saturdays' }
  };
  const lagnaRemedy = REMEDIES[lagnaLord] || REMEDIES['Jupiter'];

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      width: '100%', maxWidth: '900px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px'
    }}>

      {/* ── DISCLAIMER BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(234,179,8,0.08), rgba(6,182,212,0.06))',
        border: '1px solid rgba(234,179,8,0.2)', borderRadius: '14px', padding: '16px 20px',
        display: 'flex', gap: '12px', alignItems: 'flex-start'
      }}>
        <span style={{ fontSize: '20px' }}>🔮</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '13px', marginBottom: '4px' }}>
            Jai Jagannath — Deep Kundali Analysis
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            This report is computed algorithmically from your birth chart using classical Vedic astrology principles (Lahiri Ayanamsa, Vimshottari Dasha system). Predictions are probabilistic tendencies rooted in planetary configurations — <strong style={{ color: 'var(--text-secondary)' }}>not absolute destiny</strong>. For life-altering decisions, always consult a qualified Jyotish practitioner. Free will and karma together shape your path.
          </div>
        </div>
      </div>

      {/* ── HERO PROFILE ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(10,12,22,0.98), rgba(20,24,50,0.98))',
        border: '1px solid rgba(234,179,8,0.2)', borderRadius: '16px', padding: '24px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold)' }}>{params.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Age {currentAge} • {params.gender === 'male' ? '♂ Male' : params.gender === 'female' ? '♀ Female' : '⊕ Other'}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lagna (Ascendant)</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#06b6d4' }}>{lagna.rasi.symbol} {lagnaSign}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Lord: {lagnaLord} in House {lagnaLordHouse}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Moon Sign & Nakshatra</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#c084fc' }}>{moon.rasi.symbol} {moonSign}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{moonNak.name} Nakshatra, Pada {moonNak.pada}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sun Sign</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#f97316' }}>{sun.rasi.symbol} {sunSign}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sun.nakshatra.name} Nakshatra</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Dasha</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold)' }}>{currentDasha?.lord || '—'} MD</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {currentAntar ? `${currentDasha?.lord}–${currentAntar.lord} AD` : '—'}<br/>
            {currentDasha ? `Ends: ${formatDate(currentDasha.end)}` : ''}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Yogas / Doshas</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
            {rajaYogaCount > 0 && <Tag text={`${rajaYogaCount} Raja Yogas`} type="gold" />}
            {hasGajakesari && <Tag text="Gajakesari" type="success" />}
            {isManglik && <Tag text="Manglik" type="warn" />}
            {hasKaalSarp && <Tag text="Kaal Sarp" type="danger" />}
            {rajaYogaCount === 0 && !hasGajakesari && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Standard chart</span>}
          </div>
        </div>
      </div>

      {/* ═══════════════ PART 1: CORE BIRTH CHART ═══════════════ */}
      <Section id="part1" icon={Star} title="Part 1: Core Birth Chart Analysis" subtitle="Lagna, Planetary Placements, Strengths & Yogas" defaultOpen={true}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Planetary House Positions */}
          <div>
            <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '13px', marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Sun size={14} /> Planetary Placements
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Object.entries(planetHouses).filter(([k]) => !['Uranus','Neptune','Pluto'].includes(k)).map(([planet, house]) => {
                const p = planets[planet];
                const str = planetStrengths[planet];
                return (
                  <div key={planet} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '7px 10px', borderRadius: '8px',
                    background: funcBenefics.includes(planet) ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${funcBenefics.includes(planet) ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)'}`
                  }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', minWidth: '60px' }}>{planet}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>H{house} • {p?.rasi?.name}</span>
                      {p?.isRetrograde && <span style={{ fontSize: '9px', color: '#f59e0b', fontWeight: 700 }}>℞</span>}
                    </div>
                    <span style={{ fontSize: '10px', color: strengthColor(str), fontWeight: 600 }}>{strengthLabel(str)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#06b6d4', fontSize: '13px', marginBottom: '10px' }}>🔭 Ascendant & Core Identity</div>
              <Row label="Lagna Sign" value={`${lagna.rasi.symbol} ${lagnaSign} — ${LAGNA_ELEMENT[lagnaSign]} element, ${lagnaSign === 'Aries' || lagnaSign === 'Cancer' || lagnaSign === 'Libra' || lagnaSign === 'Capricorn' ? 'Movable (Chara)' : lagnaSign === 'Taurus' || lagnaSign === 'Leo' || lagnaSign === 'Scorpio' || lagnaSign === 'Aquarius' ? 'Fixed (Sthira)' : 'Dual (Dwiswabhava)'} sign`} highlight />
              <Row label="Lagna Lord" value={`${lagnaLord} placed in House ${lagnaLordHouse} (${HOUSE_SIGNIFICATION[lagnaLordHouse]}) — ${strengthLabel(planetStrengths[lagnaLord])}`} />
              <Row label="Moon Sign" value={`${moonSign} — Emotional nature: ${moonSign === 'Cancer' || moonSign === 'Pisces' || moonSign === 'Scorpio' ? 'deeply sensitive and intuitive' : moonSign === 'Leo' || moonSign === 'Sagittarius' || moonSign === 'Aries' ? 'bold, expressive and fiery' : moonSign === 'Taurus' || moonSign === 'Virgo' || moonSign === 'Capricorn' ? 'practical, grounded, reliable' : 'flexible, intellectual, communicative'}`} />
              <Row label="Janma Nakshatra" value={`${moonNak.name} (Pada ${moonNak.pada}) — Ruled by ${moonNak.lord}. Personality: ${NAKSHATRA_PERSONALITY[moonNak.name] || 'multifaceted and complex'}`} />
              <Row label="Retrograde Planets" value={retroPlanets.length ? retroPlanets.join(', ') + ' — internalised, karmic energy; past-life themes active' : 'None — straight forward planetary energy'} />
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#eab308', fontSize: '13px', marginBottom: '10px' }}>⭐ Yogas & Combinations</div>
              {hasGajakesari && <InfoBox type="gold">Gajakesari Yoga — Jupiter and Moon in Kendra (1st, 4th, 7th or 10th from each other): This powerful yoga bestows intelligence, wisdom, fame and prosperity. People with this combination are known for eloquence, leadership and humanitarian qualities.</InfoBox>}
              {isManglik && <InfoBox type="warn">Manglik Dosha — Mars in House {marsHouse}: This creates intensity in relationships and some delay or turbulence in marriage. However, marrying someone who is also Manglik neutralises this effect. Mars here also grants courage, assertiveness, and physical strength.</InfoBox>}
              {hasKaalSarp && <InfoBox type="danger">Kaal Sarp Dosha — All main planets appear hemmed between Rahu and Ketu axis: This indicates a karmic life with periodic setbacks followed by dramatic rises. Spiritual practice, Rahu-Ketu remedies (Nag panchami puja, serpent temple visits), and perseverance are key.</InfoBox>}
              {rajaYogaCount > 0 && <InfoBox type="success">{rajaYogaCount} Raja Yoga(s) Detected — Your chart contains royal combinations indicating authority, leadership, recognition and above-average success in your chosen field. These activate during their Dasha periods.</InfoBox>}
              <Row label="Functional Benefics" value={funcBenefics.join(', ') + ` — these planets are your chart's friends for ${lagnaSign} Lagna`} />
            </div>
          </div>
        </div>

        <InfoBox type="note">
          Life Theme: As a <strong>{lagnaSign} Lagna</strong> person with <strong>{moonSign} Moon</strong> in <strong>{moonNak.name} Nakshatra</strong>, your life theme revolves around <em>{NAKSHATRA_PERSONALITY[moonNak.name] || 'multifaceted expression'}</em>. Your soul's purpose is shaped by {lagnaLord} (your chart ruler) placed in House {lagnaLordHouse}, which governs {HOUSE_SIGNIFICATION[lagnaLordHouse]}. This makes those life areas your primary arena of growth, achievement and karmic resolution.
        </InfoBox>
      </Section>

      {/* ═══════════════ PART 2: PAST LIFE & PATTERNS ═══════════════ */}
      <Section id="part2" icon={ScrollText} title="Part 2: Past Life & Karmic Patterns" subtitle="Repeating life themes, childhood patterns, soul lessons" color="var(--cyan)">
        <Row label="Ketu Placement" value={`House ${planetHouses['Ketu']} (${HOUSE_SIGNIFICATION[planetHouses['Ketu']]}) — Ketu represents your past-life mastery and instinctive talents. You enter this life already skilled in matters of House ${planetHouses['Ketu']}, yet may feel dissatisfied or detached in that area.`} />
        <Row label="Rahu Placement" value={`House ${planetHouses['Rahu']} (${HOUSE_SIGNIFICATION[planetHouses['Rahu']]}) — Rahu shows the lesson this soul craves. Your deepest ambition and karmic hunger lies in House ${planetHouses['Rahu']}. This is where you grow most — and where obsession or overreach can also derail you.`} />
        <Row label="Saturn Placement" value={`House ${planetHouses['Saturn']} (${HOUSE_SIGNIFICATION[planetHouses['Saturn']]}) — Saturn represents karmic debts and areas requiring patient mastery. Delays and discipline here teach profound lessons. After Saturn Dasha or Sade Sati, these areas often become your strongest.`} />
        <Row label="Moon House" value={`House ${planetHouses['Moon']} — Your emotional foundation is anchored here. Childhood environment and maternal relationship strongly shaped your identity. ${[6,8,12].includes(planetHouses['Moon']) ? 'Moon in a dusthana house suggests emotional turbulence in early years — these experiences built deep resilience.' : 'Moon in a supportive house suggests an emotionally nurturing childhood foundation.'}`} />
        <Row label="Repeating Pattern" value={`${hasKaalSarp ? 'Kaal Sarp Dosha creates periodic cycles of rise-fall-rise. You may feel like life resets dramatically every 18 years.' : ''} ${isManglik ? 'Manglik patterns show past-life warrior energy — tendency toward conflict or early relationship turbulence that eventually builds strength.' : ''} ${retroPlanets.length ? `Retrograde planets (${retroPlanets.join(', ')}) indicate past-life incomplete karma — these themes feel familiar yet unresolved.` : 'No major retrograde afflictions — relatively clean karmic slate.'}`} />
        <Row label="Soul Lesson" value={`Your Rahu in ${rahu?.rasi?.name} (House ${planetHouses['Rahu']}) demands you master ${HOUSE_SIGNIFICATION[planetHouses['Rahu']]}. Your Ketu in ${ketu?.rasi?.name} (House ${planetHouses['Ketu']}) is where you must release excessive attachment and let karmic cycles complete naturally.`} />

        <InfoBox type="note">
          Childhood phase (ages 0–12): Governed by Moon placement in House {planetHouses['Moon']}. {[4,5,9].includes(planetHouses['Moon']) ? 'Supportive home environment with good parental influence.' : [6,8,12].includes(planetHouses['Moon']) ? 'Early emotional instability — possible health or family challenges in childhood that built character.' : 'Mixed childhood experiences — emotional learning through diverse situations.'}
          <br/><br/>
          Teenage phase (ages 12–21): {sunSign} Sun energy dominates this period — {['Aries','Leo','Sagittarius'].includes(sunSign) ? 'fiery, independent, and driven to prove oneself.' : ['Taurus','Virgo','Capricorn'].includes(sunSign) ? 'practical, focused, perhaps serious beyond your years.' : ['Gemini','Libra','Aquarius'].includes(sunSign) ? 'intellectually curious, social, exploring many paths at once.' : 'deeply sensitive, emotionally driven, with strong intuitive tendencies.'}
        </InfoBox>
      </Section>

      {/* ═══════════════ PART 3: CAREER ═══════════════ */}
      <Section id="part3" icon={Briefcase} title="Part 3: Career & Professional Life" subtitle="Best paths, business vs job, government, foreign, growth timeline">

        <Row label="Best Career Fields" value={careerFields.join(' | ')} highlight />
        <Row label="Job vs Business" value={
          [1,7,10].includes(planetHouses['Sun']) || [1,10].includes(planetHouses['Mars'])
            ? 'Strong entrepreneurial indicators — you can excel in business, self-employment or independent practice. Partnerships with complementary skillsets work well.'
            : [6,10].includes(planetHouses['Saturn']) || planetStrengths['Saturn'] === 'exalted'
              ? 'Job/service sector suits you well — structured organisations, government service, or climbing corporate ladders through discipline and patience.'
              : 'Balanced chart — you can succeed in both; consider starting with job to build expertise, then venture into consultancy or business.'
        } />
        <Row label="Government Job" value={
          ([1,4,9,10].includes(planetHouses['Sun']) && funcBenefics.includes('Sun'))
            ? '✅ Strong government job indicators — Sun well-placed is the primary karmic signature for government positions, authority, and public service.'
            : [10].includes(planetHouses['Saturn'])
              ? '✅ Saturn in 10th house supports government service, judiciary, or public sector roles — but expect slow, methodical advancement.'
              : '⚠️ Moderate prospects — focus on competitive exams during Sun or Jupiter Dasha for best results.'
        } />
        <Row label="Foreign Settlement" value={
          [9,12].includes(planetHouses['Rahu']) || [9,12].includes(planetHouses['Jupiter']) || seventhLordHouse === 12
            ? '✅ Strong foreign settlement or international work indicators — Rahu or Jupiter in 9th/12th, or 7th lord in 12th points to life abroad.'
            : [3,9,12].includes(planetHouses['Venus'])
              ? '⚠️ Moderate foreign travel/work — international connections will bring opportunities but permanent relocation is not strongly indicated.'
              : '❌ Limited foreign indicators in chart — build global skills; success is more likely through local roots.'
        } />
        <Row label="Leadership & Fame" value={
          rajaYogaCount >= 2
            ? `${rajaYogaCount} Raja Yogas indicate significant fame, authority and public recognition — particularly during activation Dasha periods.`
            : hasGajakesari
              ? 'Gajakesari Yoga grants intellectual fame and social respect — recognition through wisdom, teaching or public service.'
              : 'Moderate recognition potential — visibility improves significantly during Jupiter or Sun Mahadasha.'
        } />
        <Row label="Career Growth Timeline" value={`Early career (${currentAge < 28 ? 'you are in this phase now — ' : ''}22–30): Building foundations. Mid career (30–45): Peak productivity and growth. Senior phase (45+): Authority, leadership, institutional recognition.`} />
        <Row label="Hidden Talents" value={`${moonNak.name} Nakshatra (Lord: ${moonNak.lord}) grants: ${NAKSHATRA_PERSONALITY[moonNak.name] || 'versatile adaptable skills'}. ${lagnaSign === 'Gemini' || lagnaSign === 'Virgo' ? 'Exceptional analytical and communication gifts.' : lagnaSign === 'Scorpio' || lagnaSign === 'Pisces' ? 'Deep intuitive, research, and healing abilities.' : lagnaSign === 'Leo' || lagnaSign === 'Aries' ? 'Natural leadership magnetism and creative drive.' : 'Practical intelligence and capacity for long-term strategy.'}`} />

        <InfoBox type="success">
          <strong>Best Career Dasha Periods:</strong> {
            dashas.filter(d => funcBenefics.includes(d.lord) && ['Sun','Jupiter','Mercury','Venus','Mars'].includes(d.lord))
              .slice(0, 3)
              .map(d => {
                const ageS = getAge(birthDateObj, new Date(d.start));
                const ageE = getAge(birthDateObj, new Date(d.end));
                return `${d.lord} MD (Age ${ageS}–${ageE})`;
              }).join(' → ') || 'Consult detailed Dasha tab for timing'
          }
        </InfoBox>
      </Section>

      {/* ═══════════════ PART 4: MONEY & WEALTH ═══════════════ */}
      <Section id="part4" icon={DollarSign} title="Part 4: Money & Wealth" subtitle="Wealth potential, gains, investments, property, financial timeline">

        <div style={{ background: `rgba(${wealth.color === '#10b981' ? '16,185,129' : wealth.color === '#06b6d4' ? '6,182,212' : wealth.color === '#eab308' ? '234,179,8' : '239,68,68'},0.08)`, border: `1px solid ${wealth.color}33`, borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: wealth.color }}>{wealth.label}</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{wealth.desc}</div>
        </div>

        <Row label="2nd Lord (Wealth)" value={`${secondLord} is lord of your 2nd house (money, savings) — ${strengthLabel(planetStrengths[secondLord])}. ${planetStrengths[secondLord] === 'exalted' ? 'Excellent wealth accumulation through self-earned efforts.' : planetStrengths[secondLord] === 'debilitated' ? 'Financial discipline is critical — tendency toward losses if investments are speculative.' : 'Moderate and steady wealth growth through sustained effort.'}`} />
        <Row label="11th Lord (Gains)" value={`${eleventhLord} is lord of your 11th house (income, gains) — ${strengthLabel(planetStrengths[eleventhLord])}. ${planetStrengths[eleventhLord] === 'exalted' ? 'Multiple income sources and fulfilment of desires.' : 'Gains come through networking, focus, and right-time effort.'}`} />
        <Row label="Property & Real Estate" value={`${[1,4,7,10].includes(planetHouses['Mars']) ? '✅ Mars in Kendra: Good property accumulation potential, especially after age 30.' : '⚠️ Moderate property prospects — Mars not in angular house. Real estate gains possible but not automatic.'}. Jupiter in House ${planetHouses['Jupiter']}: ${[2,5,9,11].includes(planetHouses['Jupiter']) ? 'Favourable for wealth through stocks, gold, or land.' : 'Moderate luck with investments — prefer fixed deposits and real estate over speculation.'}`} />
        <Row label="Sudden Wealth / Losses" value={
          hasKaalSarp ? '⚠️ Kaal Sarp: Sudden windfalls possible but equally sudden losses — maintain liquid savings, avoid over-leveraging.'
            : [8,11].includes(planetHouses['Jupiter']) ? '✅ Jupiter in 8th/11th: Unexpected gains through inheritance, partner\'s money or bonus income possible.'
              : 'No major sudden-wealth combination — consistent savings and investment will outperform windfalls.'
        } />
        <Row label="Debt Risk" value={
          [6,12].includes(planetHouses['Saturn']) || planetStrengths['Saturn'] === 'debilitated'
            ? '⚠️ Saturn in 6th or 12th: Debt can accumulate if not managed — avoid borrowing for depreciating assets. Consolidate debts before Saturn Dasha.'
            : 'Low-to-moderate debt risk — responsible financial habits will keep you clear of major liabilities.'
        } />
        <Row label="Best Age for Wealth" value={
          `Primary: ${getAge(birthDateObj, new Date(dashas.find(d => ['Jupiter','Venus'].includes(d.lord))?.start || now))}–${getAge(birthDateObj, new Date(dashas.find(d => ['Jupiter','Venus'].includes(d.lord))?.end || now))} years (${dashas.find(d => ['Jupiter','Venus'].includes(d.lord))?.lord || 'Jupiter/Venus'} Dasha). Secondary: Age 36–45 is typically the most financially productive decade for most charts.`
        } />
        <InfoBox type="note">
          Financial tip specific to your chart: {lagnaSign === 'Capricorn' || lagnaSign === 'Taurus' || lagnaSign === 'Virgo' ? 'Earth sign Lagna: You excel with long-term, stable investments — mutual funds, real estate and fixed income suit your temperament.' : lagnaSign === 'Aries' || lagnaSign === 'Leo' || lagnaSign === 'Sagittarius' ? 'Fire sign Lagna: High earning potential but impulsive spending risk — build automated savings before spending.' : lagnaSign === 'Gemini' || lagnaSign === 'Libra' || lagnaSign === 'Aquarius' ? 'Air sign Lagna: Multiple income streams are natural — diversify investments and protect against scattered spending.' : 'Water sign Lagna: Emotional decisions around money can lead to poor investments — partner with a trusted financial advisor.'}
        </InfoBox>
      </Section>

      {/* ═══════════════ PART 5: LOVE LIFE ═══════════════ */}
      <Section id="part5" icon={Heart} title="Part 5: Love Life & Relationships" subtitle="Romance patterns, compatibility, breakup tendencies, timing" color="var(--cyan)">

        <Row label="Love vs Arranged Marriage" value={
          [5,7].includes(planetHouses['Venus']) || [5,7].includes(planetHouses['Moon'])
            ? '✅ Love marriage clearly indicated — Venus or Moon in 5th/7th shows romantic attraction and emotional bonds preceding marriage.'
            : planetHouses['Venus'] === 11 || planetHouses['Mars'] === 7
              ? '⚠️ Inter-caste or non-traditional relationship possible — strong romantic feelings but family approval may require effort.'
              : '✅ Arranged marriage more indicated — but subtle romantic attraction at first meeting is still likely.'
        } highlight />
        <Row label="Serious Relationship Timing" value={marriagePeriods.join(' | ')} />
        <Row label="Breakup Patterns" value={
          [6,8,12].includes(seventhLordHouse)
            ? '⚠️ 7th lord in dusthana: Past relationships may have ended painfully — karmic lessons about boundaries and self-worth in love.'
            : hasKaalSarp
              ? '⚠️ Kaal Sarp: Relationships may have a destined quality — people enter and exit your life at precise karmic moments.'
              : isManglik
                ? '⚠️ Manglik: Intensity in early relationships can create conflict — maturity in emotional expression reduces breakup risk significantly.'
                : 'Moderate — relationship patterns depend more on communication than chart afflictions.'
        } />
        <Row label="Emotional Compatibility" value={
          LAGNA_ELEMENT[lagnaSign] === 'Fire' ? 'Best with Fire/Air signs: Aries, Leo, Sagittarius, Gemini, Libra, Aquarius Moon partners. Clash possible with Water signs if emotional extremes are not balanced.'
          : LAGNA_ELEMENT[lagnaSign] === 'Earth' ? 'Best with Earth/Water signs: Taurus, Virgo, Capricorn, Cancer, Scorpio, Pisces Moon partners. Find water-sign partners grounding and nurturing.'
          : LAGNA_ELEMENT[lagnaSign] === 'Air' ? 'Best with Air/Fire signs: Gemini, Libra, Aquarius, Aries, Leo, Sagittarius Moon partners. Intellectual and communicative connection is essential.'
          : 'Best with Water/Earth signs: Cancer, Scorpio, Pisces, Taurus, Virgo, Capricorn Moon partners. Emotional depth and loyalty are what you deeply value.'
        } />
        <Row label="Type of Partner Drawn To" value={`${moonSign} Moon person typically attracts ${['Cancer','Scorpio','Pisces'].includes(moonSign) ? 'nurturing, emotionally available, sensitive partners' : ['Aries','Leo','Sagittarius'].includes(moonSign) ? 'confident, active, independent partners' : ['Taurus','Virgo','Capricorn'].includes(moonSign) ? 'stable, reliable, grounded partners' : 'intellectual, communicative, socially active partners'}.`} />
        <InfoBox type="note">
          Karmic relationship lesson: Your Rahu in House {planetHouses['Rahu']} ({HOUSE_SIGNIFICATION[planetHouses['Rahu']]}) and Venus in House {planetHouses['Venus']} ({HOUSE_SIGNIFICATION[planetHouses['Venus']]}) together reveal the karmic theme in love: {[5,7].includes(planetHouses['Rahu']) ? 'You seek a soulmate connection — but must learn that love is not possession. Obsession in relationships leads to karmic entanglement.' : [12].includes(planetHouses['Venus']) ? 'Secret relationships or spiritually-connected partners are karmically indicated — seek depth, not convenience in love.' : 'Relationships serve as mirrors of your own growth — what you seek in a partner reflects what you must develop within yourself.'}
        </InfoBox>
      </Section>

      {/* ═══════════════ PART 6: MARRIAGE & SPOUSE ═══════════════ */}
      <Section id="part6" icon={Users} title="Part 6: Marriage & Spouse" subtitle="Spouse nature, profession, marriage quality, timing, red flags">

        <Row label="7th House Sign" value={`${seventhSign} — The sign of your 7th house describes the general nature of your spouse and the quality of your married life.`} highlight />
        <Row label="Spouse Personality" value={
          seventhSign === 'Aries' ? 'Energetic, independent, action-oriented, possibly in competitive/athletic field' :
          seventhSign === 'Taurus' ? 'Stable, artistic, materialistic, comfort-loving, patient' :
          seventhSign === 'Gemini' ? 'Intellectual, witty, communicative, possibly in media/writing/IT' :
          seventhSign === 'Cancer' ? 'Nurturing, emotionally sensitive, home-loving, traditional' :
          seventhSign === 'Leo' ? 'Confident, ambitious, leadership qualities, possibly in creative/management field' :
          seventhSign === 'Virgo' ? 'Analytical, detail-oriented, service-minded, possibly in healthcare/finance' :
          seventhSign === 'Libra' ? 'Diplomatic, artistic, balanced, socially graceful' :
          seventhSign === 'Scorpio' ? 'Intense, mysterious, deep, possibly in research/medicine/psychology' :
          seventhSign === 'Sagittarius' ? 'Philosophical, freedom-loving, possibly in education/law/travel' :
          seventhSign === 'Capricorn' ? 'Ambitious, disciplined, career-focused, practical and goal-oriented' :
          seventhSign === 'Aquarius' ? 'Unconventional, humanitarian, possibly in technology/social work' :
          'Imaginative, spiritual, compassionate, possibly in arts/healing/spirituality'
        } />
        <Row label="7th Lord in House" value={`${seventhLordName} in House ${seventhLordHouse} — ${
          seventhLordHouse === 7 ? 'Excellent: Spouse will bring prosperity, balance and devotion.' :
          seventhLordHouse === 1 ? 'Spouse closely aligned with your identity — deeply devoted, possibly similar background.' :
          seventhLordHouse === 2 ? 'Marriage will increase family wealth and financial comfort.' :
          seventhLordHouse === 5 ? 'Love or past connection before marriage likely; children will be gifted.' :
          seventhLordHouse === 9 ? 'Spouse will be highly religious, lucky, and bring fortune into your life.' :
          seventhLordHouse === 10 ? 'Spouse will be career-oriented and help elevate your social status.' :
          seventhLordHouse === 11 ? 'Marriage fulfils desires and brings income through partnerships.' :
          seventhLordHouse === 4 ? 'Peaceful home life; domestic and family-loving spouse.' :
          seventhLordHouse === 3 ? 'Courageous, communicative spouse; short travels after marriage.' :
          seventhLordHouse === 8 ? 'Spouse interested in research or occult; inheritance from in-laws possible.' :
          seventhLordHouse === 6 ? 'Minor disputes possible; handle differences with patience. Health of spouse needs attention.' :
          'Spiritual or foreign-connected spouse; calm, mature relationship; expenditure through spouse.'
        }`} />
        <Row label="Best Marriage Period" value={marriagePeriods.slice(0,2).join(' or ')} />
        <Row label="Marriage Stability" value={
          planetStrengths[seventhLordName] === 'exalted'
            ? '✅ Very stable — 7th lord exalted indicates a blessed, mutually supportive marriage.'
            : planetStrengths[seventhLordName] === 'debilitated'
              ? '⚠️ Challenges in marriage — 7th lord debilitated indicates possible incompatibility or ego clashes. Communication and patience are vital.'
              : hasKaalSarp
                ? '⚠️ Kaal Sarp can cause a destined-yet-challenging marriage dynamic — may marry late or go through a significant relationship test.'
                : isManglik && !([1,4,7,8,12].includes(seventhLordHouse))
                  ? '⚠️ Manglik influence: Choose partner wisely — matching with another Manglik or a spiritually evolved partner reduces friction.'
                  : `✅ Moderate to good stability — healthy marriage provided both partners respect each other's individuality.`
        } />
        <Row label="Red Flags Before Marriage" value={`${isManglik ? 'Get Manglik dosha assessment done professionally. ' : ''}${hasKaalSarp ? 'Perform Kaal Sarp puja before marriage. ' : ''}${planetStrengths[seventhLordName] === 'debilitated' ? 'Avoid rush decisions in love — haste leads to regret. ' : ''}Ensure compatibility of Moon signs (Rashi) and Nakshatra matching (Guna Milan ≥18/36 preferred). Never skip family introduction before commitment.`} />
      </Section>

      {/* ═══════════════ PART 7: HEALTH ═══════════════ */}
      <Section id="part7" icon={Activity} title="Part 7: Health & Well-Being" subtitle="Physical tendencies, mental health, risk periods, preventive guidance" color="var(--cyan)">

        {healthAreas.map((zone, i) => (
          <div key={i} style={{
            padding: '14px', borderRadius: '10px', marginBottom: '10px',
            background: zone.risk === 'high' ? 'rgba(239,68,68,0.04)' : zone.risk === 'moderate' ? 'rgba(245,158,11,0.04)' : 'rgba(16,185,129,0.04)',
            border: `1px solid ${zone.risk === 'high' ? 'rgba(239,68,68,0.2)' : zone.risk === 'moderate' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{zone.zone}</span>
              <Tag text={zone.risk.charAt(0).toUpperCase() + zone.risk.slice(1) + ' Risk'} type={zone.risk === 'high' ? 'danger' : zone.risk === 'moderate' ? 'warn' : 'success'} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{zone.note}</div>
          </div>
        ))}

        <Row label="Mental Health" value={
          [6,8,12].includes(planetHouses['Moon'])
            ? '⚠️ Moon in dusthana: Anxiety, overthinking and emotional turbulence are recurrent patterns. Mindfulness, therapy and spiritual practice are strongly recommended.'
            : planetStrengths['Moon'] === 'debilitated'
              ? '⚠️ Debilitated Moon (Scorpio): Deep emotional sensitivity — possible depressive episodes. Regular routine, hydration and creative expression are healing.'
              : moonNak.gana === 'Rakshasa'
                ? '⚠️ Rakshasa gana Moon: Intense emotional responses, difficulty accepting limitations. Meditation and shadow-work are valuable tools.'
                : '✅ Reasonably good mental health indicators — practice gratitude, maintain social connections and physical activity.'
        } />
        <Row label="Stress Triggers" value={`${lagnaSign === 'Virgo' || lagnaSign === 'Gemini' ? 'Perfectionism and overwork are your chief stress triggers — learn to delegate.' : lagnaSign === 'Scorpio' || lagnaSign === 'Cancer' ? 'Betrayal or emotional abandonment are your deepest stress triggers — work on boundaries.' : lagnaSign === 'Capricorn' || lagnaSign === 'Aquarius' ? 'Professional failure or loss of status triggers anxiety — build inner security independently of outcomes.' : 'Identity challenges and lack of recognition are stress triggers — build self-validation habits.'}`} />
        <Row label="Sensitive Health Ages" value={`${currentAge < 35 ? 'Current phase (up to 35): ' : ''}Saturn Sade Sati periods (check Saturn transit tab) and Rahu-Ketu Dasha transitions tend to be most physically challenging.`} />
        <InfoBox type="success">
          Preventive Approach: 1) Walk 30–45 min daily (rules Lagna body, House {1}). 2) Reduce {LAGNA_ELEMENT[lagnaSign] === 'Fire' ? 'spicy, oily foods and screen time before bed' : LAGNA_ELEMENT[lagnaSign] === 'Earth' ? 'heavy foods and sedentary lifestyle' : LAGNA_ELEMENT[lagnaSign] === 'Air' ? 'caffeine, irregular sleep and excessive worry' : 'cold foods, emotional eating and social isolation'}. 3) Annual health checkup especially for the areas identified above. 4) Spiritual practice (pranayama, mantra, meditation) significantly benefits the Lagna constitution.
        </InfoBox>
      </Section>

      {/* ═══════════════ PART 8: FAMILY ═══════════════ */}
      <Section id="part8" icon={Home} title="Part 8: Family & Personal Life" subtitle="Parents, siblings, children, karmic family themes, spiritual growth">

        <Row label="Relationship with Father" value={`Sun in House ${planetHouses['Sun']} — ${[1,4,9,10].includes(planetHouses['Sun']) ? 'Strong, supportive paternal influence. Father\'s career and status positively impact yours.' : [6,8,12].includes(planetHouses['Sun']) ? 'Complex relationship with father — distance, health issues or ego clashes possible. Finding your own authority independently is the healing path.' : 'Moderate — father is present but not deeply transformative. You largely forge your own path.'}`} />
        <Row label="Relationship with Mother" value={`Moon in House ${planetHouses['Moon']} — ${[1,4,7,10].includes(planetHouses['Moon']) ? 'Close, nurturing bond with mother. Strong maternal support throughout life.' : [6,8,12].includes(planetHouses['Moon']) ? 'Mother may have faced health or emotional challenges. You may feel emotionally unsupported at times — yet this built great inner self-reliance.' : 'Caring relationship — emotional connection deepens with age and mutual understanding.'}`} />
        <Row label="Siblings" value={`Mars in House ${planetHouses['Mars']} — ${[3].includes(planetHouses['Mars']) ? 'Strong relationship with siblings — they may be competitive but ultimately supportive. Joint ventures with siblings can succeed.' : [6,8].includes(planetHouses['Mars']) ? 'Sibling rivalry or conflict possible — competition or ego clashes. Maintain clear boundaries and separate finances.' : 'Normal sibling dynamics — cooperation outweighs conflict in the long run.'}`} />
        <Row label="Children Prospects" value={`Jupiter in House ${planetHouses['Jupiter']} — ${[1,2,5,7,9,11].includes(planetHouses['Jupiter']) ? '✅ Good children prospects — Jupiter in a supportive house blesses with children and their success. First child likely during Jupiter Dasha or Antardasha.' : [6,8].includes(planetHouses['Jupiter']) ? '⚠️ Delay in children or health-related concerns around conception — consult medical professionals early and perform relevant remedies.' : 'Moderate children prospects — children will come at the right time through natural progression.'}`} />
        <Row label="Spiritual Growth" value={`${[8,9,12].includes(planetHouses['Ketu']) || [12].includes(planetHouses['Jupiter']) ? 'Strong spiritual inclination — Ketu or Jupiter in spiritual houses indicates a soul drawn to deeper meaning beyond material success. Meditation, pilgrimage or guru guidance will be transformative.' : [9,12].includes(planetHouses['Moon']) ? 'Emotional spirituality — your faith deepens through personal hardships and service to others.' : 'Practical spirituality — you engage with faith through rituals, festivals and family tradition rather than renunciation.'}`} />
        <InfoBox type="gold">
          Family Karma Pattern: {hasKaalSarp ? 'Kaal Sarp Dosha often indicates an ancestral karma requiring resolution through service, pitra tarpan rituals, or healing of family lineage.' : planetHouses['Saturn'] <= 4 ? 'Saturn in early houses suggests family responsibilities and duties arrived early in life — you carry family karma consciously.' : 'Your family karma is relatively light — focus on breaking negative generational patterns consciously through awareness and choice.'}
        </InfoBox>
      </Section>

      {/* ═══════════════ PART 9: FUTURE TIMELINE ═══════════════ */}
      <Section id="part9" icon={Calendar} title="Part 9: Future Timeline & Year-wise Predictions" subtitle="Dasha periods, 2026–2027 forecast, best and caution years" color="var(--cyan)" defaultOpen={false}>

        <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '13px', marginBottom: '12px' }}>📅 Current Dasha Status</div>
        {currentDasha && (
          <>
            <Row label="Current Mahadasha" value={`${currentDasha.lord} Mahadasha — Ends ${formatDate(currentDasha.end)} (Age ${getAge(birthDateObj, new Date(currentDasha.end))})`} highlight />
            {currentAntar && <Row label="Current Antardasha" value={`${currentDasha.lord}–${currentAntar.lord} — Active until ${formatDate(currentAntar.end)}`} />}
            <Row label="Dasha Theme" value={DASHA_RESULTS[currentDasha.lord]?.career || '—'} />
            <Row label="Dasha — Wealth" value={DASHA_RESULTS[currentDasha.lord]?.wealth || '—'} />
            <Row label="Dasha — Health" value={DASHA_RESULTS[currentDasha.lord]?.health || '—'} />
            <Row label="Dasha — Relationships" value={DASHA_RESULTS[currentDasha.lord]?.relation || '—'} />
            {nextDasha && <Row label="Next Mahadasha" value={`${nextDasha.lord} Dasha — Begins ${formatDate(nextDasha.start)} (Age ${getAge(birthDateObj, new Date(nextDasha.start))})`} />}
          </>
        )}

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

        {/* 2026 */}
        <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '14px', marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Zap size={15} /> 2026 Prediction
          {dasha2026 && <Tag text={`${dasha2026.maha}–${dasha2026.antar} Dasha`} type="gold" />}
        </div>
        {dasha2026 ? (
          <>
            <InfoBox type="gold">{forecast2026.summary}</InfoBox>
            <Row label="Career (2026)" value={forecast2026.career} />
            <Row label="Wealth (2026)" value={forecast2026.wealth} />
            <Row label="Health (2026)" value={forecast2026.health} />
            <Row label="Relationships (2026)" value={forecast2026.relation} />
            <Row label="Major Opportunity" value={funcBenefics.includes(dasha2026.maha) ? `✅ ${dasha2026.maha} is a functional benefic for your ${lagnaSign} Lagna — this year has high probability of significant positive development in career and personal life.` : `⚠️ ${dasha2026.maha} is a mixed or challenging planet for ${lagnaSign} Lagna — results require persistent effort; do not expect quick shortcuts.`} />
            <Row label="Caution Zone" value={hasKaalSarp ? 'Rahu-Ketu transits in 2026 could trigger karmic events — avoid impulsive decisions in March–May and October–November.' : isManglik ? 'Mars transiting sensitive houses (check Saturn transit view) can create friction in relationships — stay patient.' : 'General caution: Avoid major financial commitments without thorough due diligence in any year.'} />
          </>
        ) : <InfoBox type="note">2026 falls outside available Dasha calculation range for this birth date.</InfoBox>}

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

        {/* 2027 */}
        <div style={{ fontWeight: 700, color: '#06b6d4', fontSize: '14px', marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Zap size={15} /> 2027 Prediction
          {dasha2027 && <Tag text={`${dasha2027.maha}–${dasha2027.antar} Dasha`} type="info" />}
        </div>
        {dasha2027 ? (
          <>
            <InfoBox type="note">{forecast2027.summary}</InfoBox>
            <Row label="Career (2027)" value={forecast2027.career} />
            <Row label="Wealth (2027)" value={forecast2027.wealth} />
            <Row label="Health (2027)" value={forecast2027.health} />
            <Row label="Relationships (2027)" value={forecast2027.relation} />
            <Row label="Best Months (2027)" value="Jupiter transits and Dasha-lord Navamsa activations tend to yield the best results — generally Mar–Apr and Sep–Oct are powerful months for most charts." />
            <Row label="Difficult Months (2027)" value="Saturn–Mars mutual transits and eclipses can create turbulence — Jan and Jul are typically more challenging; avoid major decisions on eclipse days." />
          </>
        ) : <InfoBox type="note">2027 falls outside available Dasha calculation range for this birth date.</InfoBox>}

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

        {/* Upcoming Dasha overview */}
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px', marginBottom: '12px' }}>📊 Major Upcoming Planetary Periods</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {dashas.filter(d => new Date(d.end) > now).slice(0, 5).map(d => {
            const isFuture = new Date(d.start) > now;
            const isCurrent = !isFuture && new Date(d.end) > now;
            const ageS = getAge(birthDateObj, new Date(d.start));
            const ageE = getAge(birthDateObj, new Date(d.end));
            return (
              <div key={d.lord + d.start} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: '8px',
                background: isCurrent ? 'rgba(234,179,8,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isCurrent ? 'rgba(234,179,8,0.25)' : 'rgba(255,255,255,0.06)'}`
              }}>
                <div>
                  <span style={{ fontWeight: 700, color: isCurrent ? 'var(--gold)' : 'var(--text-primary)', fontSize: '13px' }}>{d.lord} Mahadasha</span>
                  {isCurrent && <Tag text="ACTIVE" type="gold" />}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {funcBenefics.includes(d.lord) ? '✅ Functional Benefic' : '⚠️ Mixed/Challenging'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  <div>Age {Math.max(0, ageS)}–{ageE}</div>
                  <div>{formatDate(d.start)} → {formatDate(d.end)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══════════════ PART 10: REMEDIES ═══════════════ */}
      <Section id="part10" icon={Sparkles} title="Part 10: Personalised Vedic Remedies" subtitle="Mantras, gemstones, donations, fasting, spiritual practices">

        <InfoBox type="warn">
          All remedies below are based on your Lagna Lord ({lagnaLord}) and chart patterns. Gemstones should ONLY be worn after consultation with a qualified Vedic astrologer who can verify your specific chart and current Dasha — wearing the wrong gemstone can worsen planetary effects. The practices below are universally safe.
        </InfoBox>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '16px' }}>
          {[
            { icon: '🕉️', title: 'Primary Mantra', value: lagnaRemedy.mantra },
            { icon: '💎', title: 'Gemstone', value: lagnaRemedy.gem },
            { icon: '🤲', title: 'Donation Remedy', value: lagnaRemedy.donation },
            { icon: '🌅', title: 'Fasting', value: lagnaRemedy.fast },
            { icon: '🛕', title: 'Temple Remedy', value: lagnaRemedy.temple },
            { icon: '🎨', title: 'Lucky Color', value: lagnaRemedy.color },
          ].map(r => (
            <div key={r.title} style={{
              padding: '14px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '6px' }}>{r.icon}</div>
              <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '12px', marginBottom: '6px' }}>{r.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{r.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{ fontWeight: 700, color: '#06b6d4', fontSize: '13px', marginBottom: '12px' }}>🧘 Universal Spiritual Practices</div>
          {[
            '🌅 Daily Surya Namaskar (12 rounds) at sunrise — strengthens Sun, Lagna, vitality and mental clarity',
            '📿 Chant Gayatri Mantra 108x at sunrise — purifies consciousness and opens intuition across all charts',
            `🌊 ${LAGNA_ELEMENT[lagnaSign] === 'Water' ? 'Sea or river bath on full moon days — exceptionally healing for your Water Lagna.' : LAGNA_ELEMENT[lagnaSign] === 'Earth' ? 'Walk barefoot on grass or earth for 20 min daily — grounds your Earth Lagna energy.' : LAGNA_ELEMENT[lagnaSign] === 'Fire' ? 'Light a ghee lamp (Diya) at sunset daily — purifies and calms Fire Lagna energy.' : 'Practice pranayama (Anulom Vilom) daily — balances and steadies Air Lagna energy.'}`,
            '🌿 Feed animals (crows for Saturn karma, fish for Rahu karma, cows for Moon karma) on their respective days',
            '📖 Read Bhagavad Gita (even one chapter daily) — the most universally effective Vedic remedy across all charts',
            hasKaalSarp ? '🐍 Visit Nageshwar or Trimbakeshwar Jyotirlinga temple and perform Kaal Sarp Shanti Puja for karmic relief' : '🙏 Ekadashi fast (11th day of lunar fortnight) — highly meritorious for Jupiter and spiritual elevation',
            '🪔 Light 5-faced lamp (Panchmukhi Diya) on Saturday evenings if Saturn is challenging in your chart'
          ].map((item, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: '8px', marginBottom: '6px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5'
            }}>{item}</div>
          ))}
        </div>
      </Section>

      {/* ═══════════════ PART 11: FINAL GUIDANCE ═══════════════ */}
      <Section id="part11" icon={BookOpen} title="Part 11: Final Life Guidance" subtitle="Biggest lesson, core purpose, destiny strengths, honest prediction" color="var(--cyan)" defaultOpen={true}>

        <Row label="Biggest Life Lesson" value={`${moonNak.name} Nakshatra soul comes to master: ${NAKSHATRA_PERSONALITY[moonNak.name] || 'the full spectrum of human experience'}. Your chart calls you to develop ${lagnaLord === 'Jupiter' ? 'wisdom, faith and expansive generosity' : lagnaLord === 'Saturn' ? 'discipline, patience and karmic responsibility' : lagnaLord === 'Mars' ? 'courage, action and constructive aggression' : lagnaLord === 'Venus' ? 'harmony, beauty and joyful relationships' : lagnaLord === 'Mercury' ? 'sharp intellect, clear communication and adaptability' : lagnaLord === 'Moon' ? 'emotional maturity, nurturing and intuitive wisdom' : 'creative authority, self-expression and leadership'}.`} highlight />
        <Row label="What To Avoid" value={`${isManglik ? 'Impulsive anger in relationships and overconfidence in confrontations. ' : ''}${hasKaalSarp ? 'Obsession with outcomes and resistance to life\'s periodic resets. ' : ''}${planetStrengths['Saturn'] === 'debilitated' ? 'Procrastination and avoiding responsibilities — Saturn\'s dues must be paid. ' : ''}${[6,8,12].includes(lagnaLordHouse) ? 'Self-sabotage, victimhood mentality, and isolation. ' : ''}Pride, comparison with others, and shortcuts that bypass genuine effort.`} />
        <Row label="What To Pursue" value={`${careerFields.slice(0,2).join(' or ')} aligns with your planetary blueprint. Invest deeply in ${['Cancer','Scorpio','Pisces'].includes(lagnaSign) ? 'emotional intelligence, spiritual depth and healing arts' : ['Aries','Leo','Sagittarius'].includes(lagnaSign) ? 'bold leadership, creative expression and inspiring others' : ['Taurus','Virgo','Capricorn'].includes(lagnaSign) ? 'systematic skill-building, financial security and professional excellence' : 'communication mastery, social networking and intellectual innovation'}.`} />
        <Row label="Destiny Strengths" value={`${hasGajakesari ? 'Gajakesari Yoga: Innate wisdom and eloquence that draws people to you. ' : ''}${rajaYogaCount > 0 ? `${rajaYogaCount} Raja Yoga(s): Destined for above-average achievement and recognition in your field. ` : ''}${moonNak.name} Nakshatra: ${NAKSHATRA_PERSONALITY[moonNak.name] || 'a uniquely gifted and resilient soul'}. These are not earned — they are your birthright. Use them.`} />
        <Row label="Karmic Purpose" value={`Your Rahu (soul's hunger) in House ${planetHouses['Rahu']} (${HOUSE_SIGNIFICATION[planetHouses['Rahu']]}) is your north star. Every major life lesson, relationship, career pivot and crisis will ultimately push you toward mastering this house's themes. This is not accidental — it is your chart's sacred design.`} />

        <div style={{
          marginTop: '20px', padding: '22px', borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(234,179,8,0.08), rgba(6,182,212,0.06))',
          border: '1px solid rgba(234,179,8,0.2)'
        }}>
          <div style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '15px', marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Award size={16} /> Honest Final Assessment — Without Sugarcoating
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p>Your chart shows a <strong>{rajaYogaCount > 1 ? 'distinctly above-average' : rajaYogaCount === 1 ? 'promising' : 'balanced'}</strong> life potential. You have {lagnaSign} Lagna giving you {LAGNA_ELEMENT[lagnaSign] === 'Fire' ? 'fire, ambition and drive' : LAGNA_ELEMENT[lagnaSign] === 'Earth' ? 'practicality, endurance and material sense' : LAGNA_ELEMENT[lagnaSign] === 'Air' ? 'intellect, adaptability and social skill' : 'depth, intuition and emotional resilience'} — these are genuine gifts, not flattery.</p>
            <p>The honest challenges: {hasKaalSarp ? 'Kaal Sarp Dosha creates cyclical life disruptions. Success will NOT be linear for you — accept this. Resilience and spiritual grounding are non-negotiable, not optional. ' : ''}{isManglik && planetStrengths['Mars'] !== 'exalted' ? 'Manglik energy, if unchecked, will damage relationships and create unnecessary conflict. Anger management is an essential life skill, not a luxury. ' : ''}{planetStrengths['Saturn'] === 'debilitated' ? 'Saturn debilitated will make discipline feel unnatural — yet consistency is exactly what your chart needs most. ' : ''}{[6,8,12].includes(lagnaLordHouse) ? 'Lagna lord in a dusthana house means life will require you to consciously choose growth over victimhood in difficult phases. ' : ''}The obstacles in your chart are your curriculum, not your punishment.</p>
            <p>The honest opportunities: You are in {currentDasha ? currentDasha.lord : '—'} Mahadasha — this period {funcBenefics.includes(currentDasha?.lord) ? 'is genuinely favourable for you. Use this window purposefully — act on career moves, investments and relationships now.' : 'requires patience and groundwork. Do not compare yourself to others. What you build now in silence will speak loudly in the next Dasha.'}.</p>
            <p style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
              🙏 Jai Jagannath — Remember: Jyotish (Vedic astrology) reveals tendencies in your cosmic blueprint, not a fixed fate. Your consciousness, choices, and daily habits can redirect even the most challenging planetary energies. This report is a compass, not a cage. Use it with wisdom.
            </p>
          </div>
        </div>
      </Section>

    </div>
  );
}
