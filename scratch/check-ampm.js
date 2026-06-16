const JHORA_API_URL = 'https://jagannatha-hora-359167915530.europe-west1.run.app';

async function queryTime(timeStr) {
  const payload = {
    date: '2005-02-24',
    time: timeStr,
    place: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
    elevation: 0,
    ayanamsa_mode: 'Lahiri'
  };

  const res = await fetch(`${JHORA_API_URL}/horoscope`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  const d1 = data.horoscope.divisional_charts['D-1_rasi'];
  console.log(`\n--- D-1 Positions for ${timeStr} ---`);
  for (const p of Object.keys(d1)) {
    console.log(`${p}: ${d1[p].sign} (${d1[p].longitude.toFixed(2)}°)`);
  }
}

async function run() {
  await queryTime('08:00:00'); // 8:00 AM
  await queryTime('20:00:00'); // 8:00 PM
}
run();
