import fs from 'fs';

const JHORA_API_URL = 'https://jagannatha-hora-359167915530.europe-west1.run.app';

async function run() {
  const payload = {
    date: '2005-02-24',
    time: '08:00:00',
    place: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
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
    fs.writeFileSync('scratch/poornima-charts.json', JSON.stringify(data.horoscope.divisional_charts, null, 2));
    console.log('Successfully saved divisional charts to scratch/poornima-charts.json');
  } catch (err) {
    console.error(err);
  }
}
run();
