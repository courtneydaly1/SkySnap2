import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './auth/SignupForm';
import Login from './auth/LoginForm';
import Home from './Home';
import Dashboard from './Dashboard';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Re-check authentication when the app loads or state changes
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <div>
        {isAuthenticated && (
          <button onClick={handleLogout} style={{ position: 'absolute', top: 10, right: 10 }}>
            Logout
          </button>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


