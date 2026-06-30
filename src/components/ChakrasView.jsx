import React from 'react';
import { Compass, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { translations } from '../utils/translations';

const SPECIAL_LAGNA_DESCS = {
  pranapada_lagna: 'Pranapada Lagna - Relates to breath, life-force, vitality and biological clock.',
  indu_lagna: 'Indu Lagna - Signifies wealth, prosperity, financial resources and unexpected fortune.',
  bhrigu_bindhu_lagna: 'Bhrigu Bindu - The midpoint of Rahu and Moon; represents destiny points and key life developments.',
  sree_lagna: 'Sree Lagna - Signifies prosperity, general well-being and spouse-related fortunes.',
  kunda_lagna: 'Kunda Lagna - Verification point for birth time rectification.',
  bhava_lagna: 'Bhava Lagna - Calculated from sunrise time; denotes physical health and vitality.',
  hora_lagna: 'Hora Lagna - Denotes financial potential and prosperity.',
  ghati_lagna: 'Ghati Lagna - Denotes power, fame, authority and social status.',
  vighati_lagna: 'Vighati Lagna - Highly sensitive sub-division used in micro-rectification.'
};

const SPECIAL_LAGNA_DESCS_HI = {
  pranapada_lagna: 'प्राणपद लग्न - श्वास, जीवन-शक्ति, प्राण ऊर्जा और जैविक घड़ी से संबंधित है।',
  indu_lagna: 'इन्दु लग्न - धन, समृद्धि, वित्तीय संसाधनों और अप्रत्याशित भाग्य का प्रतीक है।',
  bhrigu_bindhu_lagna: 'भृगु बिन्दु - राहु और चंद्रमा का मध्य बिंदु; भाग्य और जीवन के प्रमुख घटनाक्रमों को दर्शाता है।',
  sree_lagna: 'श्री लग्न - समृद्धि, सामान्य कल्याण और जीवनसाथी से संबंधित भाग्य को दर्शाता है।',
  kunda_lagna: 'कुण्ड लग्न - जन्म समय के सुधार/सत्यापन के लिए महत्वपूर्ण बिंदु।',
  bhava_lagna: 'भाव लग्न - सूर्योदय के समय से गणना; शारीरिक स्वास्थ्य और जीवन शक्ति को दर्शाता है।',
  hora_lagna: 'होरा लग्न - वित्तीय क्षमता और धन-समृद्धि को दर्शाता है।',
  ghati_lagna: 'घटी लग्न - शक्ति, प्रसिद्धि, अधिकार और सामाजिक स्थिति को दर्शाता है।',
  vighati_lagna: 'विघटी लग्न - सूक्ष्म सुधार के लिए उपयोग की जाने वाली अत्यधिक संवेदनशील उप-विभाजन।'
};

const UPAGRAHA_DESCS = {
  dhuma: 'Dhuma (Ketu Secondary) - A malefic shadow point.',
  vyatipaata: 'Vyatipaata - Shadow point representing obstacles or sudden transformations.',
  parivesha: 'Parivesha - Represents protective shield or boundaries.',
  indrachaapa: 'Indrachaapa - Shadow point indicating career or public changes.',
  upaketu: 'Upaketu - Shadow node related to spiritual endings.',
  kaala: 'Kaala (Sun Shadow) - Obstruction point.',
  mrityu: 'Mrityu (Mars Shadow) - Point of conflict or physical challenge.',
  artha_praharaka: 'Artha Praharaka (Mercury Shadow) - Point of material challenges.',
  yama_ghantaka: 'Yama Ghantaka (Jupiter Shadow) - Point of moral or financial tests.',
  gulika: 'Gulika (Saturn Shadow) - Saturnian shadow point of delay and duty.',
  maandi: 'Maandi (Saturn Shadow) - Highly critical shadow point showing pending karmas.'
};

const UPAGRAHA_DESCS_HI = {
  dhuma: 'धूम (केतु का उपग्रह) - एक अशुभ छाया बिंदु।',
  vyatipaata: 'व्यतिपात - बाधाओं या अचानक होने वाले परिवर्तनों को दर्शाने वाला छाया बिंदु।',
  parivesha: 'परिवेष - सुरक्षा कवच या सीमाओं का प्रतिनिधित्व करता है।',
  indrachaapa: 'इंद्रचाप - करियर या सार्वजनिक बदलावों को दर्शाने वाला छाया बिंदु।',
  upaketu: 'उपकेतु - आध्यात्मिक अंत से संबंधित छाया बिंदु।',
  kaala: 'काल (सूर्य का उपग्रह) - बाधा बिंदु।',
  mrityu: 'मृत्यु (मंगल का उपग्रह) - संघर्ष या शारीरिक चुनौती का बिंदु।',
  artha_praharaka: 'अर्थप्रहारक (बुध का उपग्रह) - भौतिक चुनौतियों का बिंदु।',
  yama_ghantaka: 'यमघण्टक (बृहस्पति का उपग्रह) - नैतिक या वित्तीय परीक्षणों का बिंदु।',
  gulika: 'गुलिका (शनि का उपग्रह) - देरी और कर्तव्य का शनि छाया बिंदु।',
  maandi: 'मांदी (शनि का उपग्रह) - लंबित कर्मों को दर्शाने वाला अत्यधिक महत्वपूर्ण छाया बिंदु।'
};

const SPECIAL_LAGNA_NAMES = {
  pranapada_lagna: 'प्राणपद लग्न',
  indu_lagna: 'इन्दु लग्न',
  bhrigu_bindhu_lagna: 'भृगु बिन्दु',
  sree_lagna: 'श्री लग्न',
  kunda_lagna: 'कुण्ड लग्न',
  bhava_lagna: 'भाव लग्न',
  hora_lagna: 'होरा लग्न',
  ghati_lagna: 'घटी लग्न',
  vighati_lagna: 'विघटी लग्न'
};

const UPAGRAHA_NAMES = {
  dhuma: 'धूम',
  vyatipaata: 'व्यतिपात',
  parivesha: 'परिवेष',
  indrachaapa: 'इंद्रचाप',
  upaketu: 'उपकेतु',
  kaala: 'काल',
  mrityu: 'मृत्यु',
  artha_praharaka: 'अर्थप्रहारक',
  yama_ghantaka: 'यमघण्टक',
  gulika: 'गुलिका',
  maandi: 'मांदी'
};

export default function ChakrasView({ rawData, lang = 'en' }) {
  const specialLagnas = rawData?.special_lagnas;
  const upagrahas = rawData?.upagrahas;

  const translateZodiac = (name) => translations[lang]?.zodiacs?.[name] || name;

  if (!specialLagnas && !upagrahas) {
    return (
      <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h3>
          {lang === 'hi' ? 'विशेष लग्न और उपग्रह विवरण लोड नहीं हुए।' : 'Chakras & Special Lagna details not loaded.'}
        </h3>
        <p style={{ marginTop: '8px', fontSize: '13px' }}>
          {lang === 'hi' 
            ? 'कृपया पहले जन्म विवरण भरें और डेटा की गणना करें।' 
            : 'Please fill out the birth form and fetch high-precision data from the API first.'}
        </p>
      </div>
    );
  }

  const renderLagnaTable = () => {
    if (!specialLagnas) return null;
    return (
      <div>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '14px' }}>
          <Sparkles size={16} style={{ color: 'var(--gold)' }} />
          {lang === 'hi' ? 'विशेष लग्न (गणितीय लग्न)' : 'Special Lagnas (Reflective Ascendants)'}
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="astro-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '150px' }}>{lang === 'hi' ? 'लग्न नाम' : 'Lagna Name'}</th>
                <th style={{ textAlign: 'center', width: '100px' }}>{lang === 'hi' ? 'राशि' : 'Sign'}</th>
                <th style={{ textAlign: 'center', width: '100px' }}>{lang === 'hi' ? 'स्पष्ट अंश' : 'Longitude'}</th>
                <th style={{ textAlign: 'left' }}>{lang === 'hi' ? 'महत्व और प्रभाव' : 'Significance'}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(specialLagnas).map(([key, val]) => (
                <tr key={key}>
                  <td style={{ fontWeight: 'bold' }}>
                    {lang === 'hi' ? (SPECIAL_LAGNA_NAMES[key] || key.replace(/_/g, ' ')) : key.replace(/_/g, ' ').replace(/\blagna\b/g, 'Lagna')}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 'bold' }}>
                    {translateZodiac(val.sign)}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                    {val.longitude?.toFixed(2)}°
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {lang === 'hi' 
                      ? (SPECIAL_LAGNA_DESCS_HI[key] || 'गणना किया गया विशेष बिंदु।') 
                      : (SPECIAL_LAGNA_DESCS[key] || 'Calculated mathematical point.')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderUpagrahaTable = () => {
    if (!upagrahas) return null;
    return (
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '14px' }}>
          <AlertTriangle size={16} style={{ color: 'var(--cyan)' }} />
          {lang === 'hi' ? 'उपग्रह और अप्रकाशक ग्रह (छाया ग्रह)' : 'Upagrahas (Shadow Planets)'}
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="astro-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '150px' }}>{lang === 'hi' ? 'उपग्रह नाम' : 'Upagraha Name'}</th>
                <th style={{ textAlign: 'center', width: '100px' }}>{lang === 'hi' ? 'राशि' : 'Sign'}</th>
                <th style={{ textAlign: 'center', width: '100px' }}>{lang === 'hi' ? 'स्पष्ट अंश' : 'Longitude'}</th>
                <th style={{ textAlign: 'left' }}>{lang === 'hi' ? 'महत्व और प्रभाव' : 'Significance'}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(upagrahas).map(([key, val]) => (
                <tr key={key}>
                  <td style={{ fontWeight: 'bold' }}>
                    {lang === 'hi' ? (UPAGRAHA_NAMES[key] || key.replace(/_/g, ' ')) : key.replace(/_/g, ' ')}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold' }}>
                    {translateZodiac(val.sign)}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                    {val.longitude?.toFixed(2)}°
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {lang === 'hi' 
                      ? (UPAGRAHA_DESCS_HI[key] || 'छाया ग्रह स्थिति।') 
                      : (UPAGRAHA_DESCS[key] || 'Shadow planet position.')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">
          {lang === 'hi' ? 'विशेष लग्न और उपग्रह स्थिति' : 'Special Lagnas & Upagrahas'}
        </h3>
        <span className="subtitle">
          {lang === 'hi' 
            ? 'गौण गणितीय लग्न और अप्रकाशक छाया ग्रहों के स्पष्ट रेखांश' 
            : 'Secondary mathematical Ascendants and shadow planet coordinates'}
        </span>
      </div>

      {renderLagnaTable()}
      {renderUpagrahaTable()}
    </div>
  );
}
