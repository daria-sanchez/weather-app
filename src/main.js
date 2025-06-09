/**
 * Fetches the current temperature for a given city using the Open-Meteo API.
 *
 * @param {string} city - The name of the city to retrieve weather data for.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   - city {string}: The name of the matched city
 *   - temperature {number|string}: The current temperature in Celsius or "Unavailable"
 *   - description {string}: A short message or error context
 *
 * @example
 * getWeather("New York City").then(console.log);
 * // {
 * //   city: "New York City",
 * //   temperature: 22.1,
 * //   description: "Refer to the documentation for further weather details"
 * // }
 *
 * @error
 * If the city is blank, not found, or if the API fails, an error is logged to the console,
 * and the returned object contains "Unavailable" with an appropriate description.
 */
async function getWeather(city) {
  try {
    if (!city || city.trim() === "") {
      throw new Error("City name is required.");
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found.");
    }

    const { latitude, longitude, name } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    return {
      city: name,
      temperature: weatherData?.current_weather?.temperature ?? "Unavailable",
      description: "Refer to the documentation for further weather details"
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      city: city,
      temperature: "Unavailable",
      description: error.message
    };
  }
}

// Test call
getWeather("New York City").then(console.log);


