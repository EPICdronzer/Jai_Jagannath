import React from 'react';
import { Compass, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';
import { translations } from '../utils/translations';

export default function ArgalaView({ rawData, lang = 'en' }) {
  const houseRels = rawData?.house_relationships;
  const argala = houseRels?.argala;
  const virodhargala = houseRels?.virodhargala;

  const translateZodiac = (name) => translations[lang]?.zodiacs?.[name] || name;
  const translatePlanet = (name) => translations[lang]?.planets?.[name] || name;

  if (!argala || !virodhargala) {
    return (
      <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h3>
          {lang === 'hi' ? 'अर्गला और विरोधार्गला विवरण लोड नहीं हुए।' : 'Argala & Virodhargala details not loaded.'}
        </h3>
        <p style={{ marginTop: '8px', fontSize: '13px' }}>
          {lang === 'hi' 
            ? 'कृपया पहले जन्म विवरण भरें और डेटा की गणना करें।' 
            : 'Please fill out the birth form and fetch high-precision data from the API first.'}
        </p>
      </div>
    );
  }

  const signNames = Object.keys(argala);

  const formatPlanets = (list) => {
    if (!list || list.length === 0) return lang === 'hi' ? 'कोई नहीं' : 'None';
    // Handle list if it's a comma-separated string or array
    const arr = Array.isArray(list) ? list : [list];
    const filtered = arr.filter(Boolean);
    if (filtered.length === 0) return lang === 'hi' ? 'कोई नहीं' : 'None';
    return filtered.map(translatePlanet).join(', ');
  };

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold">
          {lang === 'hi' ? 'अर्गला और विरोधार्गला' : 'Argala & Virodhargala'}
        </h3>
        <span className="subtitle">
          {lang === 'hi' 
            ? 'राशियों पर ग्रहों का अर्गला (हस्तक्षेप) और विरोधार्गला (बाधा) प्रभाव' 
            : 'Planetary interventions (Argala) and obstructions (Virodhargala) on signs'}
        </span>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
        {lang === 'hi' ? (
          <>
            वैदिक ज्योतिष में, <strong>अर्गला</strong> उस ग्रह हस्तक्षेप या प्रभाव को संदर्भित करता है जो किसी भाव या राशि को प्रभावित करता है, एक उत्प्रेरक के रूप में कार्य करता है। 
            <strong> विरोधार्गला</strong> उस अर्गला हस्तक्षेप के प्रतिकार, अवरोध या बाधा का प्रतिनिधित्व करता है।
          </>
        ) : (
          <>
            In Vedic astrology, <strong>Argala</strong> refers to planetary intervention that influences a house or sign, acting as a catalyst. 
            <strong>Virodhargala</strong> represents the counteraction or obstruction of that intervention.
          </>
        )}
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table className="astro-table" style={{ width: '100%', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>{lang === 'hi' ? 'राशि (Sign)' : 'Zodiac Sign'}</th>
              <th style={{ textAlign: 'center', color: 'var(--cyan)' }}>
                {lang === 'hi' ? 'मुख्य अर्गला (2H / 4H / 11H)' : 'Primary Argala (2H / 4H / 11H)'}
              </th>
              <th style={{ textAlign: 'center', color: 'var(--gold)' }}>
                {lang === 'hi' ? 'गौण अर्गला (5H)' : 'Secondary Argala (5H)'}
              </th>
              <th style={{ textAlign: 'center', color: 'var(--red)' }}>
                {lang === 'hi' ? 'विरोधार्गला (12H / 10H / 3H)' : 'Virodhargala (12H / 10H / 3H)'}
              </th>
            </tr>
          </thead>
          <tbody>
            {signNames.map(sign => {
              const argList = argala[sign] || [];
              const virList = virodhargala[sign] || [];
              
              const primaryArg = argList.slice(0, 3).filter(Boolean);
              const secondaryArg = argList[3];
              const primaryVir = virList.slice(0, 4).filter(Boolean);

              return (
                <tr key={sign}>
                  <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {translateZodiac(sign)}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: primaryArg.length > 0 ? 'bold' : 'normal' }}>
                    {formatPlanets(primaryArg)}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: secondaryArg ? 'bold' : 'normal' }}>
                    {formatPlanets(secondaryArg ? [secondaryArg] : [])}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--red)', fontWeight: primaryVir.length > 0 ? 'bold' : 'normal' }}>
                    {formatPlanets(primaryVir)}
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
