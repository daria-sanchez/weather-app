// main.js – Secure & Compliant Version
// ------------------------------------------------------------
// This refactor eliminates XSS via innerHTML, adds explicit
// fetch error checks, and returns friendly messages while
// retaining technical logs for developers.
// ------------------------------------------------------------

console.log("✅ main.js loaded securely");

/**
 * Save an object to localStorage with a timestamp so it can be
 * invalidated after a TTL (currently 1 hour).
 */
function saveToCache(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify({ data, timestamp: Date.now() })
  );
}

/**
 * Retrieve cached data if it is still fresh; otherwise return null.
 */
function getFromCache(key, ttlMs = 60 * 60 * 1000) {
  const recordStr = localStorage.getItem(key);
  if (!recordStr) return null;

  try {
    const record = JSON.parse(recordStr);
    if (Date.now() - record.timestamp < ttlMs) return record.data;
  } catch (_) {
    // Corrupted cache → ignore
  }
  return null;
}

/**
 * Fetches current weather for the requested city via Open‑Meteo.
 * @param {string} city – Human‑readable city name.
 * @returns {Promise<{city:string, temperature:number|string, description:string}>}
 */
async function getWeather(city) {
  try {
    if (!city || city.trim() === "") throw new Error("City name is required.");

    const cacheKey = `weather_${city.toLowerCase().trim()}`;
    const cached = getFromCache(cacheKey);
    if (cached) {
      console.log(`Using cached weather data for ${city}`);
      return cached;
    }

    // 1️⃣ Geocoding – translate city → lat/lon
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok)
      throw new Error(`Geocoding request failed (HTTP ${geoRes.status})`);
    const geoData = await geoRes.json();
    if (!geoData.results?.length) throw new Error("City not found.");

    const { latitude, longitude, name } = geoData.results[0];

    // 2️⃣ Weather – get current temperature
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok)
      throw new Error(`Weather request failed (HTTP ${weatherRes.status})`);
    const weatherData = await weatherRes.json();

    const result = {
      city: name,
      temperature: weatherData?.current_weather?.temperature ?? "Unavailable",
      description: "Refer to the documentation for further weather details",
    };

    saveToCache(cacheKey, result);
    console.log(`Fetched new weather data for ${city}`);
    return result;
  } catch (err) {
    console.error("Weather fetch error:", err);
    return {
      city,
      temperature: "Unavailable",
      description: "Unable to retrieve weather data at this time.",
    };
  }
}

// ────────────────────────────────────────────────────────────
// DOM wiring – waits for HTML to be ready before binding.
// ────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("weather-form");
  const resultDiv = document.getElementById("weather-result");

  if (!form || !resultDiv) {
    console.warn("Weather form or result container not found in HTML.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cityInput = document.getElementById("city-input").value.trim();
    if (!cityInput) return;

    const result = await getWeather(cityInput);

    // Clear existing content and append escaped text nodes (XSS‑safe).
    resultDiv.textContent = "";

    const h2 = document.createElement("h2");
    h2.textContent = result.city;

    const tempP = document.createElement("p");
    tempP.textContent = `Temperature: ${result.temperature}°C`;

    const descP = document.createElement("p");
    descP.textContent = result.description;

    resultDiv.append(h2, tempP, descP);
  });
});
