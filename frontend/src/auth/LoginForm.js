import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import Alert from "../common/Alert";

function LoginForm({ login }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [formErrors, setFormErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Only read query params once when component mounts
    const urlParams = new URLSearchParams(window.location.search);
    setSuccess(urlParams.get('success'));
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset form errors and start loading state
    setFormErrors([]);
    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        const { token, user } = result;
        if (token && user) {
          debugger;
          
          const { username, first_name, last_name, local_zipcode, userId } = user;
          localStorage.setItem('userId', userId);
          localStorage.setItem('username', username);
          localStorage.setItem('token', token);
          localStorage.setItem('first_name', first_name);
          localStorage.setItem('last_name', last_name);
          localStorage.setItem('local_zipcode', local_zipcode);
        } else {
          setFormErrors(['Login failed. Missing user info or token.']);
        }
      } else {
        setFormErrors([result.error || 'Login failed.']);
      }
    } catch (error) {
      setFormErrors([error.message || 'An unexpected error occurred.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="login-container">
      {success === 'true' && (
        <div className="success-message">
          Created successfully! Please log in.
        </div>
      )}

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


