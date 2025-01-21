import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import to access the query params
import "./SearchWeather.css";

function SearchWeather() {
  const [zipCode, setZipCode] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipCodeChanging, setIsZipCodeChanging] = useState(false);

  // Retrieve the query params from the location object
  const location = useLocation();

  useEffect(() => {
    // Parse the query parameter from the URL if there's any (optional feature, if you want to handle it)
    const params = new URLSearchParams(location.search);
    const zipParam = params.get("zip_code");
    if (zipParam) {
      setZipCode(zipParam); // Set zipCode if provided in query params
      fetchWeatherForecast(zipParam); // Fetch weather based on the zip code
    }
  }, [location.search]); // Re-run the effect if location changes

  // Function to fetch weather forecast based on zip code
  const fetchWeatherForecast = async (zip) => {
    if (!zip) return;

    setIsLoading(true); // Set loading state when fetching
    setForecast(null);  // Clear previous forecast data
    setIsZipCodeChanging(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to fetch the weather.");
      setIsLoading(false);
      setIsZipCodeChanging(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/weather?zip_code=${zip}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data.');
      }

      const data = await response.json();
      setForecast(data.forecast);
      setIsLoading(false);
      setIsZipCodeChanging(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setIsZipCodeChanging(false);
    }
  };

  // Handle form submission for weather search
  const handleSubmit = (e) => {
    e.preventDefault();
    const zipCodeRegex = /^[0-9]{5}$/;
    if (!zipCodeRegex.test(zipCode)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    fetchWeatherForecast(zipCode);
  };

  return (
    <div className="search-weather-container">
      <h1>Search Weather Forecast</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter ZIP Code"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading && <p>Loading weather data...</p>}

      {forecast && !isZipCodeChanging ? (
        <div className="forecast-container">
          <h2>7-Day Forecast for ZIP: {zipCode}</h2>
          <div className="forecast-cards">
            {forecast.map((day, index) => (
              <div className="forecast-card" key={index}>
                <h3>{new Date(day.date).toLocaleDateString()}</h3>
                <p>High: {day.temperatureHigh}°F</p>
                <p>Low: {day.temperatureLow}°F</p>
                <p>Feels: {day.temperatureApparent}°F</p>
                <p>Humidity: {day.humidity}%</p>
                <p>Precipitation: {day.precipitation}%</p>
                <p>Sunrise: {day.sunriseTime}</p>
                <p>Sunset: {day.sunsetTime}</p>
                <p>UV Index: {day.uvIndex}</p>
                <p>Visibility: {day.visibility} miles</p>
                <p>Windspeed: {day.windSpeed} mph</p>
                <p>Cloud Base: {day.cloudBase} feet</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No forecast available.</p>
      )}
    </div>
  );
}

export default SearchWeather;
