import React from "react";
import { NavLink } from "react-router-dom";

function Navigation({ isLoggedIn, logout }) {
  return (
    <nav style={navStyle}>
      <NavLink to="/" style={linkStyle} activestyle={activeLinkStyle}>
        Home
      </NavLink>
      {!isLoggedIn && (
        <>
         
          <NavLink to="/dashboard" style={linkStyle} activestyle={activeLinkStyle}>
            My Dashboard
          </NavLink>
          <NavLink to="/posts" style={linkStyle} activestyle={activeLinkStyle}>
            Search Snaps
          </NavLink>
          <NavLink to="/weather/search" style={linkStyle} activestyle={activeLinkStyle}>
            Find Weather
          </NavLink>
        </>
      )}
      {isLoggedIn && (
        <button onClick={logout} style={buttonStyle}>
          Logout
        </button>
      )}
    </nav>
  );
}

// Inline styles for simplicity
const navStyle = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#f4f4f4",
  padding: "1rem",
  borderBottom: "1px solid #ddd",
};

const linkStyle = {
  textDecoration: "none",
  color: "#007BFF",
  fontSize: "1rem",
  margin: "0 0.5rem",
};

const activeLinkStyle = {
  fontWeight: "bold",
  textDecoration: "underline",
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

export default Navigation;

