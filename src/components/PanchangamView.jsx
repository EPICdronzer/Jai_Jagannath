import React from 'react';
import { Sun, Moon, Compass, Calendar, Sunrise } from 'lucide-react';

// ─── Vedic Tithi Descriptions ─────────────────────────────────────────────────
const TITHI_DESC_EN = {
  Pratipat:    'Beginning of the lunar fortnight. Good for starting ventures. Ruled by Agni (Fire).',
  Dwitiya:     'Second day. Auspicious for travel, trade and new relationships. Ruled by Brahma.',
  Tritiya:     'Third day. Excellent for haircuts, weddings and creative work. Ruled by Gauri.',
  Chaturthi:   'Fourth day. Ruled by Ganesha — good for removing obstacles but avoid new starts.',
  Panchami:    'Fifth day. Auspicious for medicines, rituals. Ruled by the Nagas (serpents).',
  Shasthi:     'Sixth day. Good for beauty, war, and valor. Ruled by Kartikeya.',
  Saptami:     'Seventh day. Auspicious for travel and artistic work. Ruled by the Sun.',
  Ashtami:     'Eighth day. Mixed results — good for confrontations but avoid auspicious ceremonies.',
  Navami:      'Ninth day. Auspicious for Pitru (ancestral) rites. Ruled by Durga.',
  Dashami:     'Tenth day. Excellent for official work, ceremonies and spiritual activities.',
  Ekadashi:    'Eleventh day. Sacred to Vishnu. Best for fasting, devotion and spiritual growth.',
  Dwadashi:    'Twelfth day. Auspicious for giving donations and religious acts. Ruled by Vishnu.',
  Trayodashi:  'Thirteenth day. Auspicious for arts, music and love. Ruled by Kama (Desire).',
  Chaturdashi: 'Fourteenth day. Ruled by Shiva — good for tantra and spiritual work, avoid festivities.',
  Pournami:    'Full Moon. Most auspicious, all activities blessed. Peak of lunar energy.',
  Amavasya:    'New Moon. Sacred to ancestors. Time for introspection, not new ventures.',
};

const TITHI_DESC_HI = {
  Pratipat:    'पक्ष का आरंभ। नए कार्यों के लिए शुभ। अग्नि देव द्वारा शासित।',
  Dwitiya:     'द्वितीया। यात्रा, व्यापार एवं नए संबंधों के लिए शुभ। ब्रह्मा द्वारा शासित।',
  Tritiya:     'तृतीया। केशविन्यास, विवाह एवं सृजनात्मक कार्यों के लिए उत्तम। गौरी द्वारा शासित।',
  Chaturthi:   'चतुर्थी। गणेश जी द्वारा शासित — बाधा निवारण हेतु शुभ, नए आरंभ से बचें।',
  Panchami:    'पंचमी। औषधि एवं अनुष्ठानों के लिए शुभ। नागदेव द्वारा शासित।',
  Shasthi:     'षष्ठी। सौंदर्य, युद्ध एवं पराक्रम के लिए शुभ। कार्तिकेय द्वारा शासित।',
  Saptami:     'सप्तमी। यात्रा एवं कलात्मक कार्यों के लिए शुभ। सूर्य देव द्वारा शासित।',
  Ashtami:     'अष्टमी। मिश्रित फल — टकराव हेतु उचित, शुभ कार्यों से बचें।',
  Navami:      'नवमी। पितृ कर्म के लिए शुभ। माँ दुर्गा द्वारा शासित।',
  Dashami:     'दशमी। सरकारी कार्य, समारोह एवं आध्यात्मिक गतिविधियों के लिए उत्तम।',
  Ekadashi:    'एकादशी। विष्णु की पवित्र तिथि। उपवास, भक्ति एवं आत्मिक विकास हेतु श्रेष्ठ।',
  Dwadashi:    'द्वादशी। दान एवं धार्मिक कार्यों के लिए शुभ। विष्णु द्वारा शासित।',
  Trayodashi:  'त्रयोदशी। कला, संगीत एवं प्रेम के लिए शुभ। कामदेव द्वारा शासित।',
  Chaturdashi: 'चतुर्दशी। शिव द्वारा शासित — तंत्र एवं आध्यात्म हेतु उचित, उत्सव से बचें।',
  Pournami:    'पूर्णिमा। सर्वाधिक शुभ, समस्त कार्य आशीर्वादित। चंद्र ऊर्जा का शिखर।',
  Amavasya:    'अमावस्या। पितृ तर्पण हेतु पवित्र। आत्म-चिंतन का समय, नए कार्य वर्जित।',
};

