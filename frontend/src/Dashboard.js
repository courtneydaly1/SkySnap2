import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ user }) {
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (!user) {
        setError('User data not available.');
      } else {
        setIsLoading(false);
      }
    }, 1000); 
  }, [user]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('token'); 
      navigate('/login'); 
    }
  };

  if (isLoading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
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
