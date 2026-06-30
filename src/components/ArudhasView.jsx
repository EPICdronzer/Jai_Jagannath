import React, { useState } from 'react';
import { translations } from '../utils/translations';

const VARGA_LABELS = {
  'D-1': 'Rasi (D-1)',
  'D-2': 'Hora (D-2)',
  'D-3': 'Drekkana (D-3)',
  'D-4': 'Chaturthamsa (D-4)',
  'D-5': 'Panchamsa (D-5)',
  'D-6': 'Shashthamsa (D-6)',
  'D-7': 'Saptamsa (D-7)',
  'D-8': 'Ashtamsa (D-8)',
  'D-9': 'Navamsa (D-9)',
  'D-10': 'Dasamsa (D-10)',
  'D-11': 'Rudramsa (D-11)',
  'D-12': 'Dwadasamsa (D-12)',
  'D-16': 'Shodasamsa (D-16)',
  'D-20': 'Vimsamsa (D-20)',
  'D-24': 'Chaturvimsamsa (D-24)',
  'D-27': 'Nakshatramsa (D-27)',
  'D-30': 'Trimsamsa (D-30)',
  'D-40': 'Khavedamsa (D-40)',
  'D-45': 'Akshavedamsa (D-45)',
  'D-60': 'Shastiamsa (D-60)'
};

const VARGA_LABELS_HI = {
  'D-1': 'राशि चक्र (Rasi D-1)',
  'D-2': 'होरा (Hora D-2)',
  'D-3': 'द्रेष्काण (Drekkana D-3)',
  'D-4': 'चतुर्थांश (Chaturthamsa D-4)',
  'D-5': 'पंचमांश (Panchamsa D-5)',
  'D-6': 'षष्ठांश (Shashthamsa D-6)',
  'D-7': 'सप्तांश (Saptamsa D-7)',
  'D-8': 'अष्टमांश (Ashtamsa D-8)',
  'D-9': 'नवांश (Navamsa D-9)',
  'D-10': 'दशांश (Dasamsa D-10)',
  'D-11': 'रुद्रांश (Rudramsa D-11)',
  'D-12': 'द्वादशांश (Dwadasamsa D-12)',
  'D-16': 'षोडशांश (Shodasamsa D-16)',
  'D-20': 'विंशांश (Vimsamsa D-20)',
  'D-24': 'चतुर्विंशांश (Chaturvimsamsa D-24)',
  'D-27': 'नक्षत्राम्स (Nakshatramsa D-27)',
  'D-30': 'त्रिंशांश (Trimsamsa D-30)',
  'D-40': 'खवेदांश (Khavedamsa D-40)',
  'D-45': 'अक्षवेदांश (Akshavedamsa D-45)',
  'D-60': 'षष्ट्यंश (Shastiamsa D-60)'
};

const ARUDHA_DESCS = {
  'AL': 'Arudha Lagna (Pada Lagna) - Represents image, status, and how the world perceives you.',
  'A2': 'Dhanarudha - Wealth, assets, financial standing, and material resources.',
  'A3': 'Bhatrarudha - Siblings, courage, initiatives, and communication abilities.',
  'A4': 'Matri Pada - Mother, domestic environment, happiness, properties, and vehicles.',
  'A5': 'Mantra Pada - Intelligence, children, creativity, memory, and devotion.',
  'A6': 'Roga Pada - Diseases, debts, enemies, obstacles, and service.',
  'A7': 'Dara Pada - Spouse, partnerships, business relationships, and public interactions.',
  'A8': 'Mrityu Pada - Longevity, transformations, vulnerability, and sudden changes.',
  'A9': 'Bhagya Pada - Fortune, father, higher education, guru, and dharma.',
  'A10': 'Karma Pada - Career, professional success, public duties, and achievements.',
  'A11': 'Labha Pada - Gains, elder siblings, social circle, and goals fulfillment.',
  'UL': 'Upapada Lagna (A12) - Marriage, spouse characteristics, and long-term commitments.'
};

const ARUDHA_DESCS_HI = {
  'AL': 'आरूढ़ लग्न (पद लग्न) - यह समाज में आपकी छवि, स्थिति और बाहरी दुनिया में आपके व्यक्तित्व की अभिव्यक्ति को दर्शाता है।',
  'A2': 'धनारूढ़ (Dhanarudha) - धन, संपत्ति, वित्तीय स्थिति और भौतिक संसाधनों को दर्शाता है।',
  'A3': 'भ्रात्रारूढ़ (Bhatrarudha) - भाई-बहन, साहस, पहल और संवाद क्षमताओं को दर्शाता है।',
  'A4': 'मातृ पद (Matri Pada) - माता, घरेलू वातावरण, सुख, संपत्ति और वाहन सुख का संकेतक है।',
  'A5': 'मंत्र पद (Mantra Pada) - बुद्धि, संतान, रचनात्मकता, स्मरण शक्ति और मन्त्र दीक्षा का संकेतक है।',
  'A6': 'रोग पद (Roga Pada) - रोग, ऋण, शत्रु, बाधाएं और सेवा कार्यों को दर्शाता है।',
  'A7': 'दार पद (Dara Pada) - जीवनसाथी, साझेदारी, व्यावसायिक संबंध और जनता के साथ संबंध दर्शाता है।',
  'A8': 'मृत्यु पद (Mrityu Pada) - दीर्घायु, जीवन में बड़े परिवर्तन, संवेदनशीलता और आकस्मिक घटनाएं।',
  'A9': 'भाग्य पद (Bhagya Pada) - भाग्य, पिता, उच्च शिक्षा, गुरु और धर्म का संकेतक है।',
  'A10': 'कर्म पद (Karma Pada) - करियर, व्यावसायिक सफलता, सामाजिक कर्तव्य और उपलब्धियों को दर्शाता है।',
  'A11': 'लाभ पद (Labha Pada) - आय, बड़े भाई-बहन, मित्र मंडली और इच्छाओं की पूर्ति का संकेतक है।',
  'UL': 'उपपद लग्न (A12) - विवाह, जीवनसाथी के गुण, वैवाहिक संबंध और दीर्घकालिक प्रतिबद्धताएं।'
};

