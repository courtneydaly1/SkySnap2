import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css'; 

function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

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
