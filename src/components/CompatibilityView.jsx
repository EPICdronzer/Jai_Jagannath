import React, { useState } from 'react';
import { calculateGunaMilan, calculateBirthData } from '../utils/astrology';
import { PRESET_CITIES } from '../utils/cities';
import { Heart, Award, Star, Users } from 'lucide-react';

export default function CompatibilityView() {
  const [partnerA, setPartnerA] = useState({
    name: 'Partner A (Groom)',
    dateStr: '1995-05-15', timeStr: '08:30:00',
    lat: 28.6139, lon: 77.2090, timezoneOffset: 5.5,
    cityPreset: 'New Delhi, India'
  });
  const [partnerB, setPartnerB] = useState({
    name: 'Partner B (Bride)',
    dateStr: '1997-08-20', timeStr: '14:15:00',
    lat: 19.0760, lon: 72.8777, timezoneOffset: 5.5,
    cityPreset: 'Mumbai, India'
  });
  const [result, setResult] = useState(null);
  const [calcError, setCalcError] = useState(null);

  const handleCity = (who, e) => {
    const setter = who === 'A' ? setPartnerA : setPartnerB;
    const city = PRESET_CITIES.find(c => c.name === e.target.value);
    if (city) setter(p => ({ ...p, cityPreset: e.target.value, lat: city.lat, lon: city.lon, timezoneOffset: city.timezone }));
    else setter(p => ({ ...p, cityPreset: '' }));
  };

  const handleChange = (who, e) => {
    const { name, value } = e.target;
    const setter = who === 'A' ? setPartnerA : setPartnerB;
    setter(p => ({ ...p, [name]: ['lat','lon','timezoneOffset'].includes(name) ? parseFloat(value)||0 : value }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    try {
      setCalcError(null);
      const dataA = calculateBirthData(partnerA);
      const dataB = calculateBirthData(partnerB);
      const milan = calculateGunaMilan(dataB.planets['Moon'].siderealLong, dataA.planets['Moon'].siderealLong);
      setResult({
        nameA: partnerA.name,
        nameB: partnerB.name,
        moonA: dataA.planets['Moon'],
        moonB: dataB.planets['Moon'],
        ...milan
      });
    } catch (err) {
      setCalcError(err.message);
    }
  };

  const getVerdict = (pts) => {
    if (pts >= 25) return { cls: 'excellent', text: 'Excellent Compatibility', sub: 'Highly auspicious match', icon: '✨' };
    if (pts >= 18) return { cls: 'good', text: 'Good Compatibility', sub: 'Acceptable match with care', icon: '💛' };
    return { cls: 'poor', text: 'Poor Compatibility', sub: 'Remedial measures advised', icon: '⚠️' };
  };

  const kootaLabels = {
    varna:   { name: 'Varna (Caste / Mindset)',        desc: 'Spiritual & mental capability alignment' },
    vashya:  { name: 'Vashya (Dominance & Influence)', desc: 'Mutual attraction and natural authority' },
    tara:    { name: 'Tara (Destiny & Luck)',           desc: 'Interpersonal fate and fortunate bond' },
    yoni:    { name: 'Yoni (Nature & Instinct)',        desc: 'Physical harmony and intimate nature' },
    maitri:  { name: 'Maitri (Friendship)',             desc: 'Planetary lord friendship compatibility' },
    gana:    { name: 'Gana (Temperament)',              desc: 'Deva/Manushya/Rakshasa nature match' },
    bhakoot: { name: 'Bhakoot (Zodiac Relation)',       desc: 'Moon sign positional compatibility' },
    nadi:    { name: 'Nadi (Health & Genetics)',        desc: 'Physiological & DNA type compatibility' }
  };

  const getScoreClass = (score, max) => {
    if (score === 0) return 'score-zero';
    if (score >= max) return 'score-full';
    return 'score-partial';
  };

  return (
    <div className="card compat-card">
      <div className="card-header">
        <h3 className="card-title text-gold" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <Heart style={{ width:18, height:18, color:'#f87171', animation:'pulse 2s infinite' }} />
          Ashtakoota Guna Milan — Marriage Compatibility
        </h3>
        <span className="subtitle">36-Point Vedic Matchmaking System</span>
      </div>

      {/* Input form */}
      <form onSubmit={handleCalculate}>
        <div className="compat-form-grid">
          {/* Partner A */}
          <div className="partner-panel">
            <div className="partner-header-a" style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <Users style={{ width:15, height:15 }} /> {partnerA.name}
            </div>
            <div className="partner-mini-grid">
              <div className="full-col">
                <div className="mini-label">Name</div>
                <input name="name" value={partnerA.name} onChange={e => handleChange('A',e)} className="mini-input" />
              </div>
              <div>
                <div className="mini-label">Date</div>
                <input type="date" name="dateStr" value={partnerA.dateStr} onChange={e => handleChange('A',e)} className="mini-input" />
              </div>
              <div>
                <div className="mini-label">Time</div>
                <input type="time" step="1" name="timeStr" value={partnerA.timeStr} onChange={e => handleChange('A',e)} className="mini-input" />
              </div>
              <div className="full-col">
                <div className="mini-label">City Preset</div>
                <select value={partnerA.cityPreset} onChange={e => handleCity('A',e)} className="mini-input" style={{ cursor:'pointer', colorScheme:'dark' }}>
                  <option value="">-- Manual --</option>
                  {PRESET_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <div className="mini-label">Latitude</div>
                <input type="number" step="0.0001" name="lat" value={partnerA.lat} onChange={e => handleChange('A',e)} className="mini-input" />
              </div>
              <div>
                <div className="mini-label">Timezone (h)</div>
                <input type="number" step="0.5" name="timezoneOffset" value={partnerA.timezoneOffset} onChange={e => handleChange('A',e)} className="mini-input" />
              </div>
            </div>
          </div>

          {/* Partner B */}
          <div className="partner-panel">
            <div className="partner-header-b" style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <Users style={{ width:15, height:15 }} /> {partnerB.name}
            </div>
            <div className="partner-mini-grid">
              <div className="full-col">
                <div className="mini-label">Name</div>
                <input name="name" value={partnerB.name} onChange={e => handleChange('B',e)} className="mini-input" />
              </div>
              <div>
                <div className="mini-label">Date</div>
                <input type="date" name="dateStr" value={partnerB.dateStr} onChange={e => handleChange('B',e)} className="mini-input" />
              </div>
              <div>
                <div className="mini-label">Time</div>
                <input type="time" step="1" name="timeStr" value={partnerB.timeStr} onChange={e => handleChange('B',e)} className="mini-input" />
              </div>
              <div className="full-col">
                <div className="mini-label">City Preset</div>
                <select value={partnerB.cityPreset} onChange={e => handleCity('B',e)} className="mini-input" style={{ cursor:'pointer', colorScheme:'dark' }}>
                  <option value="">-- Manual --</option>
                  {PRESET_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <div className="mini-label">Latitude</div>
                <input type="number" step="0.0001" name="lat" value={partnerB.lat} onChange={e => handleChange('B',e)} className="mini-input" />
              </div>
              <div>
                <div className="mini-label">Timezone (h)</div>
                <input type="number" step="0.5" name="timezoneOffset" value={partnerB.timezoneOffset} onChange={e => handleChange('B',e)} className="mini-input" />
              </div>
            </div>
          </div>

          <div className="compat-submit-row">
            <button type="submit" className="btn-compat">
              <Heart style={{ width:15, height:15, fill:'currentColor' }} />
              Calculate Guna Milan Score
            </button>
          </div>
        </div>
      </form>

      {calcError && (
        <div style={{ padding:'10px 14px', background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:'8px', color:'#fca5a5', fontSize:'12px', fontFamily:'JetBrains Mono, monospace' }}>
          ⚠️ {calcError}
        </div>
      )}

      {/* Results */}
      {result && (() => {
        const verdict = getVerdict(result.totalPoints);
        return (
          <div className="animate-fade-in" style={{ display:'flex', flexDirection:'column', gap:'20px', borderTop:'1px solid rgba(100,116,139,0.15)', paddingTop:'20px' }}>
            {/* Score Summary */}
            <div className={`score-card ${verdict.cls}`}>
              <div className="score-number-box">
                <div className="score-number">{Math.round(result.totalPoints * 2) / 2}<span className="score-denom"> / 36</span></div>
              </div>
              <div style={{ flex:1 }}>
                <div className="score-verdict-label">{verdict.icon} Guna Milan Score</div>
                <div className={`score-verdict-sub verdict-${verdict.cls}`}>
                  <Award style={{ width:15, height:15 }} /> {verdict.text}
                </div>
                <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'6px' }}>{verdict.sub}</div>
              </div>
              <div className="moon-info-panel">
                <div style={{ fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:'6px', fontWeight:700 }}>Moon Details</div>
                <div className="moon-info-row">
                  <span style={{ color:'var(--text-muted)' }}>{result.nameA}:</span>
                  <span style={{ color:'var(--cyan)' }}>{result.moonA.nakshatra.name} P{result.moonA.nakshatra.pada}</span>
                </div>
                <div className="moon-info-row">
                  <span style={{ color:'var(--text-muted)' }}>{result.nameB}:</span>
                  <span style={{ color:'var(--gold)' }}>{result.moonB.nakshatra.name} P{result.moonB.nakshatra.pada}</span>
                </div>
                <div className="moon-info-row" style={{ marginTop:'6px' }}>
                  <span style={{ color:'var(--text-muted)' }}>Rasi A:</span>
                  <span style={{ color:'var(--cyan)' }}>{result.moonA.rasi.name}</span>
                </div>
                <div className="moon-info-row">
                  <span style={{ color:'var(--text-muted)' }}>Rasi B:</span>
                  <span style={{ color:'var(--gold)' }}>{result.moonB.rasi.name}</span>
                </div>
              </div>
            </div>

            {/* Koota Breakdown */}
            <div>
              <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text-primary)', display:'flex', alignItems:'center', gap:'6px', marginBottom:'12px' }}>
                <Star style={{ width:15, height:15, color:'var(--gold)' }} />
                Eight-fold (Ashtakoota) Match Details
              </div>
              <div style={{ overflowX:'auto' }}>
                <table className="koota-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign:'left' }}>Koota (Aspect)</th>
                      <th style={{ textAlign:'center' }}>Max</th>
                      <th style={{ textAlign:'center' }}>Score</th>
                      <th>{result.nameA}</th>
                      <th>{result.nameB}</th>
                      <th>Significance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(result.kootas).map(key => {
                      const k = result.kootas[key];
                      const info = kootaLabels[key];
                      return (
                        <tr key={key}>
                          <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{info.name}</td>
                          <td style={{ textAlign:'center', fontFamily:'JetBrains Mono, monospace', color:'var(--text-secondary)' }}>{k.max}</td>
                          <td style={{ textAlign:'center', fontFamily:'JetBrains Mono, monospace', fontWeight:800 }}>
                            <span className={getScoreClass(k.score, k.max)}>{k.score}</span>
                          </td>
                          <td style={{ color:'var(--cyan)', fontSize:'12px' }}>{k.boy}</td>
                          <td style={{ color:'var(--gold)', fontSize:'12px' }}>{k.girl}</td>
                          <td style={{ color:'var(--text-muted)', fontSize:'11px' }}>{info.desc}</td>
                        </tr>
                      );
                    })}
                    <tr style={{ borderTop:'2px solid rgba(100,116,139,0.3)', background:'rgba(245,158,11,0.04)' }}>
                      <td style={{ fontWeight:800, color:'var(--gold)' }}>TOTAL SCORE</td>
                      <td style={{ textAlign:'center', fontWeight:800, color:'var(--text-secondary)', fontFamily:'JetBrains Mono' }}>36</td>
                      <td style={{ textAlign:'center', fontWeight:900, fontSize:'16px', fontFamily:'JetBrains Mono', color: verdict.cls==='excellent' ? 'var(--emerald)' : verdict.cls==='good' ? 'var(--gold)' : 'var(--red)' }}>
                        {Math.round(result.totalPoints * 2) / 2}
                      </td>
                      <td colSpan={3} style={{ color:'var(--text-muted)', fontSize:'11px' }}>
                        {verdict.icon} {verdict.text} — {verdict.sub}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
