import fs from 'fs';

async function download(url, path) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    fs.writeFileSync(path, text);
    console.log('Downloaded', url, '->', path, '(', text.length, 'bytes )');
  } catch (err) {
    console.error('Failed to download', url, err);
  }
}

async function run() {
  await download('https://jagannathahora.com/assets/useJagannathaHoraData-dkQ9HK81.js', 'scratch/useJagannathaHoraData.js');
  await download('https://jagannathahora.com/assets/usePlanetaryStates-qUri5c1D.js', 'scratch/usePlanetaryStates.js');
  await download('https://jagannathahora.com/assets/jagannathaHoraTransformers-C8Yw8w4Y.js', 'scratch/jagannathaHoraTransformers.js');
  await download('https://jagannathahora.com/assets/divisionalChartTransformers-D8QEoGBT.js', 'scratch/divisionalChartTransformers.js');
}
run();
