import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import './LoginForm.css';
import Alert from "../common/Alert"; 

/** Login form.
 *
 * Shows form and manages updates to state on changes.
 * On submission:
 * - calls login function prop
 * - redirects to /dashboard route on success
 *
 * Routes -> LoginForm -> Alert
 * Routed as /login
 */

function LoginForm({ login }) {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
  const [formErrors, setFormErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');  

  /** Handle form submission:
   *
   * Calls login func prop and, if successful, redirects to /dashboard.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Reset form errors and start loading state
    setFormErrors([]);
    setIsLoading(true);
  
    try {
      // Call the login API
      const result = await login(formData);
      console.log("Login API result:", result);
  
      // After receiving the result, stop the loading spinner
      setIsLoading(false);
  
      // Check if the result contains a success field and is true
      if (result.success) {
        console.log("Login successful, redirecting to dashboard page.")
        // Destructure username and access_token from the result
        const token = result.token
        const { username, first_name, last_name, local_zipcode } = result.user;

        // Log user and token for debugging
        console.log("Destructured result:", { token, username, first_name, last_name, local_zipcode });

        
        // Check if both username and access_token are available
        if (token && username) {
          // Store the username and token in localStorage
          localStorage.setItem('username', username);
          localStorage.setItem('token', token);
          localStorage.setItem('first_name', first_name); 
          localStorage.setItem('last_name', last_name);
          localStorage.setItem('local_zipcode', local_zipcode);
         
  

          // navigate('/dashboard');

        } else {
          // Handle the case where username or access_token are missing
          setFormErrors(['Login failed. Missing userId or token.']);
        }
      } else {
        // Handle the case where the login was unsuccessful
        setFormErrors([result?.error || 'An error occurred during login.']);
      }
    } catch (error) {
      // Handle any other unexpected errors
      setIsLoading(false);
      setFormErrors([error.message || 'An unexpected error occurred.']);
    }
  }
  

  /** Update form data on change */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  return (
    <div className="login-container">
      <div>
        {success === 'true' && (
          <div className="success-message">
            Created successfully! Please log in.
          </div>
        )}
      </div>
      <h2 className="login-title">Login</h2>
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
          autoComplete="current-password" 
        />

        {formErrors.length > 0 && (
          <Alert type="danger" messages={formErrors} />
        )}

        <button
          type="submit" 
          className="login-button"
          disabled={isLoading} 
        >
          {isLoading ? 'Logging in...' : 'Login'}  
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
