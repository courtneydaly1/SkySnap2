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
import Dashboard from "./Dashboard";
import WeatherPage from './WeatherPage';
import Posts from "./Posts"; 
import CreatePost from "./CreatePost"; 
export const TOKEN_STORAGE_ID = 'token';

function App() {
  const navigate = useNavigate();  
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [user, setUser] = useLocalStorage('user');

  useEffect(() => {
    console.debug('App useEffect loadUserInfo', 'token=', token);

    async function getCurrentUser() {
      if (token) {
        try {
          // Decode the token to get the username
          const decodedToken = jwt.decode(token);
          console.log(decodedToken);
          if (decodedToken) {
            WeatherApi.token = token;
            // Optionally: fetch current user data if needed
            // const currentUser = await WeatherApi.getCurrentUser(decodedToken.sub);
            // setCurrentUser(currentUser);
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
      return { success: false, errors: [e?.message || "An error occurred during signup."] };
    }
  }

  async function login(loginData) {
    try {
      let response = await WeatherApi.login(loginData);
      setToken(response.access_token);
      setUser(JSON.stringify(response));
      setCurrentUser(response);
      return { success: true };
    } catch (e) {
      console.error('Login failed', e?.message || e);
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

          {/* Weather Page route */}
          <Route path="/weather" element={<WeatherPage />} />

          {/* Posts route
          <Route path="/posts" element={<Posts zipcode={user.local_zipcode}/>} /> */}

          {/* Create Post route */}
          <Route path="/posts/create" element={<CreatePost />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
