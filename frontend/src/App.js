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
import ProtectedRoute from './ProtectedRoute';
import SearchWeather from "./SearchWeather";
import HelloPage from "./HelloPage";
export const TOKEN_STORAGE_ID = 'token';


function App() {
  const navigate = useNavigate();
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  // Load user info based on the token once when the component mounts
  useEffect(() => {
    async function getCurrentUser() {
      if (token && !currentUser) {
        try {
          const decodedToken = jwt.decode(token);
          if (decodedToken) {
            WeatherApi.token = token;
            const user = await WeatherApi.getCurrentUser(decodedToken.sub);
            setCurrentUser(user);
          } else {
            console.error('Invalid or expired token');
          }
        } catch (err) {
          console.error('Error loading user info:', err);
        }
      }
      setInfoLoaded(true);
    }

    getCurrentUser();
  }, [token, currentUser]);  

  // Automatically navigate to the dashboard or /post/create if the user is logged in
  useEffect(() => {
    if (infoLoaded && currentUser) {
      const currentPath = window.location.pathname;
      if (currentPath === '/post/create') {
        navigate('/post/create');
      } else if (currentPath === '/posts'){
        navigate('/posts')
      } else if (currentPath === '/login'){
        navigate('/login')
      } else if (currentPath === '/dashboard') {
        navigate('/dashboard');
      } else if (currentPath === '/hello'){
        navigate('/hello')
      }
    }
  }, [currentUser, navigate, infoLoaded]);  

  function handleLogout() {
    setCurrentUser(null);
    setToken(null); 
    navigate('/');
    window.location.reload();  
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
      console.log('Login Response:', response);

      localStorage.setItem(TOKEN_STORAGE_ID, response.token);
      WeatherApi.setToken(response.token);
      setCurrentUser(response.user);
      console.log("User after login:", response.user);

      navigate('/dashboard');
      
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
        <Navigation logout={handleLogout} setCurrentUser={null} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/signup" element={<SignupForm signup={signup} />} />
          <Route path="/hello" element={<HelloPage />} />
          
          
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
          <Route 
            exact path="/weather/search" element={<SearchWeather />} 
          />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;


