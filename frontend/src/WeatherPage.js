import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import "./WeatherPage.css";

function WeatherPage() {
  const { zipcode } = useParams();
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/zipcode/${zipcode}`);
        if (!response.ok) {
          throw new Error(`Error fetching forecast: ${response.statusText}`);
        }

        const data = await response.json();
        setForecast(data.forecast);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, [zipcode]);

  if (isLoading) {
    return <p>Loading forecast...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="weather-page-container">
      <h1>5-Day Forecast for {zipcode}</h1>
      <ul className="forecast-list">
        {forecast.map((day, index) => (
          <li key={index} className="forecast-item">
            <p>Date: {day.date}</p>
            <p>High: {day.temperatureHigh}°F</p>
            <p>Low: {day.temperatureLow}°F</p>
            <p>Conditions: {day.conditions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeatherPage;
