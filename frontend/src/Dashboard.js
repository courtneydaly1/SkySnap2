import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);
  const navigate = useNavigate();

  // Memoize the fetchUserData function to avoid unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    console.log("Token before fetching user data:", token);

    if (!token) {
      console.error("No token found, redirecting to login.");
      navigate("/login");  // Redirect to login if token is missing
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Handle invalid or expired token
        if (response.status === 401) {
          console.error("Invalid or expired token.");
          localStorage.removeItem("token");  // Remove the token
          navigate("/login");  // Redirect to login
          return;
        }

        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data.user);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      if (err.message === "No token found. Please log in.") {
        navigate("/login");  // Redirect if token is missing
      }
    }
  }, [navigate]); // Only re-run if navigate changes

  // UseEffect to call fetchUserData when the component mounts
  useEffect(() => {
    fetchUserData(); // This will run the function when the component is loaded
  }, [fetchUserData]); // Adding fetchUserData as a dependency

  const fetchForecast = async () => {
    try {
      const token = localStorage.getItem("token");
      debugger;
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch("http://127.0.0.1:5000/weather", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
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
        <Link
          to={`/posts?zip_code=${user.local_zipcode}`}
          className="dashboard-link-button"
        >
          Snaps
        </Link>
      </div>

      {forecast && (
        <div className="forecast-container">
          <h2>5-Day Forecast for ZIP: {user.local_zipcode}</h2>
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
                  <p><span>Sunrise:</span> {day.sunriseTime}</p>
                  <p><span>Sunset:</span> {day.sunsetTime}</p>
                  <p><span>UV Index:</span> {day.uvIndex}</p>
                  <p><span>Visibility:</span> {day.visibility}</p>
                  <p><span>Windspeed:</span> {day.windSpeed} mph</p>
                  <p><span>Cloud Base:</span> {day.cloudBase} feet</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default Dashboard;






