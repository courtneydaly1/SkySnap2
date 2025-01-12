import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import UserContext from "./auth/UserContext"; 



function Home() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate(); 
  
  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/Home");
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to SkySnap</h1>
      <p className="home-description">
        Discover the weather, share your snaps, and explore SkySnap today!
      </p>
      <div className="home-links">
        {currentUser 
        ? 
        <h2>Welcome back, {currentUser.first_name || currentUser.username}! 
        </h2> 
        :
        ( <p>
        <Link to="/signup" className="home-link-button">Signup</Link>
        <Link to="/login" className="home-link-button">Login</Link>
        </p>
       
        )} 
      </div>
      <button onClick={handleLogout} className="logout-button">
          Logout
      </button>
    </div>
  );
}

export default Home;

