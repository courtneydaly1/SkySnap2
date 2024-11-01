import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ username: '', first_name: '', last_name: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/create_user', formData);
      console.log(response.data);
      navigate('/login');
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" onChange={handleChange} placeholder="Username" required />
        <input name="first_name" onChange={handleChange} placeholder="First Name" required />
        <input name="last_name" onChange={handleChange} placeholder="Last Name" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
