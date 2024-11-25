import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to SkySnap</h1>
      <p className="home-description">
        Discover the weather, share your snaps, and explore SkySnap today!
      </p>
      <div className="home-links">
        <Link to="/signup" className="home-link-button">Signup</Link>
        <Link to="/login" className="home-link-button">Login</Link>
      </div>
    </div>
  );
}

export default Home;

