import React from 'react';

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const SHADBALA_ROW_LABELS = [
  { name: 'Sthana Bala (Positional)', desc: 'Strength based on zodiac placement' },
  { name: 'Dig Bala (Directional)', desc: 'Strength based on house directions' },
  { name: 'Kala Bala (Temporal)', desc: 'Strength based on time of day/night' },
  { name: 'Chesta Bala (Motional)', desc: 'Strength based on planetary speed/motion' },
  { name: 'Naisargika Bala (Natural)', desc: 'Inherent natural brightness/strength' },
  { name: 'Drik Bala (Aspect)', desc: 'Strength gained/lost from planetary aspects' }
];

export default function BalasView({ shadBala, bhavaBala }) {
  if (!shadBala && !bhavaBala) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No strength details (Balas) available. Please fetch high-precision data first.
      </div>
    );
  }

  // Parse Bhava Bala strings
  const parsedBhavaBala = (bhavaBala || []).map((str, idx) => {
    const numbers = str.replace(/[\[\]]/g, '').trim().split(/\s+/).map(parseFloat);
    return {
      house: `${idx + 1}${getOrdinalSuffix(idx + 1)} House`,
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

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">Planetary & Bhava Strengths (Balas)</h3>
        <span className="subtitle">Shadbala & Bhava Bala Analysis</span>
      </div>

      {/* Shadbala Table */}
      {shadBala && shadBala.length >= 7 && (
        <div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Shadbala (Six-fold Source of Strength)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="astro-table" style={{ width: '100%', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Bala Category</th>
                  {PLANETS.map(p => (
                    <th key={p} style={{ textAlign: 'center' }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHADBALA_ROW_LABELS.map((row, rIdx) => (
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
                  <td style={{ fontWeight: 'bold', color: 'var(--cyan)' }}>Total Shadbala (Shashtiamsas)</td>
                  {PLANETS.map((_, pIdx) => (
                    <td key={pIdx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: 'var(--cyan)' }}>
                      {shadBala[6]?.[pIdx]?.toFixed(1) || '0.0'}
                    </td>
                  ))}
                </tr>

                {/* Total Shadbala Rupas */}
                <tr style={{ background: 'rgba(6, 182, 212, 0.05)' }}>
                  <td style={{ fontWeight: 'bold', color: 'var(--cyan)' }}>Total Shadbala (Rupas)</td>
                  {PLANETS.map((_, pIdx) => (
                    <td key={pIdx} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', color: 'var(--cyan)' }}>
                      {shadBala[7]?.[pIdx]?.toFixed(2) || '0.00'}
                    </td>
                  ))}
                </tr>

                {/* Shadbala Ratio */}
                <tr style={{ background: 'rgba(245, 158, 11, 0.05)' }}>
                  <td style={{ fontWeight: 'bold', color: 'var(--gold)' }}>Strength Ratio (Actual/Required)</td>
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
            Bhava Bala (House Strength)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="astro-table" style={{ width: '100%', minWidth: '500px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>House</th>
                  <th style={{ textAlign: 'center' }}>Strength (Shashtiamsas)</th>
                  <th style={{ textAlign: 'center' }}>Strength (Rupas)</th>
                  <th style={{ textAlign: 'center' }}>Relative Strength Ratio</th>
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
