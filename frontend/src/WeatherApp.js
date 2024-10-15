import React, { useState } from "react";
import WeatherForm from "./WeatherForm"; 
import axios from "axios";

function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = async (location) => {
    try {
      const response = await axios.get(`/api/weather`, {
        params: { location }
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <WeatherForm onSubmitLocation={fetchWeatherData} />
      {weatherData && (
        <div>
          <h2>Weather for {weatherData.location}</h2>
          <p>Temperature: {weatherData.temperature}</p>
          <p>Condition: {weatherData.condition}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
