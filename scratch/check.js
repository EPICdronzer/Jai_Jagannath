const JHORA_API_URL = 'https://jagannatha-hora-359167915530.europe-west1.run.app';

async function run() {
  const params = {
    dateStr: '2005-02-24',
    timeStr: '08:00:00',
    lat: 28.6139,
    lon: 77.2090,
    timezoneOffset: 5.5,
    cityPreset: 'New Delhi, India'
  };

  const payload = {
    date: params.dateStr,
    time: params.timeStr,
    place: params.cityPreset,
    latitude: params.lat,
    longitude: params.lon,
    timezone: params.timezoneOffset,
    elevation: 0,
    ayanamsa_mode: 'Lahiri'
  };

  try {
    const res = await fetch(`${JHORA_API_URL}/horoscope`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('--- API RESULT FOR POORNIMA 24-02-2005 08:00 ---');
    console.log('API call success:', !!data.horoscope);
    if (data.horoscope) {
      console.log('API Ayanamsha:', data.horoscope.ayanamsa);
      console.log('API Ascendant (Lagna) sign/long:', data.horoscope.divisional_charts?.['D-1_rasi']?.['Ascendant']);
      console.log('API Moon sign/long:', data.horoscope.divisional_charts?.['D-1_rasi']?.['Moon']);
      console.log('API Saturn sign/long:', data.horoscope.divisional_charts?.['D-1_rasi']?.['Saturn']);
      console.log('API Rahu sign/long:', data.horoscope.divisional_charts?.['D-1_rasi']?.['Rahu']);
      console.log('API Ketu sign/long:', data.horoscope.divisional_charts?.['D-1_rasi']?.['Ketu']);
      console.log('API Jupiter sign/long:', data.horoscope.divisional_charts?.['D-1_rasi']?.['Jupiter']);
    }
  } catch (err) {
    console.error('API call failed:', err);
  }
}
run();
