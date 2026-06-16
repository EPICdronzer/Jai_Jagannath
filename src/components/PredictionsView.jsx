import React from 'react';
import { Award, Compass, Heart, Activity, Briefcase, ShieldAlert } from 'lucide-react';

const LAGNA_PREDICTIONS = {
  Aries: {
    en: "You possess a dynamic, energetic, and pioneering spirit. Courageous and independent, you love taking action and leading projects.",
    hi: "आप एक गतिशील, ऊर्जावान और अग्रणी स्वभाव के स्वामी हैं। साहसी और स्वतंत्र विचार के होने के कारण, आप नेतृत्व करना पसंद करते हैं।"
  },
  Taurus: {
    en: "You are stable, reliable, artistic, and patient. You appreciate material comforts, beauty, and value long-term loyalty.",
    hi: "आप स्थिर, विश्वसनीय, कलात्मक और धैर्यवान हैं। आप भौतिक सुख-सुविधाओं, सौंदर्य और दीर्घकालिक निष्ठा को महत्व देते हैं।"
  },
  Gemini: {
    en: "You are intellectual, communicative, adaptable, and witty. You have a dual nature and love gathering knowledge on various topics.",
    hi: "आप बौद्धिक, मिलनसार, अनुकूलनशील और हाजिरजवाब हैं। आप बहुमुखी प्रतिभा के धनी हैं और विभिन्न विषयों पर ज्ञान प्राप्त करना पसंद करते हैं।"
  },
  Cancer: {
    en: "You are intuitive, sensitive, protective, and deeply attached to family and home. Emotional security is highly important to you.",
    hi: "आप संवेदनशील, सुरक्षात्मक और अपने परिवार से गहरे जुड़े हुए हैं। आपके लिए भावनात्मक सुरक्षा अत्यंत महत्वपूर्ण है।"
  },
  Leo: {
    en: "You are creative, generous, warm-hearted, and possess natural authority. You love expression, recognition, and have a noble character.",
    hi: "आप रचनात्मक, उदार, दयालु और प्राकृतिक नेतृत्व क्षमता के धनी हैं। आपको सम्मान प्राप्त करना और गरिमामय जीवन जीना पसंद है।"
  },
  Virgo: {
    en: "You are analytical, detail-oriented, practical, and highly helpful. You seek perfection and thrive in service or troubleshooting roles.",
    hi: "आप विश्लेषणात्मक, व्यावहारिक और अत्यंत सहायक हैं। आप काम में पूर्णता की तलाश करते हैं और दूसरों की सेवा करने में आनंद पाते हैं।"
  },
  Libra: {
    en: "You seek balance, harmony, justice, and value relationships. Refined and diplomatic, you love art, beauty, and social connections.",
    hi: "आप जीवन में संतुलन, सद्भाव और न्याय चाहते हैं। आप स्वभाव से कलाप्रेमी, कूटनीतिज्ञ और रिश्तों को संजोने वाले हैं।"
  },
  Scorpio: {
    en: "You are intense, passionate, strong-willed, and highly intuitive. You possess deep transformative power and love exploring mysteries.",
    hi: "आप दृढ़ इच्छाशक्ति वाले, खोजी प्रवृत्ति के और तीव्र भावनाओं वाले हैं। आपके भीतर गुप्त ज्ञान और जीवन में बड़े परिवर्तन करने की शक्ति है।"
  },
  Sagittarius: {
    en: "You are optimistic, philosophical, freedom-loving, and seek higher wisdom. Generous and direct, you love travel and spiritual exploration.",
    hi: "आप आशावादी, दार्शनिक, स्वतंत्रता-प्रेमी और उच्च ज्ञान चाहने वाले हैं। आप धार्मिक कार्यों, यात्रा और अध्यात्म में रुचि रखते हैं।"
  },
  Capricorn: {
    en: "You are disciplined, ambitious, practical, and highly patient. You respect structure, order, and achieve success through steady hard work.",
    hi: "आप अनुशासित, महत्वाकांक्षी, व्यावहारिक और अत्यंत धैर्यवान हैं। आप मेहनत और दृढ़ता से जीवन में सर्वोच्च पद प्राप्त करते हैं।"
  },
  Aquarius: {
    en: "You are humanitarian, progressive, intellectual, and unique. You value friendship, social causes, and think outside traditional boundaries.",
    hi: "आप मानवीय मूल्यों को मानने वाले, प्रगतिशील, बौद्धिक और अद्वितीय हैं। आप सामाजिक कार्यों और वैज्ञानिक सोच को बढ़ावा देते हैं।"
  },
  Pisces: {
    en: "You are imaginative, compassionate, spiritual, and artistic. Intuitive and gentle, you have a deep connection with the unseen and divine.",
    hi: "आप कल्पनाशील, दयालु, आध्यात्मिक और कलात्मक हैं। आपके भीतर गहरी संवेदनशीलता है और आप ईश्वरीय शक्ति में अटूट विश्वास रखते हैं।"
  }
};

