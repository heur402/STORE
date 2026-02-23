// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if admin token exists in localStorage
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Not logged in → redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Logged in → show children
  return children;
};

export default ProtectedRoute;