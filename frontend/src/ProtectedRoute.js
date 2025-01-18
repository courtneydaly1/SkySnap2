import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from './auth/UserContext';  

function ProtectedRoute({ element, ...props }) {
  const { currentUser } = useContext(UserContext);

  
  
  // If there is no currentUser (i.e., the user is not logged in), redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected component
  return element;
}

export default ProtectedRoute;




