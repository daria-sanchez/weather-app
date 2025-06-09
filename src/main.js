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
    // const weatherRes = await fetch(weatherUrl);
    //const weatherData = await weatherRes.json();
    const weatherData = {}; // Simulate an empty/unexpected response


    return {
      city: name,
      temperature: weatherData.current_weather.temperature,
      description: "Refer to the documentation for further weather details"
    };
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getWeather("New York City").then(console.log);



