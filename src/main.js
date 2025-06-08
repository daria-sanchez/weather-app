const readline = require('readline');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter a city name: ', async (city) => {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoData = await fetchJson(geoUrl);

    if (!geoData.results || geoData.results.length === 0) {
      console.log('City not found.');
      rl.close();
      return;
    }

    const { latitude, longitude } = geoData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherData = await fetchJson(weatherUrl);

    const temp = weatherData.current_weather?.temperature;

    if (temp !== undefined) {
      console.log(`Current temperature in ${city}: ${temp}°C`);
    } else {
      console.log('Weather data not available.');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
});

