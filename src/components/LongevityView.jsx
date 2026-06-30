import React from 'react';
import { ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import { translations } from '../utils/translations';

const CATEGORY_NAMES_HI = {
  'Alpayu': 'अल्पायु (अल्प जीवन काल - Alpayu)',
  'Madhyayu': 'मध्यायु (मध्यम जीवन काल - Madhyayu)',
  'Deerghayu': 'दीर्घायु (दीर्घ जीवन काल - Deerghayu)',
  'Balarishta': 'बालारिष्ट (Balarishta)'
};

const PLANETARY_COORDS_HI = {
  'lagna': 'लग्न (Lagna)',
  'moon': 'चन्द्रमा (Moon)',
  'sun': 'सूर्य (Sun)',
  'saturn': 'शनि (Saturn)',
  'lagna lord': 'लग्न स्वामी (Lagna Lord)',
  'eighth lord': 'अष्टमेश (8th Lord)',
  'hora lagna': 'होरा लग्न (Hora Lagna)'
};

const COMBINATION_NAMES_HI = {
  'Lagna Lord and 8th Lord': 'लग्न स्वामी और अष्टमेश',
  'Ascendant and Moon': 'लग्न और चन्द्रमा',
  'Ascendant and Hora Lagna': 'लग्न और होरा लग्न'
};

const CATEGORY_LABELS_HI = {
  'Balarishta Checks': 'बालारिष्ट योग परीक्षण (Balarishta)',
  'Alpayu Checks': 'अल्पायु योग परीक्षण (Alpayu)',
  'Madhyayu Checks': 'मध्यायु योग परीक्षण (Madhyayu)'
};

export default function LongevityView({ longevity, lang = 'en' }) {
  if (!longevity) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        {lang === 'hi' 
          ? 'दीर्घायु/आयु निर्णय डेटा उपलब्ध नहीं है। कृपया पहले जन्म विवरण की गणना करें।' 
          : 'No Longevity data available. Please fetch high-precision data first.'}
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

  const translateCategoryName = (name) => {
    return lang === 'hi' ? (CATEGORY_NAMES_HI[name] || name) : name;
  };

  const translateCoordKey = (key) => {
    const k = key.replace(/_/g, ' ').toLowerCase();
    return lang === 'hi' ? (PLANETARY_COORDS_HI[k] || k) : key.replace(/_/g, ' ');
  };

  const translateCombinationName = (name) => {
    return lang === 'hi' ? (COMBINATION_NAMES_HI[name] || name) : name;
  };

  const renderChecks = (categoryObject) => {
    if (!categoryObject || !categoryObject.checks) return null;
    
    // Sort so present indicators are first
    const sortedChecks = [...categoryObject.checks].sort((a, b) => {
      if (a.present === b.present) return a.id - b.id;
      return a.present ? -1 : 1;
    });

    const categoryTitle = lang === 'hi' 
      ? (CATEGORY_LABELS_HI[categoryObject.category] || categoryObject.category) 
      : categoryObject.category;

    return (
      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {categoryTitle} ({categoryObject.present_count} / {categoryObject.total_count})
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
        <h3 className="card-title text-gold">
          {lang === 'hi' ? 'आयु निर्णय और जीवन काल आकलन' : 'Longevity & Lifespan Prediction'}
        </h3>
        <span className="subtitle">
          {lang === 'hi' ? 'आयुर्दाय गणना, तीन-विध संघात विश्लेषण और जीवन काल संकेतक' : 'Ayurdaya Calculations & Life Span Indicators'}
        </span>
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
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              {lang === 'hi' ? 'आकलित जीवन काल श्रेणी' : 'Assessed Lifespan Category'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--gold)', marginTop: '2px' }}>
              {translateCategoryName(overall_assessment.category_name)}
            </div>
          </div>
        </div>
      )}

      {/* Key Factors */}
      {key_planetary_positions && (
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Activity size={14} style={{ color: 'var(--cyan)' }} />
            {lang === 'hi' ? 'मुख्य ज्योतिषीय निर्देशांक और स्थितियां' : 'Key Astronomical Coordinates'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {Object.entries(key_planetary_positions).map(([key, val]) => (
              <div key={key} style={{ padding: '8px 12px', background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{translateCoordKey(key)}:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {lang === 'hi' ? translations[lang]?.zodiacs?.[val] || val : val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Combinational Logic */}
      {calculation_basis && calculation_basis.combination_1 && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '10px' }}>
            {lang === 'hi' ? 'तीन-विध संघात (Three-fold combination) राशि विश्लेषण' : 'Three-fold Combination Sign Analysis'}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {lang === 'hi' 
              ? 'तीन-विध नियम: लग्न/चंद्र/होरा लग्न और उनके स्वामियों की चर/स्थिर/द्विस्वभाव राशि स्थिति से आयु निर्णय।' 
              : `${calculation_basis.method}. Lifespan is judged by comparing pairs of parameters in fixed, movable, or dual signs.`}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[calculation_basis.combination_1, calculation_basis.combination_2, calculation_basis.combination_3].map((comb, i) => (
              <div key={i} style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  <span>{translateCombinationName(comb.name)}</span>
                  <span style={{ color: 'var(--gold)' }}>{translateCategoryName(comb.result_category)}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '10px', color: 'var(--text-muted)' }}>
                  {comb.lagna_lord && (
                    <>
                      <div>{lang === 'hi' ? `लग्न स्वामी: ${translations[lang]?.planets?.[comb.lagna_lord] || comb.lagna_lord} (${translations[lang]?.zodiacs?.[comb.lagna_lord_sign] || comb.lagna_lord_sign})` : `Lagna Lord: ${comb.lagna_lord} (${comb.lagna_lord_sign})`}</div>
                      <div>{lang === 'hi' ? `अष्टमेश: ${translations[lang]?.planets?.[comb.eighth_lord] || comb.eighth_lord} (${translations[lang]?.zodiacs?.[comb.eighth_lord_sign] || comb.eighth_lord_sign})` : `8th Lord: ${comb.eighth_lord} (${comb.eighth_lord_sign})`}</div>
                    </>
                  )}
                  {comb.ascendant_sign && comb.moon_sign && (
                    <>
                      <div>{lang === 'hi' ? `लग्न राशि: ${translations[lang]?.zodiacs?.[comb.ascendant_sign] || comb.ascendant_sign}` : `Ascendant Sign: ${comb.ascendant_sign}`}</div>
                      <div>{lang === 'hi' ? `चन्द्र राशि: ${translations[lang]?.zodiacs?.[comb.moon_sign] || comb.moon_sign}` : `Moon Sign: ${comb.moon_sign}`}</div>
                    </>
                  )}
                  {comb.ascendant_sign && comb.hora_lagna_sign && (
                    <>
                      <div>{lang === 'hi' ? `लग्न राशि: ${translations[lang]?.zodiacs?.[comb.ascendant_sign] || comb.ascendant_sign}` : `Ascendant Sign: ${comb.ascendant_sign}`}</div>
                      <div>{lang === 'hi' ? `होरा लग्न राशि: ${translations[lang]?.zodiacs?.[comb.hora_lagna_sign] || comb.hora_lagna_sign}` : `Hora Lagna Sign: ${comb.hora_lagna_sign}`}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {calculation_basis.final_decision && (
              <div style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.02)', border: '1px dashed rgba(6, 182, 212, 0.3)', borderRadius: '8px', fontSize: '11px' }}>
                <strong>{lang === 'hi' ? 'अंतिम आयु निर्णय निर्णय:' : 'Final Calculation Decision:'}</strong> {calculation_basis.final_decision.logic} {lang === 'hi' ? 'के परिणामस्वरूप श्रेणी:' : 'yielding'} <strong>{translateCategoryName(calculation_basis.final_decision.result)}</strong>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Indicators */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
          {lang === 'hi' ? 'विस्तृत आयु योग नैदानिक परीक्षण' : 'Detailed Indicator Diagnostics'}
        </div>
        {renderChecks(baladrishta_checks)}
        {renderChecks(alpayu_checks)}
        {renderChecks(madhyayu_checks)}
      </div>
    </div>
  );
}
