import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import the CSS file for styling

function Signup() {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', username: '', password: '', local_zipcode: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const BASE_URL = 'https://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/signup`, formData);
      localStorage.setItem('token', response.data.token); // Store token
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : 'An error occurred';
      setError(errorMessage);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      {error && <p className="signup-error">{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          className="signup-input"
          name="first_name"
          onChange={handleChange}
          placeholder="First Name"
          required
          id="first_name"
          autocomplete="given-name"
        />
        <input
          className="signup-input"
          name="last_name"
          onChange={handleChange}
          placeholder="Last Name"
          required
          id="last_name"
          autocomplete="family-name"
        />
        <input
          className="signup-input"
          name="username"
          onChange={handleChange}
          placeholder="Username"
          required
          id="username"
          autocomplete="username"
        />
        <input
          className="signup-input"
          name="local_zipcode"
          onChange={handleChange}
          placeholder="Zipcode"
          required
          id="local_zipcode"
          autocomplete="postal-code"
        />
        <input
          className="signup-input"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          required
          id="password"
          autocomplete="new-password"
        />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>

    </div>
  );
}

export default Signup;

