import React from 'react';
import { RotateCcw, Flame, TrendingUp, TrendingDown, Home, Heart, Swords } from 'lucide-react';

// ─── Astronomical Data Tables ────────────────────────────────────────────────

// Exaltation (Uccha) sign index — 0=Aries … 11=Pisces
const EXALTATION_SIGN = {
  Sun: 0,      // Aries
  Moon: 1,     // Taurus
  Mars: 9,     // Capricorn
  Mercury: 5,  // Virgo
  Jupiter: 3,  // Cancer
  Venus: 11,   // Pisces
  Saturn: 6,   // Libra
  Rahu: 1,     // Taurus (traditional Parashari)
  Ketu: 7,     // Scorpio (traditional Parashari)
};

// Debilitation (Neecha) sign — always opposite of exaltation
const DEBILITATION_SIGN = {
  Sun: 6,      // Libra
  Moon: 7,     // Scorpio
  Mars: 3,     // Cancer
  Mercury: 11, // Pisces
  Jupiter: 9,  // Capricorn
  Venus: 5,    // Virgo
  Saturn: 0,   // Aries
  Rahu: 7,     // Scorpio
  Ketu: 1,     // Taurus
};

// Own signs (Swakshetra)
const OWN_SIGNS = {
  Sun: [4],        // Leo
  Moon: [3],       // Cancer
  Mars: [0, 7],    // Aries, Scorpio
  Mercury: [2, 5], // Gemini, Virgo
  Jupiter: [8, 11],// Sagittarius, Pisces
  Venus: [1, 6],   // Taurus, Libra
  Saturn: [9, 10], // Capricorn, Aquarius
  Rahu: [],
  Ketu: [],
};

// Natural planetary friendship (Naisargika Maitri)
// 5 = great friend | 4 = friend | 3 = neutral | 2 = enemy | 1 = great enemy
const NATURAL_FRIENDSHIP = {
  Sun:     { Sun: 5, Moon: 4, Mars: 4, Mercury: 3, Jupiter: 4, Venus: 2, Saturn: 2 },
  Moon:    { Sun: 4, Moon: 5, Mars: 3, Mercury: 3, Jupiter: 3, Venus: 3, Saturn: 2 },
  Mars:    { Sun: 4, Moon: 3, Mars: 5, Mercury: 2, Jupiter: 4, Venus: 3, Saturn: 3 },
  Mercury: { Sun: 3, Moon: 2, Mars: 3, Mercury: 5, Jupiter: 3, Venus: 4, Saturn: 3 },
  Jupiter: { Sun: 4, Moon: 3, Mars: 4, Mercury: 2, Jupiter: 5, Venus: 2, Saturn: 3 },
  Venus:   { Sun: 2, Moon: 2, Mars: 3, Mercury: 4, Jupiter: 3, Venus: 5, Saturn: 4 },
  Saturn:  { Sun: 2, Moon: 2, Mars: 2, Mercury: 3, Jupiter: 3, Venus: 4, Saturn: 5 },
};

// Traditional sign rulers (Aries→Mars … Pisces→Jupiter)
const SIGN_RULERS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter',
];

