import React, { useState } from "react";
import WeatherForm from "./WeatherForm"; 
import WeatherApi from "./WeatherApi"; 

function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch weather data based on location
  const fetchWeatherData = async (location) => {
    setError(null); // Clear previous errors
    try {
      const data = await WeatherApi.getWeather(location); 
      setWeatherData(data);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Unable to fetch weather data. Please try again.");
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <WeatherForm onSubmitLocation={fetchWeatherData} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData ? (
        <div>
          <h2>Weather for {weatherData.location}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Condition: {weatherData.condition}</p>
        </div>
      ) : (
        <p>Please enter a location to see the weather.</p>
      )}
    </div>
  );
}

export default WeatherApp;

