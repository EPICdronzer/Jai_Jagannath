import React from 'react';
import { Compass, ShieldAlert } from 'lucide-react';
import { translations } from '../utils/translations';

const SAHAM_NAMES_HI = {
  'Punya Saham': 'पुण्य सहम (Punya)',
  'Dhana Saham': 'धन सहम (Dhana)',
  'Jeeva Saham': 'जीव सहम (Jeeva)',
  'Raja Saham': 'राज सहम (Raja)',
  'Karma Saham': 'कर्म सहम (Karma)',
  'Bhatri Saham': 'भ्रातृ सहम (Bhatri)',
  'Gaurava Saham': 'गौरव सहम (Gaurava)',
  'Yasa Saham': 'यश सहम (Yasa)',
  'Vijaya Saham': 'विजय सहम (Vijaya)',
  'Sathru Saham': 'शत्रु सहम (Sathru)',
  'Jala Saham': 'जल सहम (Jala)',
  'Pitri Saham': 'पितृ सहम (Pitri)',
  'Mitra Saham': 'मित्र सहम (Mitra)',
  'Kalatra Saham': 'कलत्र सहम (Kalatra)',
  'Putra Saham': 'पुत्र सहम (Putra)'
};

export default function SahamsView({ rawData, lang = 'en' }) {
  const sahams = rawData?.sahams;

  const translateSahamValue = (valStr) => {
    if (!valStr) return '';
    const parts = valStr.trim().split(/\s+/);
    if (parts.length > 0) {
      const sign = parts[0];
      const translatedSign = translations[lang]?.zodiacs?.[sign] || sign;
      parts[0] = translatedSign;
    }
    return parts.join(' ');
  };

  if (!sahams) {
    return (
      <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h3>
          {lang === 'hi' ? 'सहम डेटा लोड नहीं हुआ।' : 'Sahams data not loaded.'}
        </h3>
        <p style={{ marginTop: '8px', fontSize: '13px' }}>
          {lang === 'hi' 
            ? 'कृपया पहले जन्म विवरण भरें और डेटा की गणना करें।' 
            : 'Please fill out the birth form and fetch high-precision data from the API first.'}
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">
          {lang === 'hi' ? 'वर्षफल सहम बिंदु (Vedic / Arabic Parts)' : 'Sahams (Vedic / Arabic Parts)'}
        </h3>
        <span className="subtitle">
          {lang === 'hi' ? 'विशिष्ट जीवन क्षेत्रों की भविष्यवाणी करने वाले संवेदनशील गणितीय बिंदु' : 'Sensitive mathematical points indicating specific life areas'}
        </span>
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
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--cyan)' }}>
              {lang === 'hi' ? (SAHAM_NAMES_HI[name] || name) : name}
            </span>
            <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', fontWeight: 600 }}>
              {translateSahamValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