const LAGNA_LORD_HOUSES = {
  1: {
    en: "Lagna Lord in 1st House: You will have strong health, immense self-confidence, and a magnetic personality. Success comes from personal effort and determination.",
    hi: "लग्नेश प्रथम भाव में: आपका स्वास्थ्य उत्तम रहेगा, आप अत्यंत आत्मविश्वासी और आकर्षक व्यक्तित्व के स्वामी होंगे। सफलता आपके व्यक्तिगत प्रयासों से मिलेगी।"
  },
  2: {
    en: "Lagna Lord in 2nd House: Focuses heavily on wealth accumulation, family values, and education. You will earn through your own speech, intelligence, and business.",
    hi: "लग्नेश द्वितीय भाव में: आपका ध्यान धन संचय, पारिवारिक मूल्यों और शिक्षा पर रहेगा। आप अपनी वाणी और बुद्धि के बल पर अच्छा धनोपार्जन करेंगे।"
  },
  3: {
    en: "Lagna Lord in 3rd House: Indicates courageous nature, writing ability, and frequent short travels. You will achieve success through high motivation, brothers, and communication.",
    hi: "लग्नेश तृतीय भाव में: यह आपके साहसी स्वभाव, लेखन क्षमता और लघु यात्राओं को दर्शाता है। आपको अपने पुरुषार्थ, संचार और भाई-बहनों से लाभ होगा।"
  },
  4: {
    en: "Lagna Lord in 4th House: Bestows happy domestic life, lands, vehicle comforts, and strong bond with mother. You will gain respect in your homeland.",
    hi: "लग्नेश चतुर्थ भाव में: यह आपको सुखी पारिवारिक जीवन, भूमि, वाहन सुख और माता से गहरा लगाव प्रदान करता है। आपको मातृभूमि में मान-सम्मान मिलेगा।"
  },
  5: {
    en: "Lagna Lord in 5th House: Highly auspicious for intellect, education, speculative gains, and children. You are creative and possess past-life good karma (Purva Punya).",
    hi: "लग्नेश पंचम भाव में: यह बुद्धि, शिक्षा, संतान और आकस्मिक धन लाभ के लिए अत्यंत शुभ है। आपके भीतर पूर्व जन्मों के शुभ कर्मों का प्रभाव रहेगा।"
  },
  6: {
    en: "Lagna Lord in 6th House: You will overcome enemies, debts, and diseases. Success comes through service, medical fields, law, or competitive environments.",
    hi: "लग्नेश षष्ठ भाव में: आप शत्रुओं, ऋण और रोगों पर विजय प्राप्त करेंगे। आपकी सफलता सेवा क्षेत्र, चिकित्सा, कानून या प्रतियोगिताओं के माध्यम से होगी।"
  },
  7: {
    en: "Lagna Lord in 7th House: Deeply involves you in partnerships, marriage, and public life. You will travel abroad and get a devoted, respectable spouse.",
    hi: "लग्नेश सप्तम भाव में: आप साझेदारी, विवाह और सामाजिक कार्यों में अत्यधिक सक्रिय रहेंगे। आपको एक समर्पित और प्रतिष्ठित जीवनसाथी प्राप्त होगा।"
  },
  8: {
    en: "Lagna Lord in 8th House: Focus on research, occult, and transformation. You will have a long life, inheritance gains, but may experience emotional transformations.",
    hi: "लग्नेश अष्टम भाव में: यह शोध, गुप्त विद्याओं और जीवन के गूढ़ रहस्यों में रुचि को दर्शाता है। आपकी आयु लंबी होगी और पैतृक संपत्ति का लाभ मिल सकता है।"
  },
  9: {
    en: "Lagna Lord in 9th House: Highly fortunate (Bhagya Yoga). You will respect elders, have deep spiritual inclinations, receive father's support, and gain global fame.",
    hi: "लग्नेश नवम भाव में: यह भाग्य योग का निर्माण करता है। आप बड़ों का सम्मान करेंगे, आध्यात्मिक होंगे, पिता का सहयोग प्राप्त करेंगे और ख्याति अर्जित करेंगे।"
  },
  10: {
    en: "Lagna Lord in 10th House: Excellent for professional status, leadership roles, and career success. You will be highly duty-oriented, respected by authority, and successful.",
    hi: "लग्नेश दशम भाव में: यह करियर की सफलता, व्यावसायिक सम्मान और नेतृत्व क्षमता के लिए सर्वोत्तम है। आप काम के प्रति समर्पित और समाज में सम्मानित होंगे।"
  },
  11: {
    en: "Lagna Lord in 11th House: Bestows regular financial gains, fulfillment of desires, and support from influential friends and elder siblings.",
    hi: "लग्नेश एकादश भाव में: यह निरंतर धन लाभ, इच्छाओं की पूर्ति और बड़े भाई-बहनों व मित्रों से अत्यधिक लाभ सुनिश्चित करता है। आप लोकप्रिय होंगे।"
  },
  12: {
    en: "Lagna Lord in 12th House: Connects you to foreign lands, spirituality, charity, and meditation. You might live abroad and find success in solitary or global enterprises.",
    hi: "लग्नेश द्वादश भाव में: यह विदेशों से संबंध, अध्यात्म, दान और ध्यान को जोड़ता है। आप विदेश में बस सकते हैं और आध्यात्मिक जीवन में उच्च अवस्था प्राप्त करेंगे।"
  }
};

