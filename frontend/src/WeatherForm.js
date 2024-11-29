import React, { useState } from "react";

function WeatherForm({ onSubmitLocation }) {
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError("Please enter a valid location.");
      return;
    }
    setError(null); // Clear error if input is valid
    onSubmitLocation(location.trim());
    setLocation(""); // Clear input field
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <label htmlFor="location" style={labelStyle}>
        Location:
      </label>
      <input
        id="location"
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        style={inputStyle}
        autoFocus
      />
      <button type="submit" disabled={!location.trim()} style={buttonStyle}>
        Get Weather
      </button>
      {error && <p style={errorStyle}>{error}</p>}
    </form>
  );
}

// Inline styles for simplicity
const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  marginTop: "2rem",
};

const labelStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
};

const inputStyle = {
  padding: "0.5rem",
  width: "100%",
  maxWidth: "300px",
  fontSize: "1rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const errorStyle = {
  color: "red",
  fontSize: "0.9rem",
};

export default WeatherForm;

