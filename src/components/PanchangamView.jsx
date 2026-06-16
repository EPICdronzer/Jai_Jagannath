import React from 'react';
import { Sun, Moon, Compass, Calendar, Sunrise } from 'lucide-react';

const TITHI_VEDIC_DESC = {
  'Pratipat': 'Beginning of the lunar fortnight. Good for starting ventures. Ruled by Agni (Fire).',
  'Dwitiya': 'Second day. Auspicious for travel, trade and new relationships. Ruled by Brahma.',
  'Tritiya': 'Third day. Excellent for haircuts, weddings and creative work. Ruled by Gauri.',
  'Chaturthi': 'Fourth day. Ruled by Ganesha — good for removing obstacles but avoid new starts.',
  'Panchami': 'Fifth day. Auspicious for medicines, rituals. Ruled by the Nagas (serpents).',
  'Shasthi': 'Sixth day. Good for beauty, war, and valor. Ruled by Kartikeya.',
  'Saptami': 'Seventh day. Auspicious for travel and artistic work. Ruled by the Sun.',
  'Ashtami': 'Eighth day. Mixed results — good for confrontations but avoid auspicious ceremonies.',
  'Navami': 'Ninth day. Auspicious for Pitru (ancestral) rites. Ruled by Durga.',
  'Dashami': 'Tenth day. Excellent for official work, ceremonies and spiritual activities.',
  'Ekadashi': 'Eleventh day. Sacred to Vishnu. Best for fasting, devotion and spiritual growth.',
  'Dwadashi': 'Twelfth day. Auspicious for giving donations and religious acts. Ruled by Vishnu.',
  'Trayodashi': 'Thirteenth day. Auspicious for arts, music and love. Ruled by Kama (Desire).',
  'Chaturdashi': 'Fourteenth day. Ruled by Shiva — good for tantra and spiritual work, avoid festivities.',
  'Pournami': 'Full Moon. Most auspicious, all activities blessed. Peak of lunar energy.',
  'Amavasya': 'New Moon. Sacred to ancestors. Time for introspection, not new ventures.'
};

const DAY_RULERS = {
  Sunday: 'Sun (Surya)', Monday: 'Moon (Chandra)', Tuesday: 'Mars (Mangala)',
  Wednesday: 'Mercury (Budha)', Thursday: 'Jupiter (Guru)',
  Friday: 'Venus (Shukra)', Saturday: 'Saturn (Shani)'
};

export default function PanchangamView({ panchang }) {
  if (!panchang) return null;
  const { tithi, vara, yoga, karana, nakshatra } = panchang;

  const items = [
    {
      title: 'Tithi (Lunar Day)',
      value: `${tithi.paksha} ${tithi.name}`,
      subvalue: `${tithi.index} of 30`,
      icon: <Moon />,
      desc: TITHI_VEDIC_DESC[tithi.name] || `${tithi.paksha} paksha (lunar fortnight). Progress: ${tithi.percent.toFixed(0)}% elapsed.`,
      meta: `${tithi.paksha === 'Shukla' ? '🌕 Waxing Moon Fortnight' : '🌑 Waning Moon Fortnight'} — ${tithi.percent.toFixed(1)}% complete`,
      spanFull: true
    },
    {
      title: 'Nakshatra (Lunar Mansion)',
      value: nakshatra,
      subvalue: `Moon's position`,
      icon: <Compass />,
      desc: 'Nakshatra is the Moon\'s constellation. It is the prime factor in Vedic astrology, governing the subconscious mind, innate temperament, and Vimshottari Dasha cycles.',
      meta: '📍 Determines Dasha starting lord'
    },
    {
      title: 'Vara (Weekday)',
      value: vara,
      subvalue: DAY_RULERS[vara] || '',
      icon: <Sun />,
      desc: 'Vara reflects the day\'s ruling planet, shaping the quality of energy available throughout the day. Favorable for activities aligned with that planet.',
      meta: `⚡ Day ruler: ${DAY_RULERS[vara] || vara}`
    },
    {
      title: 'Yoga (Solar-Lunar Union)',
      value: yoga,
      subvalue: 'Nithya Yoga',
      icon: <Sunrise />,
      desc: 'Yoga is computed from the sum of Sun and Moon longitudes. It represents the quality of general harmony and well-being that pervades the day.',
      meta: '☯ Governs daily coordination and health energy'
    },
    {
      title: 'Karana (Half Tithi)',
      value: karana,
      subvalue: 'Half lunar day',
      icon: <Calendar />,
      desc: 'Karana spans half a Tithi (6° between Moon and Sun). It governs professional abilities, work ethic and dynamic capabilities. Changes twice each day.',
      meta: '⚙ Governs work ethic and professional capabilities'
    }
  ];

  return (
    <div className="card panchang-card">
      <div className="card-header">
        <h3 className="card-title text-gold">Panchangam — The Five Limbs of Time</h3>
        <span className="subtitle" style={{color:'rgba(245,158,11,0.5)'}}>Vedic Daily Calendar</span>
      </div>

      <div className="panchang-grid">
        {items.map((item, i) => (
          <div key={i} className={`panchang-item ${item.spanFull ? 'span-full' : ''}`}>
            <div className="panchang-icon-row">
              <div className="panchang-icon-box">
                {item.icon}
              </div>
              <span className="panchang-label">{item.title}</span>
            </div>

            <div>
              <div className={`panchang-value ${item.spanFull ? 'large' : ''}`}>{item.value}</div>
              {item.subvalue && (
                <div style={{fontSize:'11px', color:'rgba(245,158,11,0.6)', fontFamily:'JetBrains Mono, monospace', marginTop:'3px'}}>
                  {item.subvalue}
                </div>
              )}
            </div>

            <p className="panchang-desc">{item.desc}</p>

            <div className="panchang-meta">{item.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
