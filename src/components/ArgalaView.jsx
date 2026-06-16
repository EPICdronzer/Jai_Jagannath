import React from 'react';
import { Compass, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';

export default function ArgalaView({ rawData }) {
  const houseRels = rawData?.house_relationships;
  const argala = houseRels?.argala;
  const virodhargala = houseRels?.virodhargala;

  if (!argala || !virodhargala) {
    return (
      <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h3>Argala & Virodhargala details not loaded.</h3>
        <p style={{ marginTop: '8px', fontSize: '13px' }}>
          Please fill out the birth form and fetch high-precision data from the API first.
        </p>
      </div>
    );
  }

  const signNames = Object.keys(argala);

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">Argala & Virodhargala</h3>
        <span className="subtitle">Planetary interventions (Argala) and obstructions (Virodhargala) on signs</span>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
        In Vedic astrology, <strong>Argala</strong> refers to planetary intervention that influences a house or sign, acting as a catalyst. 
        <strong>Virodhargala</strong> represents the counteraction or obstruction of that intervention.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table className="astro-table" style={{ width: '100%', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Zodiac Sign</th>
              <th style={{ textAlign: 'center', color: 'var(--cyan)' }}>Primary Argala (2H / 4H / 11H)</th>
              <th style={{ textAlign: 'center', color: 'var(--gold)' }}>Secondary Argala (5H)</th>
              <th style={{ textAlign: 'center', color: 'var(--red)' }}>Virodhargala (12H / 10H / 3H)</th>
            </tr>
          </thead>
          <tbody>
            {signNames.map(sign => {
              const argList = argala[sign] || [];
              const virList = virodhargala[sign] || [];
              
              // We can join the array elements
              const primaryArg = argList.slice(0, 3).filter(Boolean).join(', ') || 'None';
              const secondaryArg = argList[3] || 'None';
              const primaryVir = virList.slice(0, 4).filter(Boolean).join(', ') || 'None';

              return (
                <tr key={sign}>
                  <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{sign}</td>
                  <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: primaryArg !== 'None' ? 'bold' : 'normal' }}>
                    {primaryArg}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: secondaryArg !== 'None' ? 'bold' : 'normal' }}>
                    {secondaryArg}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--red)', fontWeight: primaryVir !== 'None' ? 'bold' : 'normal' }}>
                    {primaryVir}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
