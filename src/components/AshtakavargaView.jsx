import React from 'react';

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const PLANET_ROW_NAMES = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Ascendant'
];

export default function AshtakavargaView({ ashtakavarga }) {
  if (!ashtakavarga) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No Ashtakavarga data available. Please fetch high-precision data first.
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

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">Ashtakavarga System</h3>
        <span className="subtitle">Planetary Bindus & Shodhya Pindas</span>
      </div>

      {/* Main Ashtakavarga Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="astro-table" style={{ width: '100%', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Sign / Planet</th>
              {SIGN_NAMES.map(s => (
                <th key={s} style={{ textAlign: 'center', fontSize: '11px' }}>{s.substring(0, 3)}</th>
              ))}
              <th style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 'bold' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {PLANET_ROW_NAMES.map((planet, pIdx) => {
              const rowData = binna_ashtaka_varga[pIdx] || Array(12).fill(0);
              const rowSum = rowData.reduce((a, b) => a + b, 0);
              return (
                <tr key={planet}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{planet}</td>
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
              <td style={{ fontWeight: 'bold', color: 'var(--gold)' }}>SAV (Samudhaya)</td>
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
            Shodhya Pinda Details
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="astro-table" style={{ width: '100%', minWidth: '500px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Pinda Type</th>
                  {PLANET_ROW_NAMES.slice(0, 7).map(p => (
                    <th key={p} style={{ textAlign: 'center' }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Rasi Pinda</td>
                  {rasi_pindas.map((val, idx) => (
                    <td key={idx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>{val}</td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Graha Pinda</td>
                  {graha_pindas.map((val, idx) => (
                    <td key={idx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>{val}</td>
                  ))}
                </tr>
                <tr style={{ background: 'rgba(6, 182, 212, 0.05)' }}>
                  <td style={{ fontWeight: 'bold', color: 'var(--cyan)' }}>Shodhya Pinda</td>
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
