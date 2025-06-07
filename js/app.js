document.getElementById("weather-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const city = document.getElementById("city-input").value.trim();
  const resultDiv = document.getElementById("weather-result");

  if (!city) return;

  resultDiv.innerHTML = "Loading...";

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current_weather=true`);
    const data = await response.json();

    if (data.current_weather) {
      const { temperature, windspeed, weathercode } = data.current_weather;
      resultDiv.innerHTML = `
        <p><strong>Temperature:</strong> ${temperature}°C</p>
        <p><strong>Wind Speed:</strong> ${windspeed} km/h</p>
        <p><strong>Weather Code:</strong> ${weathercode}</p>
      `;
    } else {
      resultDiv.innerHTML = "Weather data not found.";
    }
  } catch (error) {
    resultDiv.innerHTML = "Error fetching weather data.";
    console.error(error);
  }
});
