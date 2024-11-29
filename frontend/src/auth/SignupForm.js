import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';
import Alert from "../common/Alert";
import WeatherApi from "../api";  

/** Signup form.
 *
 * Shows form and manages updates to state on changes.
 * On submission:
 * - calls signup function prop
 * - redirects to /dashboard route
 *
 * Routes -> SignupForm -> Alert
 * Routed as /signup
 */

function SignupForm({ signup }) {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', username: '', password: '', local_zipcode: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  function validateForm() {
    let isValid = true;
    const errors = { username: '', local_zipcode: '', password: '' };

    if (!/^\d{5}$/.test(formData.local_zipcode)) {
      isValid = false;
      errors.local_zipcode = 'Invalid ZIP code format.';
    }

    setFieldErrors(errors);
    return isValid;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await signup(formData);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setFieldErrors(result.errors || []);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setFieldErrors(["An unexpected error occurred during signup."]);
    }
  }

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
        <input
          className={`signup-input ${fieldErrors.last_name ? 'input-error' : ''}`}
          name="last_name"
          onChange={handleChange}
          placeholder="Last Name"
          value={formData.last_name}
        />
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
        <input
          className="signup-input"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          value={formData.password}
        />

        {fieldErrors && Object.values(fieldErrors).length > 0 && <Alert type="danger" messages={Object.values(fieldErrors)} />}

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