// Combustion orbs (degrees from Sun, tropical longitude)
const COMBUST_ORB = {
  Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function angularDiff(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function computeStates(planets) {
  const r = {
    retrograde: [], combust: [], exalted: [], debilitated: [],
    ownSign: [], friendSign: [], enemySign: [],
  };

  const sunLong = planets['Sun']?.tropicalLong ?? 0;
  const MAIN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  for (const name of MAIN) {
    const p = planets[name];
    if (!p) continue;
    const ri = p.rasi.index;

    // Retrograde (Rahu/Ketu always technically retrograde — excluded from display)
    if (p.isRetrograde && name !== 'Rahu' && name !== 'Ketu') {
      r.retrograde.push(name);
    }

    // Combust — angular separation from Sun within orb
    if (name !== 'Sun' && name !== 'Rahu' && name !== 'Ketu') {
      const orb = COMBUST_ORB[name];
      if (orb !== undefined && angularDiff(p.tropicalLong, sunLong) <= orb) {
        r.combust.push(name);
      }
    }

    // Exalted
    if (EXALTATION_SIGN[name] !== undefined && EXALTATION_SIGN[name] === ri) {
      r.exalted.push(name);
    }

    // Debilitated
    if (DEBILITATION_SIGN[name] !== undefined && DEBILITATION_SIGN[name] === ri) {
      r.debilitated.push(name);
    }

    // Own Sign
    if (OWN_SIGNS[name]?.includes(ri)) {
      r.ownSign.push(name);
    }

    // Friend / Enemy sign (only 7 Graha, not nodes)
    const SAPTAGRAHA = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    if (SAPTAGRAHA.includes(name)) {
      const ruler = SIGN_RULERS[ri];
      if (ruler !== name && NATURAL_FRIENDSHIP[name]?.[ruler] !== undefined) {
        const score = NATURAL_FRIENDSHIP[name][ruler];
        if (score >= 4) r.friendSign.push(name);
        else if (score <= 2) r.enemySign.push(name);
        // score === 3 → neutral, not listed
      }
    }
  }

  return r;
}

// ─── Translation Maps ─────────────────────────────────────────────────────────

const PLANET_HI = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PlanetaryStatesView({ planets, lang = 'en' }) {
  if (!planets) return null;

  const states = computeStates(planets);
  const hi = lang === 'hi';
  const pName = (n) => hi ? (PLANET_HI[n] || n) : n;

  const sections = [
    {
      key: 'retrograde',
      icon: <RotateCcw size={15} />,
      title: hi ? 'वक्री' : 'Retrograde',
      desc: hi
        ? 'ग्रह प्रतिगामी गति में (आभासी पश्चगामी चाल)। ऊर्जा अंतर्मुखी होती है।'
        : 'Planets moving backward (apparent retrograde motion). Internalized energy.',
      color: '#f59e0b',
      border: 'rgba(245,158,11,0.40)',
      bg: 'rgba(245,158,11,0.055)',
      badge: 'rgba(245,158,11,0.18)',
    },
    {
      key: 'combust',
      icon: <Flame size={15} />,
      title: hi ? 'अस्त' : 'Combusted',
      desc: hi
        ? 'सूर्य के अत्यधिक निकट। ग्रह की दृश्यता एवं प्रभाव क्षीण हो जाता है।'
        : 'Too close to Sun. Weakened visibility and independent influence.',
      color: '#ef4444',
      border: 'rgba(239,68,68,0.35)',
      bg: 'rgba(239,68,68,0.04)',
      badge: 'rgba(239,68,68,0.18)',
    },
    {
      key: 'exalted',
      icon: <TrendingUp size={15} />,
      title: hi ? 'उच्च' : 'Exalted',
      desc: hi
        ? 'सर्वोच्च गरिमा। ग्रह की अधिकतम सकारात्मक अभिव्यक्ति।'
        : 'Highest dignity. Maximum positive expression of planetary energy.',
      color: '#22c55e',
      border: 'rgba(34,197,94,0.35)',
      bg: 'rgba(34,197,94,0.04)',
      badge: 'rgba(34,197,94,0.18)',
    },
    {
      key: 'debilitated',
      icon: <TrendingDown size={15} />,
      title: hi ? 'नीच' : 'Debilitated',
      desc: hi
        ? 'न्यूनतम गरिमा। ग्रह की अभिव्यक्ति में चुनौतियाँ आती हैं।'
        : 'Lowest dignity. Challenges in planetary expression. Neecha Bhanga can reverse.',
      color: '#f87171',
      border: 'rgba(248,113,113,0.40)',
      bg: 'rgba(248,113,113,0.05)',
      badge: 'rgba(248,113,113,0.18)',
    },
    {
      key: 'ownSign',
      icon: <Home size={15} />,
      title: hi ? 'स्वक्षेत्री' : 'Own Sign',
      desc: hi
        ? 'ग्रह अपनी स्वराशि में स्थित है। स्वाभाविक एवं सहज स्थान।'
        : 'Planet in its own ruled sign. Natural, comfortable placement.',
      color: '#38bdf8',
      border: 'rgba(56,189,248,0.30)',
      bg: 'rgba(56,189,248,0.04)',
      badge: 'rgba(56,189,248,0.18)',
    },
    {
      key: 'friendSign',
      icon: <Heart size={15} />,
      title: hi ? 'मित्र क्षेत्री' : 'Friend Sign',
      desc: hi
        ? 'ग्रह मित्र ग्रह की राशि में है। सहायक एवं अनुकूल वातावरण।'
        : 'Planet in a friendly sign. Supportive, cooperative environment.',
      color: '#a855f7',
      border: 'rgba(168,85,247,0.35)',
      bg: 'rgba(168,85,247,0.04)',
      badge: 'rgba(168,85,247,0.18)',
    },
    {
      key: 'enemySign',
      icon: <Swords size={15} />,
      title: hi ? 'शत्रु क्षेत्री' : 'Enemy Sign',
      desc: hi
        ? 'ग्रह शत्रु ग्रह की राशि में है। अभिव्यक्ति में बाधा।'
        : 'Planet in enemy sign. Challenging placement, hampered expression.',
      color: '#94a3b8',
      border: 'rgba(148,163,184,0.22)',
      bg: 'rgba(148,163,184,0.03)',
      badge: 'rgba(148,163,184,0.16)',
    },
  ];

  const interpretation = hi
    ? 'व्याख्या: ये ग्रह अवस्थाएँ यह निर्धारित करती हैं कि ग्रह अपनी ऊर्जा कैसे व्यक्त करते हैं। उच्च एवं स्वक्षेत्री स्थान अनुकूल होते हैं, नीच एवं शत्रु क्षेत्री स्थान चुनौतियाँ उत्पन्न करते हैं। वक्री ग्रह ऊर्जा को आंतरिक करते हैं। अस्त ग्रह सूर्य की समीपता के कारण दृश्यता खोते हैं किन्तु सौर ऊर्जा अर्जित करते हैं।'
    : 'Interpretation: These conditions significantly affect how planets express their energies. Exalted and own sign placements are generally favorable, while debilitated and enemy sign placements create challenges. Retrograde planets turn energy inward for reflection. Combusted planets near the Sun lose visible influence but gain solar power.';

  return (
    <div className="card" style={{ width: '100%', marginTop: '24px' }}>
      {/* Header */}
      <div className="card-header">
        <h3 className="card-title text-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>ⓘ</span>
          {hi ? 'ग्रह अवस्थाएँ एवं स्थितियाँ' : 'Planetary States & Conditions'}
        </h3>
        <span className="subtitle" style={{ color: 'rgba(245,158,11,0.5)' }}>
          {hi ? 'खगोलीय गणना पर आधारित वास्तविक परिणाम' : 'Real astronomical calculations — Lahiri Sidereal'}
        </span>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '14px',
        marginTop: '18px',
      }}>
        {sections.map((sec) => {
          const list = states[sec.key];
          return (
            <div
              key={sec.key}
              style={{
                padding: '16px 18px',
                borderRadius: '12px',
                border: `1px solid ${sec.border}`,
                background: sec.bg,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Title row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: sec.color, opacity: 0.9 }}>{sec.icon}</span>
                <span style={{
                  color: sec.color,
                  fontWeight: 700,
                  fontSize: '13.5px',
                  letterSpacing: '0.02em',
                }}>
                  {sec.title}
                </span>
              </div>

              {/* Description */}
              <p style={{
                margin: 0,
                fontSize: '11.5px',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
              }}>
                {sec.desc}
              </p>

              {/* Planet badges */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                minHeight: '26px',
                alignItems: 'center',
              }}>
                {list.length === 0 ? (
                  <span style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.2)',
                    fontStyle: 'italic',
                  }}>
                    {hi ? 'कोई नहीं' : 'None'}
                  </span>
                ) : (
                  list.map((pn) => (
                    <span
                      key={pn}
                      style={{
                        padding: '3px 11px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: sec.badge,
                        color: sec.color,
                        border: `1px solid ${sec.border}`,
                        letterSpacing: '0.03em',
                      }}
                    >
                      {pName(pn)}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interpretation footer */}
      <div style={{
        marginTop: '20px',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.025)',
        borderRadius: '8px',
        fontSize: '11.5px',
        color: 'var(--text-muted)',
        lineHeight: 1.65,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <strong style={{ color: 'rgba(255,255,255,0.45)', marginRight: '4px' }}>
          {hi ? 'व्याख्या:' : 'Interpretation:'}
        </strong>
        {hi
          ? ' ये ग्रह अवस्थाएँ यह निर्धारित करती हैं कि ग्रह अपनी ऊर्जा कैसे व्यक्त करते हैं। उच्च एवं स्वक्षेत्री स्थान अनुकूल होते हैं, नीच एवं शत्रु क्षेत्री स्थान चुनौतियाँ उत्पन्न करते हैं। वक्री ग्रह ऊर्जा को आंतरिक करते हैं। अस्त ग्रह सूर्य की समीपता के कारण दृश्यता खोते हैं किन्तु सौर ऊर्जा अर्जित करते हैं।'
          : ' These conditions significantly affect how planets express their energies. Exalted and own sign placements are generally favorable, while debilitated and enemy sign placements create challenges. Retrograde planets turn energy inward for reflection. Combusted planets near the Sun lose visible influence but gain solar power.'
        }
      </div>
    </div>
  );
}
