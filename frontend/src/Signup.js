import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({first_name: '', last_name: '', username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const BASE_URL= 'https://localhost:5000';
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${BASE_URL}/forecast/create_user`, formData);
      localStorage.setItem('token', response.data.token); // Store token
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : 'An error occurred';
      setError(errorMessage);
    }
    
    }
  

  return (
    <div>
      <h2>Signup</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="first_name" onChange={handleChange} placeholder="First Name" required />
        <input name="last_name" onChange={handleChange} placeholder="Last Name" required />
        <input name="username" onChange={handleChange} placeholder="Username" required />
        <input name="local_zipcode" onChange={handleChange} placeholder="Zipcode" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