const SEVENTH_LORD_HOUSES = {
  1: {
    en: "7th Lord in 1st House: Spouse will be highly devoted, self-reliant, and closely connected to your identity. Harmony in married life.",
    hi: "सप्तमेश प्रथम भाव में: आपका जीवनसाथी अत्यधिक समर्पित, आत्मनिर्भर और आपके विचारों से मेल खाने वाला होगा। वैवाहिक जीवन सुखी रहेगा।"
  },
  2: {
    en: "7th Lord in 2nd House: Marriage will bring substantial financial gains and increase family wealth. Spouse will have a pleasant speech.",
    hi: "सप्तमेश द्वितीय भाव में: विवाह के बाद आपकी आर्थिक स्थिति में भारी सुधार होगा। जीवनसाथी की वाणी मीठी और परिवार प्रिय होगी।"
  },
  3: {
    en: "7th Lord in 3rd House: Spouse will be courageous, communicative, and may have writing/artistic interests. Short travels after marriage.",
    hi: "सप्तमेश तृतीय भाव में: जीवनसाथी साहसी, बातचीत में कुशल और कलाप्रेमी होगा। विवाह के उपरांत सह-यात्राओं का सुख प्राप्त होगा।"
  },
  4: {
    en: "7th Lord in 4th House: Marriage brings peace of mind, comfortable home life, and properties. Spouse will be domestic and family-loving.",
    hi: "सप्तमेश चतुर्थ भाव में: विवाह से आपके जीवन में मानसिक शांति, सुख-सुविधाएं और वाहन सुख बढ़ेगा। जीवनसाथी घरेलू और स्नेही होगा।"
  },
  5: {
    en: "7th Lord in 5th House: A love marriage or deep intellectual compatibility is indicated. Children will be highly successful and respectful.",
    hi: "सप्तमेश पंचम भाव में: यह प्रेम विवाह या गहरी बौद्धिक अनुकूलता का संकेत देता है। आपकी संतान संस्कारी और अत्यधिक सफल होगी।"
  },
  6: {
    en: "7th Lord in 6th House: Minor disputes or health concerns for spouse. Remedies: avoid arguments and handle relationships with patience.",
    hi: "सप्तमेश षष्ठ भाव में: जीवनसाथी के साथ वैचारिक मतभेद या उनके स्वास्थ्य की चिंता हो सकती है। धैर्य से काम लें और विवादों से बचें।"
  },
  7: {
    en: "7th Lord in 7th House: Extremely auspicious. Spouse will be from a respectable family, attractive, noble, and bring immense prosperity and balance.",
    hi: "सप्तमेश सप्तम भाव में: अत्यंत शुभ स्थिति। आपका जीवनसाथी संभ्रांत परिवार से, आकर्षक, गुणी होगा और आपके जीवन में संतुलन व समृद्धि लाएगा।"
  },
  8: {
    en: "7th Lord in 8th House: Spouse will have high interest in occult, finance, or research. Wealth through spouse's family or joint funds.",
    hi: "सप्तमेश अष्टम भाव में: जीवनसाथी को अनुसंधान, गुप्त विज्ञान या अध्यात्म में रुचि होगी। ससुराल पक्ष या संयुक्त निवेश से धन लाभ होगा।"
  },
  9: {
    en: "7th Lord in 9th House: Spouse will be highly religious, spiritual, and bring immense luck (Bhagya) into your life. You may travel abroad.",
    hi: "सप्तमेश नवम भाव में: जीवनसाथी धर्मप्रिय, गुणी और आपके जीवन में भाग्य का उदय करने वाला होगा। विवाह के बाद विदेश यात्रा के योग बनते हैं।"
  },
  10: {
    en: "7th Lord in 10th House: Spouse will be career-oriented, independent, and assist in elevating your social status. Professional success after marriage.",
    hi: "सप्तमेश दशम भाव में: जीवनसाथी कामकाजी, स्वतंत्र और सामाजिक प्रतिष्ठा बढ़ाने वाला होगा। विवाह के उपरांत आपके करियर में तरक्की होगी।"
  },
  11: {
    en: "7th Lord in 11th House: Wealth and desires will be fulfilled through marriage and partnerships. Broad network of friends and gains.",
    hi: "सप्तमेश एकादश भाव में: विवाह और साझीदारों के माध्यम से आपकी इच्छाओं की पूर्ति होगी और आय के नए स्रोत बनेंगे। मित्र मंडली से लाभ होगा।"
  },
  12: {
    en: "7th Lord in 12th House: Indicates foreign connections, spiritual partner, or expenditures through spouse. A calm, mature relationship.",
    hi: "सप्तमेश द्वादश भाव में: विदेशी संबंधों, आध्यात्मिक जीवनसाथी या बाहरी खर्चों का योग बनता है। शांत और परिपक्व वैवाहिक संबंध रहेंगे।"
  }
};

