import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import './LoginForm.css'
import Alert from "../common/Alert"; 

function LoginForm({ login })  {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' });
  const [formErrors, setFormErrors] = useState([]);
  
  console.debug(
    "LoginForm",
    "login=", typeof login,
    "formData=", formData,
    "formErrors", formErrors,
  );

  // Calls login func prop, if sucessful, redirects to /dashboard
 // Handle form submission
 async function handleSubmit(e) {
  e.preventDefault();
  setFormErrors([]); 
  try {
    const result = await login(formData); 
    if (result.success) {
      navigate('/dashboard'); 
    } else {
      setFormErrors(result.errors); 
    }
  } catch (error) {
    console.error("Login error:", error);
    setFormErrors(["An unexpected error occurred."]);
  }
}

  // update form data
  function handleChange(e){
    const { name, value } = e.target;
    setFormData(l => ({...l, [name]: value}))
  }

  return (
    <div className="login-container">
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
          ete="current-password" 
        />

        {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null}

        <button
        type="submit" 
        className="login-button"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
