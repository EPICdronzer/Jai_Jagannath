import React, { useState } from 'react';
import { getVargaChartData, getVargaChartDataFromAPI, calculateVargaSign, ZODIAC_SIGNS } from '../utils/astrology';

const VARGA_DETAILS = [
  { value: 1, label: 'D-1 (Rasi Chart)' },
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

const PLANET_SHORT_CODES = {
  Lagna: 'Asc',
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
  Uranus: 'Ur',
  Neptune: 'Ne',
  Pluto: 'Pl'
};

export default function VedicChart({ planets, defaultVarga = 1, divisionalCharts }) {
  const [chartStyle, setChartStyle] = useState('south');
  const [activeVarga, setActiveVarga] = useState(defaultVarga);

  if (!planets) return null;

  const chartData = divisionalCharts
    ? getVargaChartDataFromAPI(divisionalCharts, activeVarga, planets)
    : getVargaChartData(planets, activeVarga);

  const southBoxMapping = [
    { sign: 11, r: 0, c: 0 }, { sign: 0, r: 0, c: 1 }, { sign: 1, r: 0, c: 2 }, { sign: 2, r: 0, c: 3 },
    { sign: 10, r: 1, c: 0 },                                                      { sign: 3, r: 1, c: 3 },
    { sign: 9,  r: 2, c: 0 },                                                      { sign: 4, r: 2, c: 3 },
    { sign: 8, r: 3, c: 0 }, { sign: 7, r: 3, c: 1 }, { sign: 6, r: 3, c: 2 }, { sign: 5, r: 3, c: 3 }
  ];

  const renderPlanetBadges = (planetList) => (
    <div className="planet-badges-container">
      {planetList.map((p, idx) => (
        <span
          key={idx}
          className={`planet-badge font-mono ${p.isLagna ? 'badge-lagna' : p.isRetrograde ? 'badge-retro' : 'badge-regular'}`}
          title={`${p.name} - ${p.isLagna ? 'Ascendant' : p.isRetrograde ? 'Retrograde' : 'Direct'}`}
        >
          {PLANET_SHORT_CODES[p.name] || p.name}{p.isRetrograde && !p.isLagna ? '*' : ''}
        </span>
      ))}
    </div>
  );

  const renderSouthIndianChart = () => {
    const cells = Array.from({ length: 4 }, () => Array(4).fill(null));
    southBoxMapping.forEach(({ sign, r, c }) => {
      cells[r][c] = {
        signIndex: sign,
        signName: ZODIAC_SIGNS[sign].name,
        signSymbol: ZODIAC_SIGNS[sign].symbol,
        signHindi: ZODIAC_SIGNS[sign].hindi,
        planets: chartData[sign]
      };
    });

    return (
      <div className="south-chart-grid">
        {cells.map((row, r) =>
          row.map((cell, c) => {
            const isCenter = r > 0 && r < 3 && c > 0 && c < 3;
            if (isCenter) {
              if (r === 1 && c === 1) {
                return (
                  <div key="center" className="south-chart-center">
                    <span className="varga-subtitle">Divisional</span>
                    <span className="varga-title text-gold">D-{activeVarga}</span>
                    <span className="varga-ayanamsa">Lahiri</span>
                  </div>
                );
              }
              return null;
            }
            if (!cell) return <div key={`${r}-${c}`} className="empty-cell" />;
            const hasLagna = cell.planets.some(p => p.isLagna);
            return (
              <div key={`${r}-${c}`} className={`south-chart-cell ${hasLagna ? 'has-lagna' : ''}`}>
                <div className="cell-sign-header">
                  <span className="cell-sign-abbr">{cell.signName.substring(0, 3)}</span>
                  <span className="cell-sign-symbol">{cell.signSymbol}</span>
                </div>
                <div className="cell-planets-wrapper">
                  {renderPlanetBadges(cell.planets)}
                </div>
                <div className="cell-index">{cell.signIndex + 1}</div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderNorthIndianChart = () => {
    const W = 420, H = 420;
    const lagnaSignIndex = planets['Lagna']
      ? calculateVargaSign(planets['Lagna'].siderealLong, activeVarga)
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
      <div className="north-chart-container">
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
          {compartments.map(comp => {
            const planetsInSign = chartData[comp.sign] || [];
            return (
              <g key={comp.id}>
                <polygon points={comp.points} className={`house-polygon ${comp.id === 1 ? 'house-lagna' : ''}`} />
                <text x={comp.labelX} y={comp.labelY} textAnchor="middle" className="svg-sign-number">{comp.sign + 1}</text>
                <g transform={`translate(${comp.textX}, ${comp.textY})`}>
                  {planetsInSign.map((p, pIdx) => {
                    const rowH = 13;
                    const yPos = (pIdx - (planetsInSign.length - 1) / 2) * rowH;
                    return (
                      <text key={pIdx} x={0} y={yPos} textAnchor="middle"
                        className={p.isLagna ? 'svg-planet-lagna' : p.isRetrograde ? 'svg-planet-retro' : 'svg-planet-regular'}>
                        <title>{`${p.name} - ${p.isLagna ? 'Ascendant' : p.isRetrograde ? 'Retrograde' : 'Direct'}`}</title>
                        {PLANET_SHORT_CODES[p.name] || p.name}{p.isRetrograde && !p.isLagna ? '*' : ''}
                      </text>
                    );
                  })}
                </g>
              </g>
            );
          })}
          <line x1={0} y1={0} x2={W} y2={H} className="svg-frame-line" />
          <line x1={W} y1={0} x2={0} y2={H} className="svg-frame-line" />
          <polygon points={`${W/2},0 0,${H/2} ${W/2},${H} ${W},${H/2}`} className="svg-frame-polygon" />
          <circle cx={W/2} cy={H/2} r={18} className="svg-center-circle" />
          <text x={W/2} y={H/2+4} textAnchor="middle" className="svg-center-text">D-{activeVarga}</text>
        </svg>
      </div>
    );
  };

  return (
    <div className="card chart-card">
      <div className="chart-header-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span className="select-label">Varga:</span>
          <select value={activeVarga} onChange={e => setActiveVarga(parseInt(e.target.value))} className="styled-select">
            {VARGA_DETAILS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
        </div>
        <div className="btn-toggle-group">
          <button onClick={() => setChartStyle('south')} className={`btn-toggle ${chartStyle==='south'?'active':''}`}>South Indian</button>
          <button onClick={() => setChartStyle('north')} className={`btn-toggle ${chartStyle==='north'?'active':''}`}>North Indian</button>
        </div>
      </div>

      <div className="chart-viewport">
        {chartStyle === 'south' ? renderSouthIndianChart() : renderNorthIndianChart()}
      </div>

      <div className="chart-footer-info">
        <span>* = Retrograde &nbsp;|&nbsp; Ayanamsa: Lahiri (Chitra Paksha)</span>
      </div>
    </div>
  );
}
