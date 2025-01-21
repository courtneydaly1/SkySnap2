import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import UserContext from './auth/UserContext'; // Import UserContext

function Home() {
  const { currentUser, setCurrentUser } = useContext(UserContext);  // Access currentUser and setCurrentUser from context
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
      // Remove user data from localStorage
      localStorage.removeItem("token");
      
      // Set currentUser to null using setCurrentUser from context
      setCurrentUser(null);  // This will update the context and make currentUser null

      // Optionally navigate to the home page
      navigate("/");

      // Optionally reload the page (this may be redundant if the state updates correctly)
      window.location.reload();
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


