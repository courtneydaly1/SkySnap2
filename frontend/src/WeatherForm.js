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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
      />
      <button type="submit" disabled={!location.trim()}>
        Get Weather
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default WeatherForm;