const RASI_LORDS_MAP = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
  Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
};

export default function PredictionsView({ birthData, lang = 'en' }) {
  if (!birthData) return null;

  const t = (key, category = 'general') => {
    if (category === 'lagna') return LAGNA_PREDICTIONS[key]?.[lang] || key;
    if (category === 'l_lord') return LAGNA_LORD_HOUSES[key]?.[lang] || key;
    if (category === '7_lord') return SEVENTH_LORD_HOUSES[key]?.[lang] || key;
    return key;
  };

  const lagna = birthData.planets['Lagna'];
  const sun = birthData.planets['Sun'];
  const moon = birthData.planets['Moon'];

  const lagnaSign = lagna.rasi.name;
  const sunSign = sun.rasi.name;
  const moonSign = moon.rasi.name;

  // Calculate Lagna Lord placement house
  const lagnaLordName = RASI_LORDS_MAP[lagnaSign];
  const lagnaLord = birthData.planets[lagnaLordName];
  const lagnaRasiIdx = lagna.rasi.index;
  const lordRasiIdx = lagnaLord ? lagnaLord.rasi.index : lagnaRasiIdx;
  const lagnaLordHouse = ((lordRasiIdx - lagnaRasiIdx + 12) % 12) + 1;

  // Calculate 7th Lord placement house
  const seventhSignIdx = (lagnaRasiIdx + 6) % 12;
  const signsList = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const seventhSignName = signsList[seventhSignIdx];
  const seventhLordName = RASI_LORDS_MAP[seventhSignName];
  const seventhLord = birthData.planets[seventhLordName];
  const seventhLordRasiIdx = seventhLord ? seventhLord.rasi.index : seventhSignIdx;
  const seventhLordHouse = ((seventhLordRasiIdx - lagnaRasiIdx + 12) % 12) + 1;

  // Conjunction detection
  const detectedConjunctions = [];
  const planetsKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  for (let i = 0; i < planetsKeys.length; i++) {
    for (let j = i + 1; j < planetsKeys.length; j++) {
      const p1 = birthData.planets[planetsKeys[i]];
      const p2 = birthData.planets[planetsKeys[j]];
      if (p1 && p2 && p1.rasi.index === p2.rasi.index) {
        detectedConjunctions.push({ p1: p1.name, p2: p2.name, rasi: p1.rasi.name });
      }
    }
  }

  return (
    <div className="card predictions-card" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-header">
        <h3 className="card-title text-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award style={{ color: 'var(--gold)' }} />
          {lang === 'en' ? 'Vedic Astrology Predictions' : 'वैदिक ज्योतिष फलकथन'}
        </h3>
        <span className="subtitle">
          {lang === 'en' ? 'Dynamic predictions computed based on your chart metrics' : 'आपके जन्म विवरण के आधार पर सटीक वैदिक फलकथन गणना'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        
        {/* Lagna Personality Card */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontWeight: 700, marginBottom: '8px' }}>
            <Compass size={16} />
            <span>{lang === 'en' ? `Lagna Character (${lagnaSign} Ascendant)` : `लग्न स्वभाव (${lagna.rasi.hindi} लग्न)`}</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {t(lagnaSign, 'lagna')}
          </p>
        </div>

        {/* Lagna Lord Placement */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', fontWeight: 700, marginBottom: '8px' }}>
            <Activity size={16} />
            <span>{lang === 'en' ? `Lagna Lord (Life Focus)` : `लग्नेश स्थिति (जीवन की दिशा)`}</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {t(lagnaLordHouse, 'l_lord')}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              {lang === 'en' 
                ? `Lagna Lord ${lagnaLordName} is placed in the ${lagnaLordHouse} house.` 
                : `लग्नेश (${lagnaLordName}) कुंडली के ${lagnaLordHouse} भाव में स्थित हैं।`}
            </span>
          </p>
        </div>

        {/* Marriage and Relationship Lord */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700, marginBottom: '8px' }}>
            <Heart size={16} />
            <span>{lang === 'en' ? `Marriage & Partner Life` : `विवाह और वैवाहिक जीवन`}</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {t(seventhLordHouse, '7_lord')}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              {lang === 'en'
                ? `7th Lord ${seventhLordName} is placed in the ${seventhLordHouse} house.`
                : `सप्तमेश (${seventhLordName}) कुंडली के ${seventhLordHouse} भाव में स्थित हैं।`}
            </span>
          </p>
        </div>

        {/* Career & Profession */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontWeight: 700, marginBottom: '8px' }}>
            <Briefcase size={16} />
            <span>{lang === 'en' ? `Career & Profession Focus` : `आजीविका और कार्यक्षेत्र`}</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {lang === 'en' 
              ? `Your Sun (soul career) is in ${sunSign} and your Lagna Lord is in house ${lagnaLordHouse}. This indicates a profession where you express `
              : `आपका सूर्य (आत्मा कारक) ${sun.rasi.hindi} राशि में और लग्नेश ${lagnaLordHouse} भाव में है। यह यह दर्शाता है कि आप अपने कार्यक्षेत्र में `}
            {sunSign === 'Leo' || sunSign === 'Aries' || lagnaLordHouse === 10
              ? (lang === 'en' ? "leadership, authority, independence, and love working in highly visible or public-facing executive roles." : "नेतृत्व, अधिकार, स्वतंत्रता और अत्यधिक दिखाई देने वाली भूमिकाओं में काम करना पसंद करेंगे।")
              : (lang === 'en' ? "creativity, intellectual pursuits, commerce, consulting, or supportive service settings." : "रचनात्मकता, बौद्धिक खोज, व्यापार, परामर्श या सहयोगी सेवा क्षेत्रों में काम करना पसंद करेंगे।")}
          </p>
        </div>

        {/* Conjunctions / Special Yogas */}
        {detectedConjunctions.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald)', fontWeight: 700, marginBottom: '12px' }}>
              <Compass size={16} />
              <span>{lang === 'en' ? `Planetary Conjunctions (Yogas)` : `युति योग (ग्रह संबंध)`}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {detectedConjunctions.map((conj, idx) => (
                <div key={idx} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--emerald)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {conj.p1} + {conj.p2} Conjunction
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {lang === 'en' 
                      ? `Conjoined in the sign of ${conj.rasi}.`
                      : `${conj.rasi} राशि में युति संबंध बन रहा है।`}
                    {conj.p1 === 'Sun' && conj.p2 === 'Mercury' && (
                      <span style={{ color: 'var(--gold)', display: 'block', marginTop: '4px', fontWeight: 'bold' }}>
                        ★ Budhaditya Yoga: Enhances sharp intellect, communication skills, and analytical capability.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
