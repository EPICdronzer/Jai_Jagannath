import React from 'react';
import { Award, AlertTriangle, ShieldCheck } from 'lucide-react';

function cleanHtml(str) {
  if (!str) return '';
  return str
    .replace(/<html>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function isDoshaPresent(str) {
  if (!str) return false;
  const t = str.toLowerCase();
  if (t.includes('there is no') || (t.includes('no ') && t.includes('dosha'))) {
    return false;
  }
  return (
    t.includes('there is ') && t.includes('dosha') ||
    t.includes('dosha is present') ||
    t.includes('following reasons')
  );
}

export default function YogasView({ yogas, doshas }) {
  if (!yogas && !doshas) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No Yogas or Doshas details available. Please fetch high-precision data first.
      </div>
    );
  }

  // Parse Yogas
  const yogaList = [];
  if (yogas && yogas.yoga_list) {
    for (const [key, val] of Object.entries(yogas.yoga_list)) {
      if (Array.isArray(val) && val.length >= 4) {
        yogaList.push({
          id: key,
          chart: val[0],
          name: val[1],
          condition: val[2],
          effects: val[3],
          type: 'general'
        });
      }
    }
  }

  const rajaYogaList = [];
  if (yogas && yogas.raja_yoga_list) {
    for (const [key, val] of Object.entries(yogas.raja_yoga_list)) {
      if (Array.isArray(val) && val.length >= 4) {
        rajaYogaList.push({
          id: key,
          chart: val[0],
          name: val[1],
          condition: val[2],
          effects: val[3],
          type: 'raja'
        });
      }
    }
  }

  // Parse Doshas
  const doshaList = [];
  if (doshas) {
    for (const [name, rawText] of Object.entries(doshas)) {
      const desc = cleanHtml(rawText);
      const present = isDoshaPresent(desc);
      doshaList.push({
        name,
        present,
        description: desc
      });
    }
  }

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">Yogas & Doshas Analysis</h3>
        <span className="subtitle">Detected Planetary Combinations & Afflictions</span>
      </div>

      {/* Yogas Summary */}
      {yogas?.summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--cyan)' }}>
              {yogas.summary.total_yogas_found}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Yogas Found</div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--gold)' }}>
              {yogas.summary.total_raja_yogas_found}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Raja Yogas Found</div>
          </div>
        </div>
      )}

      {/* Doshas Section */}
      <div>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <AlertTriangle style={{ width: 16, height: 16, color: 'var(--gold)' }} />
          Astrological Afflictions (Doshas)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {doshaList.map(dosha => (
            <div key={dosha.name} style={{ 
              padding: '14px', 
              borderRadius: '8px', 
              background: dosha.present ? 'rgba(239, 68, 68, 0.03)' : 'rgba(16, 185, 129, 0.03)',
              border: `1px solid ${dosha.present ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: dosha.present ? 'var(--red)' : 'var(--emerald)', fontSize: '14px' }}>
                  {dosha.name}
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  padding: '3px 8px', 
                  borderRadius: '4px',
                  fontWeight: 600,
                  background: dosha.present ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: dosha.present ? 'var(--red)' : 'var(--emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {dosha.present ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                  {dosha.present ? 'Present' : 'Not Present'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', whiteSpace: 'pre-line', margin: 0 }}>
                {dosha.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Yogas Section */}
      <div>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Award style={{ width: 16, height: 16, color: 'var(--cyan)' }} />
          Planetary Yogas ({yogaList.length + rajaYogaList.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '6px' }} className="custom-scrollbar">
          {rajaYogaList.map(yoga => (
            <div key={yoga.id} style={{ padding: '14px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--gold)', fontSize: '13px' }}>{yoga.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{yoga.chart} • Raja Yoga</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-primary)', marginBottom: '4px' }}><strong>Rule:</strong> {yoga.condition}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}><strong>Result:</strong> {yoga.effects}</div>
            </div>
          ))}
          
          {yogaList.map(yoga => (
            <div key={yoga.id} style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--cyan)', fontSize: '13px' }}>{yoga.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{yoga.chart}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-primary)', marginBottom: '4px' }}><strong>Rule:</strong> {yoga.condition}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}><strong>Result:</strong> {yoga.effects}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
