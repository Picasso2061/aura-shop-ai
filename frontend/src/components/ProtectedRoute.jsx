import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');

  if (!user) {
    // Redirect to login if there is no user in localStorage
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
