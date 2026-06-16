import React, { useState } from 'react';
import { getVargaChartData, getVargaChartDataFromAPI, calculateVargaSign, ZODIAC_SIGNS } from '../utils/astrology';

const VARGA_DETAILS = [
  { value: 1, label: 'D-1 (Rasi Chart)' },
  { value: 2, label: 'D-2 (Hora)' },
  { value: 3, label: 'D-3 (Drekkana)' },
  { value: 4, label: 'D-4 (Chaturthamsa)' },
  { value: 7, label: 'D-7 (Saptamsa)' },
  { value: 9, label: 'D-9 (Navamsa)' },
  { value: 10, label: 'D-10 (Dasamsa)' },
  { value: 12, label: 'D-12 (Dwadasamsa)' },
  { value: 16, label: 'D-16 (Shodasamsa)' },
  { value: 20, label: 'D-20 (Vimsamsa)' },
  { value: 24, label: 'D-24 (Chaturvimsamsa)' },
  { value: 30, label: 'D-30 (Trimsamsa)' },
  { value: 60, label: 'D-60 (Shastyamsa)' }
];

const VARGA_GRID_LIST = [
  { value: 1, label: 'Rasi (D-1)' },
  { value: 9, label: 'Navamsa (D-9)' },
  { value: 30, label: 'Trimsamsa (D-30)' },
  { value: 3, label: 'Drekkana (D-3)' },
  { value: 10, label: 'Dasamsa (D-10)' },
  { value: 60, label: 'Shastyamsa (D-60)' },
  { value: 7, label: 'Saptamsa (D-7)' },
  { value: 12, label: 'Dwadasamsa (D-12)' },
  { value: 20, label: 'Vimsamsa (D-20)' },
  { value: 24, label: 'Siddhamsa (D-24)' },
  { value: 16, label: 'Shodashamsa (D-16)' },
  { value: 2, label: 'Hora (D-2)' }
];