const ARUDHA_NAMES_HI = {
  'Arudha Lagna': 'आरूढ़ लग्न',
  'Dhanarudha': 'धनारूढ़ पद',
  'Bhatrarudha': 'भ्रात्रारूढ़ पद',
  'Matri Pada': 'मातृ पद',
  'Mantra Pada': 'मंत्र पद',
  'Roga Pada': 'रोग पद',
  'Dara Pada': 'दार पद',
  'Mrityu Pada': 'मृत्यु पद',
  'Bhagya Pada': 'भाग्य पद',
  'Karma Pada': 'कर्म पद',
  'Labha Pada': 'लाभ पद',
  'Upapada Lagna': 'उपपद लग्न'
};

export default function ArudhasView({ arudhaPadhas, lang = 'en' }) {
  const [selectedVarga, setSelectedVarga] = useState('D-1');

  const translateZodiac = (name) => translations[lang]?.zodiacs?.[name] || name;

  if (!arudhaPadhas) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        {lang === 'hi' 
          ? 'आरूढ़ पद डेटा उपलब्ध नहीं है। कृपया पहले जन्म विवरण की गणना करें।' 
          : 'No Arudha Padha data available. Please fetch high-precision data first.'}
      </div>
    );
  }

  // Parse and group Arudha Padas
  const groupedPadhas = {};
  for (const [key, sign] of Object.entries(arudhaPadhas)) {
    // Key format is like "D-1-Arudha Lagna (AL)" or "D-9-Dhanarudha (A2)"
    const match = key.match(/^(D-\d+)-([^(]+)\(([^)]+)\)/);
    if (match) {
      const varga = match[1];
      const fullName = match[2].trim();
      const code = match[3].trim();
      
      if (!groupedPadhas[varga]) {
        groupedPadhas[varga] = [];
      }
      groupedPadhas[varga].push({
        fullName,
        code,
        sign,
        description: lang === 'hi' ? (ARUDHA_DESCS_HI[code] || '') : (ARUDHA_DESCS[code] || '')
      });
    }
  }

  // Get list of available Vargas
  const availableVargas = Object.keys(groupedPadhas).sort((a, b) => {
    const numA = parseInt(a.replace('D-', ''));
    const numB = parseInt(b.replace('D-', ''));
    return numA - numB;
  });

  const currentPadhas = groupedPadhas[selectedVarga] || [];

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card-header flex-row justify-between">
        <div>
          <h3 className="card-title text-gold">
            {lang === 'hi' ? 'आरूढ़ पद (Arudha Padas)' : 'Arudha Padas (Moota / Image Points)'}
          </h3>
          <span className="subtitle">
            {lang === 'hi' ? 'जीवन के विभिन्न आयामों की भौतिक अभिव्यक्ति और सामाजिक छवि' : 'Planetary House reflections of status & environment'}
          </span>
        </div>
        
        {/* Varga Dropdown */}
        <select 
          value={selectedVarga} 
          onChange={(e) => setSelectedVarga(e.target.value)}
          className="mini-input"
          style={{ width: 'auto', minWidth: '160px', colorScheme: 'dark' }}
        >
          {availableVargas.map(v => (
            <option key={v} value={v}>
              {lang === 'hi' ? (VARGA_LABELS_HI[v] || v) : (VARGA_LABELS[v] || v)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="astro-table" style={{ width: '100%', minWidth: '500px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', width: '80px' }}>{lang === 'hi' ? 'कोड' : 'Pada Code'}</th>
              <th style={{ textAlign: 'left', width: '150px' }}>{lang === 'hi' ? 'आरूढ़ नाम' : 'Name'}</th>
              <th style={{ textAlign: 'center', width: '100px' }}>{lang === 'hi' ? 'राशि स्थिति' : 'Zodiac Sign Placement'}</th>
              <th style={{ textAlign: 'left' }}>{lang === 'hi' ? 'महत्व' : 'Significance'}</th>
            </tr>
          </thead>
          <tbody>
            {currentPadhas.map(p => (
              <tr key={p.code}>
                <td style={{ fontWeight: 'bold', color: 'var(--cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{p.code}</td>
                <td style={{ fontWeight: 600 }}>
                  {lang === 'hi' ? (ARUDHA_NAMES_HI[p.fullName] || p.fullName) : p.fullName}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--gold)' }}>
                  {translateZodiac(p.sign)}
                </td>
                <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
