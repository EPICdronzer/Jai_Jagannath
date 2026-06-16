import fs from 'fs';

const JHORA_API_URL = 'https://jagannatha-hora-359167915530.europe-west1.run.app';

async function fetchDivisional(timeStr) {
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
  return data.horoscope.divisional_charts;
}

function printKeyPlacements(charts, timeLabel) {
  console.log(`\n=== Key Placements for ${timeLabel} ===`);
  
  // D-1 Rasi
  const d1 = charts['D-1_rasi'];
  console.log(`D-1 Rasi: Ascendant in ${d1?.Ascendant?.sign}, Moon in ${d1?.Moon?.sign}, Saturn in ${d1?.Saturn?.sign}`);
  
  // D-9 Navamsa
  const d9 = charts['D-9_navamsa'];
  console.log(`D-9 Navamsa: Ascendant in ${d9?.Ascendant?.sign}, Moon in ${d9?.Moon?.sign}, Saturn in ${d9?.Saturn?.sign}`);
  
  // D-3 Drekkana
  const d3 = charts['D-3_drekkana'];
  console.log(`D-3 Drekkana: Ascendant in ${d3?.Ascendant?.sign}, Sun in ${d3?.Sun?.sign}`);
  
  // D-2 Hora
  const d2 = charts['D-2_hora'];
  console.log(`D-2 Hora: Ascendant in ${d2?.Ascendant?.sign}, Sun in ${d2?.Sun?.sign}`);
}

async function run() {
  const amCharts = await fetchDivisional('08:00:00');
  printKeyPlacements(amCharts, '08:00:00 (8 AM)');
  
  const pmCharts = await fetchDivisional('20:00:00');
  printKeyPlacements(pmCharts, '20:00:00 (8 PM)');
}
run();
