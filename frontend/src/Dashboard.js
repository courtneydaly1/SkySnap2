import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch("http://127.0.0.1:5000/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data); 
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (isLoading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user?.first_name || "User"}!</h1>
      <p className="dashboard-subtitle">You are logged in to SkySnap.</p>
      <div className="dashboard-links">
        <Link to="/weather" className="dashboard-link-button">View Weather</Link>
        <Link to="/posts" className="dashboard-link-button">Your Snaps</Link>
      </div>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Dashboard;

