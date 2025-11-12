// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  // 1. Get getDefaultArea from the context
  const { currentUser, loading, getDefaultArea } = useAuth();
  const loc = useLocation();

  if (loading) return <div style={{padding:20}}>Loading…</div>;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(currentUser.role)) {
      
      // 2. Use the function here!
      const defaultRoute = `/${getDefaultArea(currentUser)}`; // e.g., "/market" or "/lms"
      
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return children;
}