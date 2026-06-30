import React from 'react';
import { translations } from '../utils/translations';

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_NAMES_HI_SHORT = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'
];

const PLANET_ROW_NAMES = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Ascendant'
];

export default function AshtakavargaView({ ashtakavarga, lang = 'en' }) {
  const translatePlanet = (name) => {
    if (name === 'Ascendant') return lang === 'hi' ? 'लग्न' : 'Ascendant';
    return translations[lang]?.planets?.[name] || name;
  };

  if (!ashtakavarga) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        {lang === 'hi' 
          ? 'अष्टकवर्ग डेटा उपलब्ध नहीं है। कृपया पहले जन्म विवरण की गणना करें।' 
          : 'No Ashtakavarga data available. Please fetch high-precision data first.'}
      </div>
    );
  }

  const {
    binna_ashtaka_varga = [],
    samudhaya_ashtaka_varga = [],
    rasi_pindas = [],
    graha_pindas = [],
    sodhya_pindas = []
  } = ashtakavarga;

  const headerSigns = lang === 'hi' ? SIGN_NAMES_HI_SHORT : SIGN_NAMES;

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">
          {lang === 'hi' ? 'अष्टकवर्ग प्रणाली' : 'Ashtakavarga System'}
        </h3>
        <span className="subtitle">
          {lang === 'hi' ? 'ग्रहों के भिन्नाष्टकवर्ग बिंदु और शोध्य पिंड' : 'Planetary Bindus & Shodhya Pindas'}
        </span>
      </div>

      {/* Main Ashtakavarga Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="astro-table" style={{ width: '100%', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>{lang === 'hi' ? 'राशि / ग्रह' : 'Sign / Planet'}</th>
              {headerSigns.map((s, idx) => (
                <th key={idx} style={{ textAlign: 'center', fontSize: '11px' }}>
                  {lang === 'hi' ? s : s.substring(0, 3)}
                </th>
              ))}
              <th style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 'bold' }}>
                {lang === 'hi' ? 'योग' : 'Total'}
              </th>
            </tr>
          </thead>
          <tbody>
            {PLANET_ROW_NAMES.map((planet, pIdx) => {
              const rowData = binna_ashtaka_varga[pIdx] || Array(12).fill(0);
              const rowSum = rowData.reduce((a, b) => a + b, 0);
              return (
                <tr key={planet}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{translatePlanet(planet)}</td>
                  {rowData.map((val, sIdx) => (
                    <td key={sIdx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                      {val}
                    </td>
                  ))}
                  <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: 'var(--gold)' }}>
                    {rowSum}
                  </td>
                </tr>
              );
            })}
            
            {/* SAV Row */}
            <tr style={{ borderTop: '2px solid var(--border-medium)', background: 'rgba(245, 158, 11, 0.05)' }}>
              <td style={{ fontWeight: 'bold', color: 'var(--gold)' }}>
                {lang === 'hi' ? 'एस.ए.वी (सामुदायिक)' : 'SAV (Samudhaya)'}
              </td>
              {samudhaya_ashtaka_varga.map((val, sIdx) => (
                <td key={sIdx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: 'var(--gold)' }}>
                  {val}
                </td>
              ))}
              <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: 'var(--gold)' }}>
                {samudhaya_ashtaka_varga.reduce((a, b) => a + b, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Shodhya Pindas */}
      {rasi_pindas.length > 0 && (
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
            {lang === 'hi' ? 'शोध्य पिंड विवरण' : 'Shodhya Pinda Details'}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="astro-table" style={{ width: '100%', minWidth: '500px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>{lang === 'hi' ? 'पिंड प्रकार' : 'Pinda Type'}</th>
                  {PLANET_ROW_NAMES.slice(0, 7).map(p => (
                    <th key={p} style={{ textAlign: 'center' }}>{translatePlanet(p)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>{lang === 'hi' ? 'राशि पिंड' : 'Rasi Pinda'}</td>
                  {rasi_pindas.map((val, idx) => (
                    <td key={idx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>{val}</td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>{lang === 'hi' ? 'ग्रह पिंड' : 'Graha Pinda'}</td>
                  {graha_pindas.map((val, idx) => (
                    <td key={idx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>{val}</td>
                  ))}
                </tr>
                <tr style={{ background: 'rgba(6, 182, 212, 0.05)' }}>
                  <td style={{ fontWeight: 'bold', color: 'var(--cyan)' }}>{lang === 'hi' ? 'शोध्य पिंड' : 'Shodhya Pinda'}</td>
                  {sodhya_pindas.map((val, idx) => (
                    <td key={idx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: 'var(--cyan)' }}>{val}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