// ─── Day Rulers ───────────────────────────────────────────────────────────────
const DAY_RULERS_EN = {
  Sunday: 'Sun (Surya)', Monday: 'Moon (Chandra)', Tuesday: 'Mars (Mangala)',
  Wednesday: 'Mercury (Budha)', Thursday: 'Jupiter (Guru)',
  Friday: 'Venus (Shukra)', Saturday: 'Saturn (Shani)',
};

const DAY_RULERS_HI = {
  Sunday: 'सूर्य (रविवार)', Monday: 'चंद्र (सोमवार)', Tuesday: 'मंगल (मंगलवार)',
  Wednesday: 'बुध (बुधवार)', Thursday: 'गुरु (बृहस्पतिवार)',
  Friday: 'शुक्र (शुक्रवार)', Saturday: 'शनि (शनिवार)',
};

const DAY_NAMES_HI = {
  Sunday: 'रविवार', Monday: 'सोमवार', Tuesday: 'मंगलवार',
  Wednesday: 'बुधवार', Thursday: 'बृहस्पतिवार',
  Friday: 'शुक्रवार', Saturday: 'शनिवार',
};

// ─── Tithi Names in Hindi ─────────────────────────────────────────────────────
const TITHI_NAMES_HI = {
  Pratipat: 'प्रतिपदा', Dwitiya: 'द्वितीया', Tritiya: 'तृतीया',
  Chaturthi: 'चतुर्थी', Panchami: 'पंचमी', Shasthi: 'षष्ठी',
  Saptami: 'सप्तमी', Ashtami: 'अष्टमी', Navami: 'नवमी',
  Dashami: 'दशमी', Ekadashi: 'एकादशी', Dwadashi: 'द्वादशी',
  Trayodashi: 'त्रयोदशी', Chaturdashi: 'चतुर्दशी',
  Pournami: 'पूर्णिमा', Amavasya: 'अमावस्या',
};

const PAKSHA_HI = { Shukla: 'शुक्ल पक्ष', Krishna: 'कृष्ण पक्ष' };

// ─── Yoga names in Hindi ──────────────────────────────────────────────────────
const YOGA_NAMES_HI = {
  Vishkumbha: 'विष्कुम्भ', Preeti: 'प्रीति', Ayushman: 'आयुष्मान',
  Saubhagya: 'सौभाग्य', Shobhana: 'शोभना', Atiganda: 'अतिगण्ड',
  Sukarma: 'सुकर्मा', Dhriti: 'धृति', Shoola: 'शूल',
  Ganda: 'गण्ड', Vriddhi: 'वृद्धि', Dhruva: 'ध्रुव',
  Vyaghata: 'व्याघात', Harshana: 'हर्षण', Vajra: 'वज्र',
  Siddhi: 'सिद्धि', Vyatipata: 'व्यतीपात', Variyan: 'वरीयान',
  Parigha: 'परिघ', Shiva: 'शिव', Siddha: 'सिद्ध',
  Sadhya: 'साध्य', Shubha: 'शुभ', Shukla: 'शुक्ल',
  Brahma: 'ब्रह्म', Indra: 'इन्द्र', Vaidhriti: 'वैधृति',
};

