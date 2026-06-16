import React from 'react';
import { ShieldAlert, Activity, CheckCircle2, Circle } from 'lucide-react';

export default function LongevityView({ longevity }) {
  if (!longevity) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No Longevity data available. Please fetch high-precision data first.
      </div>
    );
  }

  const {
    overall_assessment = {},
    checks_summary = {},
    baladrishta_checks = {},
    alpayu_checks = {},
    madhyayu_checks = {},
    calculation_basis = {},
    key_planetary_positions = {}
  } = longevity;

  const renderChecks = (categoryObject) => {
    if (!categoryObject || !categoryObject.checks) return null;
    
    // Sort so present indicators are first
    const sortedChecks = [...categoryObject.checks].sort((a, b) => {
      if (a.present === b.present) return a.id - b.id;
      return a.present ? -1 : 1;
    });

    return (
      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {categoryObject.category} ({categoryObject.present_count} / {categoryObject.total_count})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sortedChecks.map(check => (
            <div key={check.id} style={{ 
              padding: '10px 14px', 
              borderRadius: '6px', 
              background: check.present ? 'rgba(239, 68, 68, 0.02)' : 'var(--bg-card)',
              border: `1px solid ${check.present ? 'rgba(239, 68, 68, 0.15)' : 'var(--border-subtle)'}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <span style={{ marginTop: '2px' }}>
                {check.present ? (
                  <ShieldAlert style={{ width: 14, height: 14, color: 'var(--red)' }} />
                ) : (
                  <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                )}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: check.present ? 'var(--red)' : 'var(--text-primary)' 
                }}>
                  {check.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {check.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">Longevity & Lifespan Prediction</h3>
        <span className="subtitle">Ayurdaya Calculations & Life Span Indicators</span>
      </div>

      {/* Summary Card */}
      {overall_assessment && (
        <div style={{ 
          background: 'rgba(245, 158, 11, 0.05)', 
          border: '1px solid rgba(245, 158, 11, 0.2)', 
          borderRadius: '12px', 
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            background: 'var(--gold)',
            color: '#000',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            ⏳
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Assessed Lifespan Category</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--gold)', marginTop: '2px' }}>
              {overall_assessment.category_name}
            </div>
          </div>
        </div>
      )}

      {/* Key Factors */}
      {key_planetary_positions && (
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Activity size={14} style={{ color: 'var(--cyan)' }} /> Key Astronomical Coordinates
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {Object.entries(key_planetary_positions).map(([key, val]) => (
              <div key={key} style={{ padding: '8px 12px', background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key.replace('_', ' ')}:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Combinational Logic */}
      {calculation_basis && calculation_basis.combination_1 && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '10px' }}>
            Three-fold Combination Sign Analysis
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {calculation_basis.method}. Lifespan is judged by comparing pairs of parameters in fixed, movable, or dual signs.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[calculation_basis.combination_1, calculation_basis.combination_2, calculation_basis.combination_3].map((comb, i) => (
              <div key={i} style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  <span>{comb.name}</span>
                  <span style={{ color: 'var(--gold)' }}>{comb.result_category}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '10px', color: 'var(--text-muted)' }}>
                  {comb.lagna_lord && (
                    <>
                      <div>Lagna Lord: {comb.lagna_lord} ({comb.lagna_lord_sign})</div>
                      <div>8th Lord: {comb.eighth_lord} ({comb.eighth_lord_sign})</div>
                    </>
                  )}
                  {comb.ascendant_sign && comb.moon_sign && (
                    <>
                      <div>Ascendant Sign: {comb.ascendant_sign}</div>
                      <div>Moon Sign: {comb.moon_sign}</div>
                    </>
                  )}
                  {comb.ascendant_sign && comb.hora_lagna_sign && (
                    <>
                      <div>Ascendant Sign: {comb.ascendant_sign}</div>
                      <div>Hora Lagna Sign: {comb.hora_lagna_sign}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {calculation_basis.final_decision && (
              <div style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.02)', border: '1px dashed rgba(6, 182, 212, 0.3)', borderRadius: '8px', fontSize: '11px' }}>
                <strong>Final Calculation Decision:</strong> {calculation_basis.final_decision.logic} yielding <strong>{calculation_basis.final_decision.result}</strong>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Indicators */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Detailed Indicator Diagnostics
        </div>
        {renderChecks(baladrishta_checks)}
        {renderChecks(alpayu_checks)}
        {renderChecks(madhyayu_checks)}
      </div>
    </div>
  );
}
