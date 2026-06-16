import React, { useState } from 'react';
import { Calendar, HelpCircle, ShieldAlert, Sparkles, Moon, Compass } from 'lucide-react';

export default function SaturnTransitView({ saturnTransits }) {
  const [method, setMethod] = useState('sign'); // 'sign' or 'degree'

  if (!saturnTransits) {
    return (
      <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h3>Sade Sati & Saturn Transit analysis not loaded.</h3>
        <p style={{ marginTop: '8px', fontSize: '13px' }}>
          Please fill out the birth form and fetch high-precision data from the API first.
        </p>
      </div>
    );
  }

  const { sadeSati, moonTransits, ascendantTransits, ascendantSign, ascendantDegree } = saturnTransits;

  // Sign Based Sade Sati periods
  const signBasedPeriods = sadeSati?.signBased || [];
  // Degree Based Sade Sati periods
  const degreeBasedPeriods = sadeSati?.degreeBased || [];

  // Helper to determine if a period is currently running
  const isPeriodActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const renderSadeSatiTable = () => {
    const list = method === 'sign' ? signBasedPeriods : degreeBasedPeriods;
    if (list.length === 0) {
      return <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No periods calculated for this range.</div>;
    }

    return (
      <div style={{ overflowX: 'auto', marginTop: '16px' }}>
        <table className="astro-table" style={{ width: '100%', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Period</th>
              <th style={{ width: '100px' }}>Status</th>
              <th style={{ width: '220px' }}>Dates</th>
              <th>Description / Phases</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const active = isPeriodActive(p.startDate, p.endDate);
              return (
                <tr key={p.period} style={{ 
                  background: active ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                  borderLeft: active ? '3px solid var(--gold)' : 'none'
                }}>
                  <td style={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'JetBrains Mono' }}>{p.period}</td>
                  <td>
                    {active ? (
                      <span style={{ 
                        background: 'rgba(239, 68, 68, 0.15)', 
                        color: 'var(--red)', 
                        fontSize: '10px', 
                        padding: '3px 8px', 
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <ShieldAlert size={10} /> Active Now
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        {new Date(p.startDate) > new Date() ? 'Upcoming' : 'Completed'}
                      </span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                    <div style={{ fontWeight: 600 }}>{p.startDate}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>to {p.endDate}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: active ? 'var(--gold)' : 'var(--text-primary)' }}>
                      {p.description}
                    </div>
                    {method === 'sign' && (p.phase1 || p.phase2 || p.phase3) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px', paddingLeft: '8px', borderLeft: '1px solid var(--border-subtle)' }}>
                        {p.phase1 && (
                          <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Phase 1 (12H from Moon in {p.phase1.sign}):</span>
                            <span style={{ fontFamily: 'JetBrains Mono' }}>{p.phase1.startDate} to {p.phase1.endDate}</span>
                          </div>
                        )}
                        {p.phase2 && (
                          <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Phase 2 (1H from Moon in {p.phase2.sign}):</span>
                            <span style={{ fontFamily: 'JetBrains Mono' }}>{p.phase2.startDate} to {p.phase2.endDate}</span>
                          </div>
                        )}
                        {p.phase3 && (
                          <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Phase 3 (2H from Moon in {p.phase3.sign}):</span>
                            <span style={{ fontFamily: 'JetBrains Mono' }}>{p.phase3.startDate} to {p.phase3.endDate}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderOtherTransits = (transitData, title, icon) => {
    if (!transitData) return null;
    const { fourthHouse, eighthHouse } = transitData;

    const renderTransitRows = (houseData, houseName) => {
      const list = method === 'sign' ? houseData?.signBased : houseData?.degreeBased;
      if (!list || list.length === 0) return <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No periods</td></tr>;

      return list.map((p, index) => {
        const active = isPeriodActive(p.startDate, p.endDate);
        return (
          <tr key={index} style={{ 
            background: active ? 'rgba(6, 182, 212, 0.03)' : 'transparent',
            borderLeft: active ? '3px solid var(--cyan)' : 'none'
          }}>
            <td style={{ fontWeight: 600 }}>{houseName}</td>
            <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
              <div>{p.startDate}</div>
              <div style={{ color: 'var(--text-muted)' }}>to {p.endDate}</div>
            </td>
            <td>
              <div style={{ fontWeight: active ? 'bold' : 'normal', color: active ? 'var(--cyan)' : 'var(--text-primary)', fontSize: '12px' }}>
                {p.description}
              </div>
              {active && (
                <span style={{ 
                  background: 'rgba(6, 182, 212, 0.15)', 
                  color: 'var(--cyan)', 
                  fontSize: '9px', 
                  padding: '2px 6px', 
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  marginTop: '4px',
                  display: 'inline-block'
                }}>
                  Active
                </span>
              )}
            </td>
          </tr>
        );
      });
    };

    return (
      <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '14px' }}>
          {icon}
          {title}
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="astro-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '150px' }}>Transit Type</th>
                <th style={{ width: '200px' }}>Dates</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {renderTransitRows(fourthHouse, '4th House (Ardha-Ashtama)')}
              {renderTransitRows(eighthHouse, '8th House (Ashtama Shani)')}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Check if current Sade Sati is active
  const isSadeSatiActive = [...signBasedPeriods, ...degreeBasedPeriods].some(p => isPeriodActive(p.startDate, p.endDate));

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-header flex-row justify-between">
        <div>
          <h3 className="card-title text-gold">Saturn Transits & Sade Sati</h3>
          <span className="subtitle">Saturn's 7.5-year cycle (Sade Sati) and other critical transits</span>
        </div>
        
        {/* Toggle Calculation Mode */}
        <div className="btn-toggle-group">
          <button 
            onClick={() => setMethod('sign')} 
            className={`btn-toggle ${method === 'sign' ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: '11px' }}
          >
            Rasi Sign Based
          </button>
          <button 
            onClick={() => setMethod('degree')} 
            className={`btn-toggle ${method === 'degree' ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: '11px' }}
          >
            Exact Degree Based
          </button>
        </div>
      </div>

      {/* Sade Sati Overview Box */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: isSadeSatiActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: isSadeSatiActive ? 'var(--red)' : 'var(--emerald)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🪐
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sade Sati Status</div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: isSadeSatiActive ? 'var(--red)' : 'var(--emerald)' }}>
              {isSadeSatiActive ? 'Sade Sati is Active' : 'Sade Sati is Inactive'}
            </div>
          </div>
        </div>

        {signBasedPeriods.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              background: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--cyan)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              🌙
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Natal Moon Sign</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--cyan)' }}>
                {signBasedPeriods[0]?.referenceSign || 'Unknown'}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'rgba(245, 158, 11, 0.1)',
            color: 'var(--gold)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🧭
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ascendant Sign</div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--gold)' }}>
              {ascendantSign || 'Unknown'} ({ascendantDegree?.toFixed(2)}°)
            </div>
          </div>
        </div>
      </div>

      {/* Sade Sati Detailed Periods */}
      <div>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '8px' }}>
          <Calendar size={16} style={{ color: 'var(--gold)' }} />
          Sade Sati (Elapse Periods)
        </h4>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {method === 'sign' 
            ? 'Sign-based: calculated when Saturn transits the 12th, 1st, and 2nd houses from the natal Moon sign.' 
            : 'Degree-based: calculated as Saturn passes within ±45 degrees longitude from the natal Moon.'}
        </p>
        {renderSadeSatiTable()}
      </div>

      {/* Transits from Moon */}
      {renderOtherTransits(moonTransits, 'Saturn Transits from Moon (Ashtama / Kantaka Shani)', <Moon size={16} style={{ color: 'var(--cyan)' }} />)}

      {/* Transits from Ascendant */}
      {renderOtherTransits(ascendantTransits, 'Saturn Transits from Ascendant (Lagna)', <Compass size={16} style={{ color: 'var(--gold)' }} />)}

    </div>
  );
}
