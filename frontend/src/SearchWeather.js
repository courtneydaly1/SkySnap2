import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchWeather.css"; // Update CSS filename if necessary

function SearchWeather() {
  const [zipCode, setZipCode] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch weather forecast based on zip code
  const fetchWeatherForecast = async () => {
    if (!zipCode) {
      setError("Please enter a valid ZIP code.");
      return;
    }

    setIsLoading(true);
    try {
      // Make an API call to your backend or weather API
      const response = await fetch(`http://127.0.0.1:5000/weather?zip_code=${zipCode}`);
      if (!response.ok) throw new Error("Failed to fetch weather data");

      const data = await response.json();
      setForecast(data.forecast);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherForecast();
  };

  return (
    <div className="search-weather-container">
      <h1>Find Weather</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="zipcode">Enter Zip Code:</label>
        <input
          type="text"
          id="zipcode"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          maxLength={5}
          required
        />
        <button type="submit" className="search-button">
          Get Weather
        </button>
      </form>

      {isLoading && <p>Loading forecast...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {forecast && (
        <div className="forecast-container">
          <h2>7-Day Forecast for ZIP: {zipCode}</h2>
          <div className="forecast-cards">
            {forecast.map((day, index) => (
              <div className="forecast-card" key={index}>
                <h3>{new Date(day.date).toLocaleDateString()}</h3>
                <div className="weather-data">
                  <p><span>High:</span> {day.temperatureHigh}°F</p>
                  <p><span>Low:</span> {day.temperatureLow}°F</p>
                  <p><span>Feels:</span> {day.temperatureApparent}°F</p>
                  <p><span>Humidity:</span> {day.humidity}%</p>
                  <p><span>Precipitation:</span> {day.precipitation}%</p>
                  <p><span>Windspeed:</span> {day.windSpeed} mph</p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchWeather;

