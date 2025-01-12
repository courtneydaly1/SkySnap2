import React, { useState, useEffect, useContext } from 'react';
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
import ProtectedRoute from './ProtectedRoute';
export const TOKEN_STORAGE_ID = 'token';

function App() {
  const navigate = useNavigate();
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  // UseEffect to load user info based on the token
  useEffect(() => {
    console.debug('App useEffect loadUserInfo', 'token=', token);
    console.debug('Token from localStorage:', token);

    async function getCurrentUser() {
      if (token) {
        try {
          const decodedToken = jwt.decode(token);
          if (decodedToken) {
            WeatherApi.token = token;
            const username = await WeatherApi.getCurrentUser(decodedToken.sub);
            setCurrentUser(username);
          } else {
            console.error('There is an error with the token. It has likely expired');
            setCurrentUser(null);
          }
        } catch (err) {
          console.error('App loadUserInfo: problem loading', err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    getCurrentUser();
  }, [token]);

  function handleLogout() {
    setCurrentUser(null);
    setToken(null); // Clear the token from localStorage
    navigate('/Home');  // Redirect to home page
  }

  async function signup(signupData) {
    try {
      const response = await WeatherApi.signup(signupData);
      setToken(response.token);
      setCurrentUser(response.user);
      return { success: true, ...response };
    } catch (e) {
      console.error('Signup failed', e?.message || e);
      return { success: false, errors: [e?.message || "An error occurred during signup."] };
    }
  }

  async function login(loginData) {
    try {
      const response = await WeatherApi.login(loginData);
      debugger;
      setToken(response.token);
      setCurrentUser(response.user);
      
      navigate('/dashboard')
      
      return { success: true, ...response };

    } catch (e) {
      console.error('Login failed:', e);
      return { success: false, error: e instanceof Error ? e.message : e };
    }
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <div className="App">
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <Navigation logout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/signup" element={<SignupForm signup={signup} />} />
          
          {/* Use ProtectedRoute for protected routes */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute element={<Dashboard user={currentUser} />} />} 
          />
          <Route 
            path="/weather" 
            element={<ProtectedRoute element={<WeatherPage />} />} 
          />
          <Route 
            path="/posts" 
            element={<ProtectedRoute element={<Posts zipcode={currentUser?.local_zipcode} />} />} 
          />
          <Route 
            path="/posts/create" 
            element={<ProtectedRoute element={<CreatePost />} />} 
          />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;

