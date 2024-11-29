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

export const TOKEN_STORAGE_ID = 'weatherApi-token';

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
      let token = await WeatherApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (e) {
      console.error('signup failed', e?.message || e);
      return { success: false, e: e?.message || e };
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
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/signup" element={<SignupForm signup={signup} />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