// ─── Karana names in Hindi ────────────────────────────────────────────────────
const KARANA_NAMES_HI = {
  Kinstughna: 'किंस्तुघ्न', Bava: 'बव', Balava: 'बालव',
  Kaulava: 'कौलव', Taitila: 'तैतिल', Gara: 'गर',
  Vanija: 'वणिज', Vishti: 'विष्टि', Shakuni: 'शकुनि',
  Chatushpada: 'चतुष्पद', Naga: 'नाग',
};

// ─── Nakshatra names in Hindi ─────────────────────────────────────────────────
const NAKSHATRA_NAMES_HI = {
  Ashwini: 'अश्विनी', Bharani: 'भरणी', Krittika: 'कृत्तिका',
  Rohini: 'रोहिणी', Mrigashira: 'मृगशिरा', Ardra: 'आर्द्रा',
  Punarvasu: 'पुनर्वसु', Pushya: 'पुष्य', Ashlesha: 'आश्लेषा',
  Magha: 'मघा', 'Purva Phalguni': 'पूर्व फाल्गुनी',
  'Uttara Phalguni': 'उत्तर फाल्गुनी', Hasta: 'हस्त', Chitra: 'चित्रा',
  Swati: 'स्वाति', Vishakha: 'विशाखा', Anuradha: 'अनुराधा',
  Jyeshtha: 'ज्येष्ठा', Moola: 'मूल', 'Purva Ashadha': 'पूर्वाषाढ़ा',
  'Uttara Ashadha': 'उत्तराषाढ़ा', Shravana: 'श्रवण',
  Dhanishta: 'धनिष्ठा', Shatabhisha: 'शतभिषा',
  'Purva Bhadrapada': 'पूर्व भाद्रपद', 'Uttara Bhadrapada': 'उत्तर भाद्रपद',
  Revati: 'रेवती',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PanchangamView({ panchang, lang = 'en' }) {
  if (!panchang) return null;

  const { tithi, vara, yoga, karana, nakshatra } = panchang;
  const hi = lang === 'hi';

  const tithiName   = hi ? (TITHI_NAMES_HI[tithi.name] || tithi.name) : tithi.name;
  const pakshaName  = hi ? (PAKSHA_HI[tithi.paksha] || tithi.paksha) : `${tithi.paksha} Paksha`;
  const varaName    = hi ? (DAY_NAMES_HI[vara] || vara) : vara;
  const dayRuler    = hi ? (DAY_RULERS_HI[vara] || vara) : (DAY_RULERS_EN[vara] || vara);
  const yogaName    = hi ? (YOGA_NAMES_HI[yoga] || yoga) : yoga;
  const karanaName  = hi ? (KARANA_NAMES_HI[karana] || karana) : karana;
  const nakshatraName = hi ? (NAKSHATRA_NAMES_HI[nakshatra] || nakshatra) : nakshatra;
  const tithiDesc   = hi ? (TITHI_DESC_HI[tithi.name] || '') : (TITHI_DESC_EN[tithi.name] || '');

  const waxingLabel = tithi.paksha === 'Shukla'
    ? (hi ? '🌕 शुक्ल पक्ष (चंद्र बढ़ता है)' : '🌕 Waxing Moon Fortnight')
    : (hi ? '🌑 कृष्ण पक्ष (चंद्र घटता है)' : '🌑 Waning Moon Fortnight');

  const items = [
    {
      title: hi ? 'तिथि (चंद्र दिवस)' : 'Tithi (Lunar Day)',
      value: `${pakshaName} ${tithiName}`,
      subvalue: hi ? `${tithi.index} / ३०` : `${tithi.index} of 30`,
      icon: <Moon />,
      desc: tithiDesc || (hi ? `${pakshaName} — ${tithi.percent.toFixed(0)}% पूर्ण।` : `${tithi.paksha} paksha. ${tithi.percent.toFixed(0)}% elapsed.`),
      meta: `${waxingLabel} — ${tithi.percent.toFixed(1)}% ${hi ? 'पूर्ण' : 'complete'}`,
      spanFull: true,
    },
    {
      title: hi ? 'नक्षत्र (चंद्र मंडल)' : 'Nakshatra (Lunar Mansion)',
      value: nakshatraName,
      subvalue: hi ? 'चंद्र की स्थिति' : "Moon's position",
      icon: <Compass />,
      desc: hi
        ? 'नक्षत्र चंद्रमा का तारा समूह है। यह वैदिक ज्योतिष में मन, स्वभाव एवं विंशोत्तरी दशा चक्र का मुख्य आधार है।'
        : "Nakshatra is the Moon's constellation. It governs the subconscious mind, innate temperament, and Vimshottari Dasha cycles.",
      meta: hi ? '📍 दशा का प्रारंभिक स्वामी निर्धारित करता है' : '📍 Determines Dasha starting lord',
    },
    {
      title: hi ? 'वार (सप्ताह का दिन)' : 'Vara (Weekday)',
      value: varaName,
      subvalue: dayRuler,
      icon: <Sun />,
      desc: hi
        ? 'वार दिन के शासक ग्रह को दर्शाता है जो दिन की ऊर्जा की गुणवत्ता को आकार देता है।'
        : "Vara reflects the day's ruling planet, shaping the quality of energy available throughout the day.",
      meta: `⚡ ${hi ? 'दिन का स्वामी' : 'Day ruler'}: ${dayRuler}`,
    },
    {
      title: hi ? 'योग (सौर-चंद्र संयोग)' : 'Yoga (Solar-Lunar Union)',
      value: yogaName,
      subvalue: hi ? 'नित्य योग' : 'Nithya Yoga',
      icon: <Sunrise />,
      desc: hi
        ? 'योग सूर्य एवं चंद्र की देशांतर के योग से गणित होता है। यह दिन की सामान्य सहयोग एवं कल्याण की गुणवत्ता दर्शाता है।'
        : 'Yoga is computed from the sum of Sun and Moon longitudes. It represents the quality of general harmony and well-being.',
      meta: hi ? '☯ दैनिक समन्वय एवं स्वास्थ्य ऊर्जा का शासन' : '☯ Governs daily coordination and health energy',
    },
    {
      title: hi ? 'करण (अर्ध-तिथि)' : 'Karana (Half Tithi)',
      value: karanaName,
      subvalue: hi ? 'आधा चंद्र दिवस' : 'Half lunar day',
      icon: <Calendar />,
      desc: hi
        ? 'करण एक तिथि के आधे भाग को कवर करता है (चंद्र-सूर्य के बीच ६°)। यह कार्य-कुशलता एवं व्यावसायिक क्षमताओं को नियंत्रित करता है।'
        : 'Karana spans half a Tithi (6° between Moon and Sun). It governs professional abilities and dynamic capabilities.',
      meta: hi ? '⚙ कार्य-नीति एवं व्यावसायिक क्षमताओं का शासन' : '⚙ Governs work ethic and professional capabilities',
    },
  ];

  return (
    <div className="card panchang-card">
      <div className="card-header">
        <h3 className="card-title text-gold">
          {hi ? 'पंचांग — काल के पाँच अंग' : 'Panchāng — The Five Limbs of Time'}
        </h3>
        <span className="subtitle" style={{ color: 'rgba(245,158,11,0.5)' }}>
          {hi ? 'वैदिक दैनिक कैलेंडर' : 'Vedic Daily Calendar'}
        </span>
      </div>

      <div className="panchang-grid">
        {items.map((item, i) => (
          <div key={i} className={`panchang-item ${item.spanFull ? 'span-full' : ''}`}>
            <div className="panchang-icon-row">
              <div className="panchang-icon-box">{item.icon}</div>
              <span className="panchang-label">{item.title}</span>
            </div>

            <div>
              <div className={`panchang-value ${item.spanFull ? 'large' : ''}`}>{item.value}</div>
              {item.subvalue && (
                <div style={{ fontSize: '11px', color: 'rgba(245,158,11,0.6)', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>
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
