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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
  const [formErrors, setFormErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');  
  console.debug(
    "LoginForm",
    "login=", typeof login,
    "formData=", formData,
    "formErrors", formErrors,
  );

  /** Handle form submission:
   *
   * Calls login func prop and, if successful, redirects to /dashboard.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setFormErrors([]);  
    setIsLoading(true); 

    const result = await login(formData); 
    setIsLoading(false); 

    if (result.success) {
      navigate('/dashboard');  
    } else {
      setFormErrors(result.errors || ['Login failed. Please try again.']);  
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
          Created successfully!
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

