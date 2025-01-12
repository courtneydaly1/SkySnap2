import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';
import Alert from "../common/Alert";
import axios from 'axios';

function SignupForm() {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', username: '', password: '', local_zipcode: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  function validateForm() {
    let isValid = true;
    const errors = { username: '', local_zipcode: '', password: '', first_name: '', last_name: '' };

    // Validate ZIP code format
    if (!/^\d{5}$/.test(formData.local_zipcode)) {
      isValid = false;
      errors.local_zipcode = 'Invalid ZIP code format.';
    }

    // Validate other fields if necessary
    if (!formData.first_name) {
      isValid = false;
      errors.first_name = 'First Name is required.';
    }

    if (!formData.last_name) {
      isValid = false;
      errors.last_name = 'Last Name is required.';
    }

    if (!formData.username) {
      isValid = false;
      errors.username = 'Username is required.';
    }

    if (!formData.password) {
      isValid = false;
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return isValid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;  // Prevent form submission if validation fails
    }

    const userData = {
        username: formData.username,  
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        local_zipcode: formData.local_zipcode
    };

    try {
        const result = await axios.post('http://127.0.0.1:5000/auth/signup', userData);
        if (result && result.data && result.data.token) {
          
          const { message, token } = result.data;

          console.log('Response data:', result.data);

          if (message === 'User created successfully') {
            localStorage.setItem('userId', result.data.userId);
            localStorage.setItem('username', result.data.username);
            localStorage.setItem('first_name', result.data.first_name);
            localStorage.setItem('last_name', result.data.last_name);
            localStorage.setItem('local_zipcode', result.data.local_zipcode);
            localStorage.setItem('token', token);

            console.log(localStorage); // Check if values are set correctly
            navigate("/dashboard");
          }
        }
    } catch (error) {
        console.error('Error during signup:', error.response || error);
        alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          className={`signup-input ${fieldErrors.first_name ? 'input-error' : ''}`}
          name="first_name"
          onChange={handleChange}
          placeholder="First Name"
          value={formData.first_name}
        />
        {fieldErrors.first_name && <span className="error-message">{fieldErrors.first_name}</span>}

        <input
          className={`signup-input ${fieldErrors.last_name ? 'input-error' : ''}`}
          name="last_name"
          onChange={handleChange}
          placeholder="Last Name"
          value={formData.last_name}
        />
        {fieldErrors.last_name && <span className="error-message">{fieldErrors.last_name}</span>}

        <input
          className={`signup-input ${fieldErrors.username ? 'input-error' : ''}`}
          name="username"
          onChange={handleChange}
          placeholder="Username"
          value={formData.username}
        />
        {fieldErrors.username && <span className="error-message">{fieldErrors.username}</span>}

        <input
          className={`signup-input ${fieldErrors.local_zipcode ? 'input-error' : ''}`}
          name="local_zipcode"
          onChange={handleChange}
          placeholder="Zipcode"
          value={formData.local_zipcode}
        />
        {fieldErrors.local_zipcode && <span className="error-message">{fieldErrors.local_zipcode}</span>}

        <input
          className={`signup-input ${fieldErrors.password ? 'input-error' : ''}`}
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          value={formData.password}
        />
        {fieldErrors.password && <span className="error-message">{fieldErrors.password}</span>}

        {fieldErrors && Object.values(fieldErrors).length > 0 && (
          <Alert type="danger" messages={Object.values(fieldErrors)} />
        )}

        <button 
          type="submit" 
          className="signup-button"
          disabled={Object.values(fieldErrors).length > 0}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupForm;




