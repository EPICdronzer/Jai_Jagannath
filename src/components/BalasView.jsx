import React from 'react';
import { translations } from '../utils/translations';

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const SHADBALA_ROW_LABELS = [
  { name: 'Sthana Bala (Positional)', desc: 'Strength based on zodiac placement' },
  { name: 'Dig Bala (Directional)', desc: 'Strength based on house directions' },
  { name: 'Kala Bala (Temporal)', desc: 'Strength based on time of day/night' },
  { name: 'Chesta Bala (Motional)', desc: 'Strength based on planetary speed/motion' },
  { name: 'Naisargika Bala (Natural)', desc: 'Inherent natural brightness/strength' },
  { name: 'Drik Bala (Aspect)', desc: 'Strength gained/lost from planetary aspects' }
];

const SHADBALA_ROW_LABELS_HI = [
  { name: 'स्थान बल (Positional)', desc: 'राशि चक्र में ग्रह के बैठने के स्थान पर आधारित बल' },
  { name: 'दिग् बल (Directional)', desc: 'दिशात्मक स्थिति (भाव दिशाओं) पर आधारित बल' },
  { name: 'काल बल (Temporal)', desc: 'समय (दिन/रात, पक्ष, तिथि आदि) पर आधारित बल' },
  { name: 'चेष्टा बल (Motional)', desc: 'ग्रह की गति और वक्रता पर आधारित बल' },
  { name: 'नैसर्गिक बल (Natural)', desc: 'ग्रह की स्वाभाविक दीप्ति और प्राकृतिक शक्ति' },
  { name: 'दृष्टि बल (Aspect)', desc: 'अन्य ग्रहों की दृष्टि (शुभ/अशुभ दृष्टि) से प्राप्त बल' }
];

export default function BalasView({ shadBala, bhavaBala, lang = 'en' }) {
  const translatePlanet = (name) => translations[lang]?.planets?.[name] || name;

  if (!shadBala && !bhavaBala) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        {lang === 'hi' 
          ? 'षडबल विवरण उपलब्ध नहीं है। कृपया पहले जन्म विवरण की गणना करें।' 
          : 'No strength details (Balas) available. Please fetch high-precision data first.'}
      </div>
    );
  }

  // Parse Bhava Bala strings
  const parsedBhavaBala = (bhavaBala || []).map((str, idx) => {
    const numbers = str.replace(/[\[\]]/g, '').trim().split(/\s+/).map(parseFloat);
    const houseLabel = lang === 'hi' ? `भाव ${idx + 1}` : `${idx + 1}${getOrdinalSuffix(idx + 1)} House`;
    return {
      house: houseLabel,
      shashtiamsas: numbers[0] || 0,
      rupas: numbers[1] || 0,
      ratio: numbers[2] || 0
    };
  });

  function getOrdinalSuffix(i) {
    var j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  }

  const rowLabels = lang === 'hi' ? SHADBALA_ROW_LABELS_HI : SHADBALA_ROW_LABELS;

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">
          {lang === 'hi' ? 'ग्रहों और भावों के बल (षडबल विश्लेषण)' : 'Planetary & Bhava Strengths (Balas)'}
        </h3>
        <span className="subtitle">
          {lang === 'hi' ? 'षडबल और भाव बल (Bhava Bala) का संपूर्ण विश्लेषण' : 'Shadbala & Bhava Bala Analysis'}
        </span>
      </div>

      {/* Shadbala Table */}
      {shadBala && shadBala.length >= 7 && (
        <div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
            {lang === 'hi' ? 'षडबल (ग्रहों के छह प्रकार के बल)' : 'Shadbala (Six-fold Source of Strength)'}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="astro-table" style={{ width: '100%', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>{lang === 'hi' ? 'बल के प्रकार' : 'Bala Category'}</th>
                  {PLANETS.map(p => (
                    <th key={p} style={{ textAlign: 'center' }}>{translatePlanet(p)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowLabels.map((row, rIdx) => (
                  <tr key={row.name}>
                    <td style={{ fontWeight: 600 }}>
                      <div>{row.name}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{row.desc}</div>
                    </td>
                    {PLANETS.map((_, pIdx) => (
                      <td key={pIdx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                        {shadBala[rIdx]?.[pIdx]?.toFixed(1) || '0.0'}
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Total Shadbala Shashtiamsas */}
                <tr style={{ borderTop: '2px solid var(--border-medium)', background: 'rgba(6, 182, 212, 0.03)' }}>
                  <td style={{ fontWeight: 'bold', color: 'var(--cyan)' }}>
                    {lang === 'hi' ? 'कुल षडबल (षष्ट्यंश / Shashtiamsas)' : 'Total Shadbala (Shashtiamsas)'}
                  </td>
                  {PLANETS.map((_, pIdx) => (
                    <td key={pIdx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: 'var(--cyan)' }}>
                      {shadBala[6]?.[pIdx]?.toFixed(1) || '0.0'}
                    </td>
                  ))}
                </tr>

                {/* Total Shadbala Rupas */}
                <tr style={{ background: 'rgba(6, 182, 212, 0.05)' }}>
                  <td style={{ fontWeight: 'bold', color: 'var(--cyan)' }}>
                    {lang === 'hi' ? 'कुल षडबल (रुप / Rupas)' : 'Total Shadbala (Rupas)'}
                  </td>
                  {PLANETS.map((_, pIdx) => (
                    <td key={pIdx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: 'var(--cyan)' }}>
                      {shadBala[7]?.[pIdx]?.toFixed(2) || '0.00'}
                    </td>
                  ))}
                </tr>

                {/* Shadbala Ratio */}
                <tr style={{ background: 'rgba(245, 158, 11, 0.05)' }}>
                  <td style={{ fontWeight: 'bold', color: 'var(--gold)' }}>
                    {lang === 'hi' ? 'बल अनुपात (वास्तविक/आवश्यक)' : 'Strength Ratio (Actual/Required)'}
                  </td>
                  {PLANETS.map((_, pIdx) => {
                    const val = shadBala[8]?.[pIdx] || 0;
                    return (
                      <td key={pIdx} style={{ 
                        textAlign: 'center', 
                        fontFamily: 'JetBrains Mono, monospace', 
                        fontWeight: 'bold', 
                        color: val >= 1.0 ? 'var(--emerald)' : 'var(--red)' 
                      }}>
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bhava Bala Table */}
      {parsedBhavaBala.length > 0 && (
        <div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
            {lang === 'hi' ? 'भाव बल (द्वादश भावों की शक्ति और बल)' : 'Bhava Bala (House Strength)'}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="astro-table" style={{ width: '100%', minWidth: '500px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>{lang === 'hi' ? 'भाव (House)' : 'House'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'hi' ? 'शक्ति (षष्ट्यंश / Shashtiamsas)' : 'Strength (Shashtiamsas)'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'hi' ? 'शक्ति (रुप / Rupas)' : 'Strength (Rupas)'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'hi' ? 'सापेक्ष शक्ति अनुपात' : 'Relative Strength Ratio'}</th>
                </tr>
              </thead>
              <tbody>
                {parsedBhavaBala.map((bhava, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{bhava.house}</td>
                    <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>{bhava.shashtiamsas.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>{bhava.rupas.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: 'var(--cyan)' }}>{bhava.ratio.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