const TRANSLATIONS = {
  en: {
    planets: { Lagna: 'As', Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke', Uranus: 'Ur', Neptune: 'Ne', Pluto: 'Pl' },
    signs: ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'],
    btn_south: 'South Indian',
    btn_north: 'North Indian',
    varga_label: 'Varga:',
    ayanamsa_label: 'Ayanamsa: Lahiri (Chitra Paksha)',
    grid_btn: '12 Vargas Grid',
    single_btn: 'Single Varga',
  },
  hi: {
    planets: { Lagna: 'लग्न', Sun: 'सू', Moon: 'चं', Mars: 'मं', Mercury: 'बु', Jupiter: 'गु', Venus: 'शु', Saturn: 'श', Rahu: 'रा', Ketu: 'के', Uranus: 'यू', Neptune: 'ने', Pluto: 'प्लू' },
    signs: ['मेष', 'वृष', 'मिथु', 'कर्क', 'सिंह', 'कन्य', 'तुला', 'वृश्चि', 'धनु', 'मकर', 'कुंभ', 'मीन'],
    btn_south: 'दक्षिण भारतीय',
    btn_north: 'उत्तर भारतीय',
    varga_label: 'वर्ग चक्र:',
    ayanamsa_label: 'अयनश: लाहिड़ी (चित्र पक्ष)',
    grid_btn: '१२ वर्ग ग्रिड',
    single_btn: 'एकल वर्ग चक्र',
  }
};

const VARGA_D1_TO_D12 = [
  { value: 1, label: 'Rasi (D-1)' },
  { value: 2, label: 'Hora (D-2)' },
  { value: 3, label: 'Drekkana (D-3)' },
  { value: 4, label: 'Chaturthamsa (D-4)' },
  { value: 7, label: 'Saptamsa (D-7)' },
  { value: 9, label: 'Navamsa (D-9)' },
  { value: 10, label: 'Dasamsa (D-10)' },
  { value: 12, label: 'Dwadasamsa (D-12)' }
];

export default function VedicChart({ planets, defaultVarga = 1, divisionalCharts, lang = 'en', showAllVargas = false }) {
  const [chartStyle, setChartStyle] = useState('south');
  const [activeVarga, setActiveVarga] = useState(defaultVarga);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'grid'

  if (!planets) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  const getPlanetCode = (pName, isRetro) => {
    const code = t.planets[pName] || pName.substring(0, 2);
    // Display retrograde planets in parentheses e.g. (Sa) or (श) to match JHora precisely
    return isRetro ? `(${code})` : code;
  };

  const southBoxMapping = [
    { sign: 11, r: 0, c: 0 }, { sign: 0, r: 0, c: 1 }, { sign: 1, r: 0, c: 2 }, { sign: 2, r: 0, c: 3 },
    { sign: 10, r: 1, c: 0 },                                                      { sign: 3, r: 1, c: 3 },
    { sign: 9,  r: 2, c: 0 },                                                      { sign: 4, r: 2, c: 3 },
    { sign: 8, r: 3, c: 0 }, { sign: 7, r: 3, c: 1 }, { sign: 6, r: 3, c: 2 }, { sign: 5, r: 3, c: 3 }
  ];

  // Helper to render planet badge inside cell
  const renderPlanetBadges = (planetList, size = 'normal') => (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: size === 'small' ? '2px' : '4px',
      justifyContent: 'center',
      padding: '2px'
    }}>
      {planetList.map((p, idx) => {
        const isLagna = p.isLagna || p.name === 'Ascendant' || p.name === 'Lagna' || p.name === 'Asc';
        const displayCode = getPlanetCode(p.name, p.isRetrograde && !isLagna);
        
        return (
          <span
            key={idx}
            style={{
              fontSize: size === 'small' ? '9px' : '11px',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              padding: size === 'small' ? '1px 3px' : '2px 5px',
              borderRadius: '4px',
              background: isLagna ? 'rgba(234,179,8,0.15)' : p.isRetrograde ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
              color: isLagna ? 'var(--gold)' : p.isRetrograde ? '#f87171' : 'var(--text-secondary)',
              border: isLagna ? '1px solid rgba(234,179,8,0.3)' : '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {displayCode}
          </span>
        );
      })}
    </div>
  );

  // South Indian Chart renderer
  const renderSouthIndianChart = (vargaNum, size = 'normal') => {
    const data = divisionalCharts
      ? getVargaChartDataFromAPI(divisionalCharts, vargaNum, planets)
      : getVargaChartData(planets, vargaNum);

    const cells = Array.from({ length: 4 }, () => Array(4).fill(null));
    southBoxMapping.forEach(({ sign, r, c }) => {
      cells[r][c] = {
        signIndex: sign,
        signName: t.signs[sign],
        planets: data[sign] || []
      };
    });

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '2px',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        width: '100%',
        aspectRatio: '1',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        {cells.map((row, r) =>
          row.map((cell, c) => {
            const isCenter = r > 0 && r < 3 && c > 0 && c < 3;
            if (isCenter) {
              if (r === 1 && c === 1) {
                return (
                  <div key="center" style={{
                    gridArea: '2/2/4/4',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'rgba(10,12,22,0.85)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <span style={{ fontSize: size==='small'?'9px':'12px', color: 'var(--text-muted)' }}>D-{vargaNum}</span>
                    <span style={{ fontSize: size==='small'?'8px':'10px', color: 'rgba(255,255,255,0.3)' }}>Lahiri</span>
                  </div>
                );
              }
              return null;
            }
            if (!cell) return <div key={`${r}-${c}`} style={{ background: '#0a0c16' }} />;
            const hasLagna = cell.planets.some(p => p.isLagna || p.name === 'Ascendant' || p.name === 'Lagna');
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  background: hasLagna ? 'rgba(234,179,8,0.02)' : '#070913',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: size === 'small' ? '2px' : '6px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: size==='small'?'8px':'10px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {cell.signName}
                  </span>
                  <span style={{ fontSize: size==='small'?'7px':'9px', color: 'rgba(255,255,255,0.15)' }}>
                    {cell.signIndex + 1}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  {renderPlanetBadges(cell.planets, size)}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  // North Indian Chart renderer
  const renderNorthIndianChart = (vargaNum, size = 'normal') => {
    const W = 420, H = 420;
    const data = divisionalCharts
      ? getVargaChartDataFromAPI(divisionalCharts, vargaNum, planets)
      : getVargaChartData(planets, vargaNum);

    const lagnaSignIndex = planets['Lagna']
      ? calculateVargaSign(planets['Lagna'].siderealLong, vargaNum)
      : 0;
    
    const houseSigns = Array.from({ length: 12 }, (_, i) => (lagnaSignIndex + i) % 12);

    const compartments = [
      { id: 1,  points: `${W/2},${H/2} ${W/4},${H/4} ${W/2},0 ${3*W/4},${H/4}`,                   labelX: W/2,      labelY: H/4-14,       textX: W/2,      textY: H/4+16, sign: houseSigns[0] },
      { id: 2,  points: `0,0 ${W/2},0 ${W/4},${H/4}`,                                              labelX: W/5,      labelY: H/9,          textX: W/4,      textY: H/8+14, sign: houseSigns[1] },
      { id: 3,  points: `0,0 0,${H/2} ${W/4},${H/4}`,                                              labelX: W/12,     labelY: H/4+8,        textX: W/8+8,    textY: H/4+28, sign: houseSigns[2] },
      { id: 4,  points: `0,${H/2} ${W/4},${H/4} ${W/2},${H/2} ${W/4},${3*H/4}`,                   labelX: W/4-14,   labelY: H/2,          textX: W/4,      textY: H/2+14, sign: houseSigns[3] },
      { id: 5,  points: `0,${H} 0,${H/2} ${W/4},${3*H/4}`,                                        labelX: W/12,     labelY: 3*H/4-8,      textX: W/8+8,    textY: 3*H/4+8, sign: houseSigns[4] },
      { id: 6,  points: `0,${H} ${W/2},${H} ${W/4},${3*H/4}`,                                     labelX: W/5,      labelY: H-H/9,        textX: W/4,      textY: 7*H/8-8, sign: houseSigns[5] },
      { id: 7,  points: `${W/2},${H/2} ${W/4},${3*H/4} ${W/2},${H} ${3*W/4},${3*H/4}`,            labelX: W/2,      labelY: 3*H/4+24,     textX: W/2,      textY: 3*H/4-10, sign: houseSigns[6] },
      { id: 8,  points: `${W},${H} ${W/2},${H} ${3*W/4},${3*H/4}`,                                 labelX: 4*W/5,    labelY: H-H/9,        textX: 3*W/4,    textY: 7*H/8-8, sign: houseSigns[7] },
      { id: 9,  points: `${W},${H} ${W},${H/2} ${3*W/4},${3*H/4}`,                                 labelX: 11*W/12,  labelY: 3*H/4-8,      textX: 7*W/8-8,  textY: 3*H/4+8, sign: houseSigns[8] },
      { id: 10, points: `${W},${H/2} ${3*W/4},${3*H/4} ${W/2},${H/2} ${3*W/4},${H/4}`,            labelX: 3*W/4+14, labelY: H/2,          textX: 3*W/4,    textY: H/2+14, sign: houseSigns[9] },
      { id: 11, points: `${W},0 ${W},${H/2} ${3*W/4},${H/4}`,                                      labelX: 11*W/12,  labelY: H/4+8,        textX: 7*W/8-8,  textY: H/4+28, sign: houseSigns[10] },
      { id: 12, points: `${W},0 ${W/2},0 ${3*W/4},${H/4}`,                                         labelX: 4*W/5,    labelY: H/9,          textX: 3*W/4,    textY: H/8+14, sign: houseSigns[11] }
    ];

    return (
      <div style={{
        width: '100%',
        aspectRatio: '1',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          {compartments.map(comp => {
            const planetsInSign = data[comp.sign] || [];
            return (
              <g key={comp.id}>
                <polygon
                  points={comp.points}
                  style={{
                    fill: comp.id === 1 ? 'rgba(234,179,8,0.03)' : '#070913',
                    stroke: 'rgba(255,255,255,0.08)',
                    strokeWidth: '1.5'
                  }}
                />
                <text x={comp.labelX} y={comp.labelY} textAnchor="middle" style={{ fontSize: '11px', fill: 'var(--text-muted)', fontWeight: 600 }}>
                  {comp.sign + 1}
                </text>
                <g transform={`translate(${comp.textX}, ${comp.textY})`}>
                  {planetsInSign.map((p, pIdx) => {
                    const isLagna = p.isLagna || p.name === 'Ascendant' || p.name === 'Lagna';
                    const displayCode = getPlanetCode(p.name, p.isRetrograde && !isLagna);
                    const rowH = size === 'small' ? 15 : 13;
                    const yPos = (pIdx - (planetsInSign.length - 1) / 2) * rowH;
                    return (
                      <text
                        key={pIdx}
                        x={0}
                        y={yPos}
                        textAnchor="middle"
                        style={{
                          fontSize: size === 'small' ? '12px' : '11px',
                          fontWeight: 700,
                          fontFamily: 'JetBrains Mono, monospace',
                          fill: isLagna ? 'var(--gold)' : p.isRetrograde ? '#f87171' : 'var(--text-secondary)'
                        }}
                      >
                        {displayCode}
                      </text>
                    );
                  })}
                </g>
              </g>
            );
          })}
          <line x1={0} y1={0} x2={W} y2={H} style={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: '2' }} />
          <line x1={W} y1={0} x2={0} y2={H} style={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: '2' }} />
          <polygon points={`${W/2},0 0,${H/2} ${W/2},${H} ${W},${H/2}`} style={{ fill: 'none', stroke: 'rgba(255,255,255,0.1)', strokeWidth: '2' }} />
          <circle cx={W/2} cy={H/2} r={size==='small'?14:18} style={{ fill: '#0a0c16', stroke: 'rgba(255,255,255,0.12)', strokeWidth: '1.5' }} />
          <text x={W/2} y={H/2+4} textAnchor="middle" style={{ fontSize: size==='small'?'8px':'10px', fill: 'var(--gold)', fontWeight: 700 }}>
            D-{vargaNum}
          </text>
        </svg>
      </div>
    );
  };

  if (showAllVargas) {
    return (
      <div className="card chart-card" style={{ width: '100%' }}>
        <div className="chart-header-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <h3 className="card-title text-gold" style={{ margin: 0, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{lang === 'en' ? 'Divisional Charts (D-1 to D-12)' : 'वर्गीय कुंडली चक्र (D-1 से D-12)'}</span>
          </h3>
          <div className="btn-toggle-group">
            <button onClick={() => setChartStyle('south')} className={`btn-toggle ${chartStyle === 'south' ? 'active' : ''}`}>
              {t.btn_south}
            </button>
            <button onClick={() => setChartStyle('north')} className={`btn-toggle ${chartStyle === 'north' ? 'active' : ''}`}>
              {t.btn_north}
            </button>
          </div>
        </div>

        {/* D-1 to D-12 Vargas Grid - stacks vertically on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          padding: '16px 0',
          width: '100%'
        }}>
          {VARGA_D1_TO_D12.map((vg) => (
            <div
              key={vg.value}
              style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                {lang === 'hi' && vg.label.includes('Rasi') ? 'राशि चक्र (D-1)' :
                 lang === 'hi' && vg.label.includes('Hora') ? 'होरा (D-2)' :
                 lang === 'hi' && vg.label.includes('Drekkana') ? 'द्रेष्काण (D-3)' :
                 lang === 'hi' && vg.label.includes('Chaturthamsa') ? 'चतुर्थांश (D-4)' :
                 lang === 'hi' && vg.label.includes('Saptamsa') ? 'सप्तांश (D-7)' :
                 lang === 'hi' && vg.label.includes('Navamsa') ? 'नवांश (D-9)' :
                 lang === 'hi' && vg.label.includes('Dasamsa') ? 'दशांश (D-10)' :
                 lang === 'hi' && vg.label.includes('Dwadasamsa') ? 'द्वादशांश (D-12)' : vg.label}
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                {chartStyle === 'south' ? renderSouthIndianChart(vg.value, 'small') : renderNorthIndianChart(vg.value, 'small')}
              </div>
            </div>
          ))}
        </div>

        <div className="chart-footer-info" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11px', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
          <span>{t.ayanamsa_label}</span>
          <span>{t.combust_info}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card chart-card">
      <div className="chart-header-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        
        {/* Toggle Grid vs Single */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setViewMode('single')}
            className={`btn-toggle ${viewMode === 'single' ? 'active' : ''}`}
            style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}
          >
            {t.single_btn}
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`btn-toggle ${viewMode === 'grid' ? 'active' : ''}`}
            style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}
          >
            {t.grid_btn}
          </button>
        </div>

        {/* Style selector */}
        <div className="btn-toggle-group">
          <button onClick={() => setChartStyle('south')} className={`btn-toggle ${chartStyle === 'south' ? 'active' : ''}`}>
            {t.btn_south}
          </button>
          <button onClick={() => setChartStyle('north')} className={`btn-toggle ${chartStyle === 'north' ? 'active' : ''}`}>
            {t.btn_north}
          </button>
        </div>

        {/* Single Varga Select dropdown */}
        {viewMode === 'single' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="select-label" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.varga_label}</span>
            <select
              value={activeVarga}
              onChange={e => setActiveVarga(parseInt(e.target.value))}
              className="styled-select"
              style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}
            >
              {VARGA_DETAILS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Viewport */}
      {viewMode === 'single' ? (
        <div className="chart-viewport" style={{ padding: '20px 0', minHeight: '380px' }}>
          {chartStyle === 'south' ? renderSouthIndianChart(activeVarga) : renderNorthIndianChart(activeVarga)}
        </div>
      ) : (
        /* 12 Vargas Grid - JHora Layout */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          padding: '16px 0'
        }}>
          {VARGA_GRID_LIST.map((vg) => (
            <div
              key={vg.value}
              style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '10px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                {vg.label}
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                {chartStyle === 'south' ? renderSouthIndianChart(vg.value, 'small') : renderNorthIndianChart(vg.value, 'small')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="chart-footer-info" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11px', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
        <span>{t.ayanamsa_label}</span>
        <span>{t.combust_info}</span>
      </div>
    </div>
  );
}
