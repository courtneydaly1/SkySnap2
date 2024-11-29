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
  const [formData, setFormData] = useState({ 
    first_name: '', 
    last_name: '',
    username: '', 
    password: '', 
    local_zipcode: '' 
  });
  const [formErrors, setFormErrors] = useState([]);
  const [usernameExists, setUsernameExists] = useState(false); // Track username existence
  const navigate = useNavigate();

  console.debug(
    "SignupForm",
    "signup=", typeof signup,
    "formData=", formData,
    "formErrors=", formErrors,
  );

  // Handles input changes and updates form data
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));

    // Check username availability as the user types
    if (name === "username") {
      checkUsernameAvailability(value);
    }
  };

  /** Check if username already exists */
  async function checkUsernameAvailability(username) {
    if (!username) return;

    try {
      const result = await WeatherApi.checkUsername(username);
      setUsernameExists(result.exists);  // Assuming the API returns { exists: true/false }
    } catch (err) {
      console.error("Error checking username availability:", err);
      setUsernameExists(false); // Default to false if API fails
    }
  }

  /** Validate the form before submitting */
  function validateForm() {
    const errors = [];
    // Validate ZIP code
    if (!/^\d{5}$/.test(formData.local_zipcode)) {
      errors.push("Invalid ZIP code format.");
    }
    // Validate username existence
    if (usernameExists) {
      errors.push("Username is already taken.");
    }

    setFormErrors(errors);
    return errors.length === 0;  // Return true if no errors
  }

  /** Handle form submit:
   *
   * Calls signup func prop and, if successful, redirects to /dashboard.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();

    // Validate form
    if (!validateForm()) return;  // Don't submit if there are errors

    const result = await signup(formData);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setFormErrors(result.errors || []);
    }
  }

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          className={`signup-input ${formErrors.includes('Invalid ZIP code format.') ? 'input-error' : ''}`}
          name="first_name"
          onChange={handleChange}
          placeholder="First Name"
          required
          id="first_name"
          value={formData.first_name}
          autoComplete="given-name"
        />
        <input
          className={`signup-input ${formErrors.includes('Invalid ZIP code format.') ? 'input-error' : ''}`}
          name="last_name"
          onChange={handleChange}
          placeholder="Last Name"
          required
          id="last_name"
          value={formData.last_name}
          autoComplete="family-name"
        />
        <input
          className={`signup-input ${usernameExists ? 'input-error' : ''}`}
          name="username"
          onChange={handleChange}
          placeholder="Username"
          required
          id="username"
          value={formData.username}
          autoComplete="username"
        />
        {usernameExists && <span className="error-message">Username is already taken.</span>}
        
        <input
          className={`signup-input ${formErrors.includes('Invalid ZIP code format.') ? 'input-error' : ''}`}
          name="local_zipcode"
          onChange={handleChange}
          placeholder="Zipcode"
          required
          id="local_zipcode"
          value={formData.local_zipcode}
          autoComplete="postal-code"
        />
        <input
          className="signup-input"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          required
          id="password"
          value={formData.password}
          autoComplete="new-password"
        />
        
        {formErrors && formErrors.length > 0 && (
          <Alert type="danger" messages={formErrors} />
        )}

        <button 
          type="submit" 
          className="signup-button"
          disabled={usernameExists}  // Disable submit if username is already taken
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupForm;




