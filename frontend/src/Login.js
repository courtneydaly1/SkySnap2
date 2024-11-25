// Import dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherApi from './api'; 
import './Login.css'; 

function Login() {
  // State for form data and error handling
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Handle input changes and update form state
   * @param {object} e - Event object from input field
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission and login
   * @param {object} e - Event object from form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      const token = await WeatherApi.login(formData);
      localStorage.setItem('token', token); // Save token in local storage
      WeatherApi.token = token; // Set token in API class for authenticated requests
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Login error:', err);
      setError(err[0] || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          className="login-input"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
          autoComplete="username" 
        />
        <input
          className="login-input"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          ete="current-password" 
        />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
