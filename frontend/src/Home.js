import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import UserContext from './auth/UserContext'; 

function Home() {
  const { currentUser } = useContext(UserContext);  // Accessing currentUser from context
  const navigate = useNavigate();  // For navigating to different pages

  // Redirect if currentUser is not found (logged out or no session)
  useEffect(() => {
    if (!currentUser) {
      // If there's no current user, redirect to home page with sign up or login buttons
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Remove user data from localStorage and navigate to home page
      localStorage.removeItem("token");
      navigate('/'); // Redirecting to home page
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to SkySnap</h1>
      <p className="home-description">
        Discover the weather, share your snaps, and explore SkySnap today!
      </p>
      <div className="home-links">
        {currentUser ? (
          <h2>Welcome back, {currentUser.first_name || currentUser.username}!</h2>
        ) : (
          <p>
            <Link to="/signup" className="home-link-button">Signup</Link>
            <Link to="/login" className="home-link-button">Login</Link>
          </p>
        )}
      </div>

      {currentUser && (
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      )}
    </div>
  );
}

export default Home;


