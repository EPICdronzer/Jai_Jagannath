async function run() {
  const payload = {
    date: '2026-06-15',
    time: '17:30:00',
    place: 'Puri, Odisha, India (Jagannath Temple)',
    latitude: 19.8135,
    longitude: 85.8312,
    timezone: 5.5,
    elevation: 0,
    ayanamsa_mode: 'Lahiri'
  };

  const url = 'https://jagannatha-hora-359167915530.europe-west1.run.app/horoscope';
  console.log('Sending request to', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully received response!');
    console.log('Keys in response:', Object.keys(data));
    if (data.horoscope) {
      console.log('Keys in horoscope:', Object.keys(data.horoscope));
      console.log('nakshatra_pada for Sun:', data.horoscope.nakshatra_pada?.sun);
      console.log('nakshatra_pada for Moon:', data.horoscope.nakshatra_pada?.moon);
      console.log('arudha_padhas:', data.horoscope.arudha_padhas);
    }
  } catch (err) {
    console.error('Request failed:', err);
  }
}
run();
