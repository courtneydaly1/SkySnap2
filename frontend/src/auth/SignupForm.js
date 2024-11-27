import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css'; 
import Alert from "../common/Alert"


/** Signup form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls signup function prop
 * - redirects to /companies route
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
  const navigate = useNavigate();

  console.debug(
    "SignupForm",
    "signup=", typeof signup,
    "formData=", formData,
    "formErrors=", formErrors,
);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /** Handle form submit:
   *
   * Calls login func prop and, if successful, redirect to /dashboard.
   */

  async function handleSubmit(e) {
    e.preventDefault();
    let result = await signup(formData);
    if (result.success){
     navigate("/dashboard");
    }else {
      setFormErrors(result.errors)
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }
    

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
          value = {form.first_name}
          autoComplete="given-name"
        />
        <input
          className="signup-input"
          name="last_name"
          onChange={handleChange}
          placeholder="Last Name"
          required
          id="last_name"
          value = {form.last_name}
          autoComplete="family-name"
        />
        <input
          className="signup-input"
          name="username"
          onChange={handleChange}
          placeholder="Username"
          required
          id="username"
          value = {form.username}
          autoComplete="username"
        />
        <input
          className="signup-input"
          name="local_zipcode"
          onChange={handleChange}
          placeholder="Zipcode"
          required
          id="local_zipcode"
          value = {form.local_zipcode}
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
          value = {form.password}
          autoComplete="new-password"
        />
        {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null
                }
        <button 
        type="submit" 
        className="signup-button"
        >
          Sign Up
        </button>
      </form>

    </div>
  );
}

export default SignupForm;

