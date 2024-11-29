import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import UserContext from "./auth/UserContext"; 

function Home() {
  const { currentUser } = useContext(UserContext);
  console.debug("Homepage", "currentUser=", currentUser);

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
    </div>
  );
}

export default Home;

