import React, { useState } from 'react';

const VARGA_LABELS = {
  'D-1': 'Rasi (D-1)',
  'D-2': 'Hora (D-2)',
  'D-3': 'Drekkana (D-3)',
  'D-4': 'Chaturthamsa (D-4)',
  'D-5': 'Panchamsa (D-5)',
  'D-6': 'Shashthamsa (D-6)',
  'D-7': 'Saptamsa (D-7)',
  'D-8': 'Ashtamsa (D-8)',
  'D-9': 'Navamsa (D-9)',
  'D-10': 'Dasamsa (D-10)',
  'D-11': 'Rudramsa (D-11)',
  'D-12': 'Dwadasamsa (D-12)',
  'D-16': 'Shodasamsa (D-16)',
  'D-20': 'Vimsamsa (D-20)',
  'D-24': 'Chaturvimsamsa (D-24)',
  'D-27': 'Nakshatramsa (D-27)',
  'D-30': 'Trimsamsa (D-30)',
  'D-40': 'Khavedamsa (D-40)',
  'D-45': 'Akshavedamsa (D-45)',
  'D-60': 'Shastiamsa (D-60)'
};

const ARUDHA_DESCS = {
  'AL': 'Arudha Lagna (Pada Lagna) - Represents image, status, and how the world perceives you.',
  'A2': 'Dhanarudha - Wealth, assets, financial standing, and material resources.',
  'A3': 'Bhatrarudha - Siblings, courage, initiatives, and communication abilities.',
  'A4': 'Matri Pada - Mother, domestic environment, happiness, properties, and vehicles.',
  'A5': 'Mantra Pada - Intelligence, children, creativity, memory, and devotion.',
  'A6': 'Roga Pada - Diseases, debts, enemies, obstacles, and service.',
  'A7': 'Dara Pada - Spouse, partnerships, business relationships, and public interactions.',
  'A8': 'Mrityu Pada - Longevity, transformations, vulnerability, and sudden changes.',
  'A9': 'Bhagya Pada - Fortune, father, higher education, guru, and dharma.',
  'A10': 'Karma Pada - Career, professional success, public duties, and achievements.',
  'A11': 'Labha Pada - Gains, elder siblings, social circle, and goals fulfillment.',
  'UL': 'Upapada Lagna (A12) - Marriage, spouse characteristics, and long-term commitments.'
};

export default function ArudhasView({ arudhaPadhas }) {
  const [selectedVarga, setSelectedVarga] = useState('D-1');

  if (!arudhaPadhas) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No Arudha Padha data available. Please fetch high-precision data first.
      </div>
    );
  }

  // Parse and group Arudha Padas
  const groupedPadhas = {};
  for (const [key, sign] of Object.entries(arudhaPadhas)) {
    // Key format is like "D-1-Arudha Lagna (AL)" or "D-9-Dhanarudha (A2)"
    const match = key.match(/^(D-\d+)-([^(]+)\(([^)]+)\)/);
    if (match) {
      const varga = match[1];
      const fullName = match[2].trim();
      const code = match[3].trim();
      
      if (!groupedPadhas[varga]) {
        groupedPadhas[varga] = [];
      }
      groupedPadhas[varga].push({
        fullName,
        code,
        sign,
        description: ARUDHA_DESCS[code] || ''
      });
    }
  }

  // Get list of available Vargas
  const availableVargas = Object.keys(groupedPadhas).sort((a, b) => {
    const numA = parseInt(a.replace('D-', ''));
    const numB = parseInt(b.replace('D-', ''));
    return numA - numB;
  });

  const currentPadhas = groupedPadhas[selectedVarga] || [];

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card-header flex-row justify-between">
        <div>
          <h3 className="card-title text-gold">Arudha Padas (Moota / Image Points)</h3>
          <span className="subtitle">Planetary House reflections of status & environment</span>
        </div>
        
        {/* Varga Dropdown */}
        <select 
          value={selectedVarga} 
          onChange={(e) => setSelectedVarga(e.target.value)}
          className="mini-input"
          style={{ width: 'auto', minWidth: '160px', colorScheme: 'dark' }}
        >
          {availableVargas.map(v => (
            <option key={v} value={v}>{VARGA_LABELS[v] || v}</option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="astro-table" style={{ width: '100%', minWidth: '500px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', width: '80px' }}>Pada Code</th>
              <th style={{ textAlign: 'left', width: '150px' }}>Name</th>
              <th style={{ textAlign: 'center', width: '100px' }}>Zodiac Sign Placement</th>
              <th style={{ textAlign: 'left' }}>Significance</th>
            </tr>
          </thead>
          <tbody>
            {currentPadhas.map(p => (
              <tr key={p.code}>
                <td style={{ fontWeight: 'bold', color: 'var(--cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{p.code}</td>
                <td style={{ fontWeight: 600 }}>{p.fullName}</td>
                <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--gold)' }}>{p.sign}</td>
                <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
