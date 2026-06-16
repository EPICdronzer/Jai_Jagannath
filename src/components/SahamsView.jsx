import React from 'react';
import { Compass, ShieldAlert } from 'lucide-react';

export default function SahamsView({ rawData }) {
  const sahams = rawData?.sahams;

  if (!sahams) {
    return (
      <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h3>Sahams data not loaded.</h3>
        <p style={{ marginTop: '8px', fontSize: '13px' }}>
          Please fill out the birth form and fetch high-precision data from the API first.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">Sahams (Vedic / Arabic Parts)</h3>
        <span className="subtitle">Sensitive mathematical points indicating specific life areas</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {Object.entries(sahams).map(([name, value]) => (
          <div key={name} style={{ 
            padding: '12px 16px', 
            background: 'var(--bg-hover)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--cyan)' }}>{name}</span>
            <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
