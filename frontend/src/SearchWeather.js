import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchWeather.css"; // Update CSS filename if necessary
import WeatherApi from "./api";

function SearchWeather() {
  const [zipCode, setZipCode] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipCodeChanging, setIsZipCodeChanging] = useState(false);
  const navigate = useNavigate();

  // Function to fetch weather forecast based on zip code
  const fetchWeatherForecast = async (zip) => {
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
  
    // Handle the form submission for weather search
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
            {forecast.map((day) => (
              <div className="forecast-card" key={day.date}>
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
        <p>No weather data available for this ZIP code.</p>
        )}
      </div>
    );
  }
  
  export default SearchWeather;
