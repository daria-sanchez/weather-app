// js/app.js
// Weather App — Open-Meteo implementation
// --------------------------------------
// Skip all DOM work when tests import this file in Node
const isBrowser = typeof document !== 'undefined';

let form, cityIn, recentEl, results;
if (isBrowser) {
  form     = document.getElementById('searchForm');
  cityIn   = document.getElementById('cityInput');
  recentEl = document.getElementById('recent');
  results  = document.getElementById('results');
}

// ----- DOM shortcuts -----
const form     = document.getElementById('searchForm');
const cityIn   = document.getElementById('cityInput');
const recentEl = document.getElementById('recent');
const results  = document.getElementById('results');

// ----- Local-storage helpers -----
const STORAGE_KEY = 'weather_recent_cities';
const MAX_RECENTS = 5;

function getRecents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
function saveRecent(city) {
  const list = getRecents().filter(c => c.toLowerCase() !== city.toLowerCase());
  list.unshift(city);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_RECENTS)));
}
function renderRecents() {
  recentEl.innerHTML = '';
  getRecents().forEach(city => {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = city;
    span.onclick = () => fetchAndRender(city);
    recentEl.appendChild(span);
  });
}

// ----- API helpers -----
async function fetchCoords(city) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`
  );
  if (!res.ok) throw new Error('Network error while geocoding');
  const json = await res.json();
  if (!json.results?.length) throw new Error(`Could not find “${city}”`);
  const { latitude, longitude } = json.results[0];
  return { latitude, longitude };
}

async function fetchWeather({ latitude, longitude }) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );
  if (!res.ok) throw new Error('Network error while fetching weather');
  const json = await res.json();
  return parseWeather(json);
}

function parseWeather(json) {
  if (!json.current_weather)
    throw new Error('Unexpected response format from weather API');
  const { temperature, windspeed, weathercode, time } = json.current_weather;
  return { temperature, windspeed, weathercode, time };
}

// ----- UI helpers -----
function codeToText(code) {
  const map = {
    0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 51: 'Light drizzle', 61: 'Rain', 71: 'Snow', 95: 'Thunderstorm'
  };
  return map[code] ?? 'Unknown';
}

function showCard(city, data) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <h2>${city}</h2>
    <p><strong>Temperature:</strong> ${data.temperature} °C</p>
    <p><strong>Wind speed:</strong> ${data.windspeed} km/h</p>
    <p><strong>Weather:</strong> ${codeToText(data.weathercode)}</p>
    <p><em>${new Date(data.time).toLocaleTimeString()}</em></p>
  `;
  results.prepend(div);
}
function showError(msg) {
  // remove any existing identical error first
  [...results.querySelectorAll('.error')].forEach(el => {
    if (el.textContent === msg) el.remove();
  });

  const div = document.createElement('div');
  div.className = 'error';
  div.textContent = msg;
  results.prepend(div);
}

// ----- Controller -----
async function fetchAndRender(city) {
  try {
    const coords = await fetchCoords(city);
    const data   = await fetchWeather(coords);
    showCard(city, data);
    saveRecent(city);
    renderRecents();
  } catch (err) {
    showError(err.message);
  } finally {
    cityIn.focus();
    cityIn.select();
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const city = cityIn.value.trim();
  if (city) fetchAndRender(city);
});

// initial recent-search render
renderRecents();

