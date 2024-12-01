import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';  
import WeatherApi from './api';
import UserContext from './auth/UserContext';
import jwt from 'jsonwebtoken';
import useLocalStorage from './hooks/useLocalStorage';
import Navigation from './Navigation';
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';
import LoadingSpinner from './LoadingSpinner';
import Home from "./Home";
import Dashboard from "./Dashboard"

export const TOKEN_STORAGE_ID = 'token';

function App() {
  const navigate = useNavigate();  
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(() => {
    console.debug('App useEffect loadUserInfo', 'token=', token);

    async function getCurrentUser() {
      if (token) {
        try {
          // Decode the token to get the username
          const decodedToken = jwt.decode(token);
          if (decodedToken && decodedToken.username) {
            WeatherApi.token = token;
            const currentUser = await WeatherApi.getCurrentUser(decodedToken.username);
            setCurrentUser(currentUser);
          } else {
            console.error('Invalid token: no username found.');
            setCurrentUser(null);
          }
        } catch (err) {
          console.error('App loadUserInfo: problem loading', err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  function handleLogout() {
    setCurrentUser(null);
    setToken(null);
    navigate('/');  
  }

  async function signup(signupData) {
    try {
      // Call the API to sign up and get the token
      let token = await WeatherApi.signup(signupData);
      setToken(token);
      return { success: true };  
    } catch (e) {
      console.error('Signup failed', e?.message || e);
      
      // Return an error message in a consistent format that the form expects
      return { success: false, errors: [e?.message || "An error occurred during signup."] };
    }
  }
  

  async function login(loginData) {
    try {
      let token = await WeatherApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (e) {
      console.error('login failed', e?.message || e);
      return { success: false, e: e?.message || e };
    }
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <div className="App">
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <Navigation logout={handleLogout} />
        <Routes>  
          {/* Home route */}
          <Route path="/" element={<Home />} />
          
          {/* Login route */}
          <Route path="/login" element={<LoginForm login={login} />} />
          
          {/* Signup route */}
          <Route path="/signup" element={<SignupForm signup={signup} />} />

          {/* Dashboard route */}
          <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
