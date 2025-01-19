import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [posts, setPosts] = useState([]); 
  const [showWeather, setShowWeather] = useState(false); 
  const navigate = useNavigate();

 
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to login.");
      navigate("/login"); 
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
          localStorage.removeItem("token"); 
          navigate("/login");
          return;
        }
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data.user);
      setIsLoading(false);
      fetchPosts(data.user.local_zipcode); 
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      if (err.message === "No token found. Please log in.") {
        navigate("/login"); 
      }
    }
  };

  // Fetch posts for the user based on their ZIP code
  const fetchPosts = async (zipCode) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch(`http://127.0.0.1:5000/posts?zip_code=${zipCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setPosts(data); 
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to fetch the forecast data
  const fetchForecast = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch(`http://127.0.0.1:5000/weather?zip_code=${user.local_zipcode}`, {
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

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("username");
      localStorage.removeItem("local_zipcode");

      navigate("/");
    }
  };

  // Handle Snaps link click to either view posts or create a new post
  const handleSnapsClick = () => {
    if (posts.length > 0) {
      navigate(`/posts?zip_code=${user.local_zipcode}`); 
    } else {
      navigate(`/posts/create`); 
    }
  };

  useEffect(() => {
    debugger;
    fetchUserData(); // Fetch user data when component mounts
  }, []);

  // Loading and error states
  if (isLoading) return <p>Loading user data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Function to handle showing the weather forecast
  const handleViewWeatherClick = () => {
    fetchForecast();  // Fetch the forecast data when the button is clicked
    setShowWeather(true); // Set the state to show the weather
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user?.first_name || "User"}!</h1>
      <p className="dashboard-subtitle">You are logged in to SkySnap.</p>
      <div className="dashboard-links">
        <button onClick={handleViewWeatherClick} className="dashboard-link-button">
          View Weather
        </button>
        <button onClick={handleSnapsClick} className="dashboard-link-button">
          Snaps
        </button>
      </div>

      {showWeather && forecast && (
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


