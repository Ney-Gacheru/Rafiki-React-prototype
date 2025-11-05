import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Usage:
 * <ProtectedRoute> ...children... </ProtectedRoute>
 * OR with allowedRoles:
 * <ProtectedRoute allowedRoles={['student','educator']}>...</ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div style={{padding:20}}>Loading…</div>;

  if (!currentUser) {
    // send to login and keep original path in state
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(currentUser.role)) {
      // redirect to user's default area
      const defaultRoute = currentUser.role ? `/${currentUser.role === "vendor" || currentUser.role === "customer" ? "market" : "lms"}` : "/";
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return children;
}
