import fs from 'fs';

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
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    fs.writeFileSync('scratch/horoscope-response.json', JSON.stringify(data, null, 2));
    
    console.log('--- SPHUTA ---');
    console.log(data.horoscope.sphuta);
    
    console.log('--- NAKSHATRA PADA ---');
    console.log(data.horoscope.nakshatra_pada);
    
    console.log('--- CALENDAR INFO ---');
    console.log(data.horoscope.calendar_info);
  } catch (err) {
    console.error(err);
  }
}
run();
