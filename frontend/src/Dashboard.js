import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await fetch("http://127.0.0.1:5000/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setUser(data.user);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchForecast = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch("http://127.0.0.1:5000/weather", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      debugger;
      setForecast(data.forecast);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (isLoading) return <p>Loading user data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user?.username || "User"}!</h1>
      <p className="dashboard-subtitle">You are logged in to SkySnap.</p>
      <div className="dashboard-links">
        <button onClick={fetchForecast} className="dashboard-link-button">
          View Weather
        </button>
        <Link to="/posts" className="dashboard-link-button">
          Your Snaps
        </Link>
      </div>

      {forecast && (
        <div className="forecast-container">
          <h2>5-Day Forecast for ZIP: {user.local_zipcode}</h2>
          <ul>
            {forecast.map((day, index) => (
              <li key={index}>
                {new Date(day.date).toLocaleDateString()}: High: {day.temperatureHigh}°F, Low: {day.temperatureLow}°F,
                Apparent Temp.: {day.temperatureApparent}°F,
                Humidity: {day.humidity}%,
                Precipitation: {day.precipitation}%,
                Sunrise: {day.sunrise},
                Sunset:{day.sunsetTime},
                UVIndex": {day.uvIndex},
                Visibility: {day.visibility},
                Windspeed: {day.windSpeed},
                CloudBase: {day.cloudBase},
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default Dashboard;




