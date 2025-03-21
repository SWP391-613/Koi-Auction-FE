import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if route requires admin and user is not admin
  if (requireAdmin) {
    // Redirect non-admin users to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const RejectedRoute = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return !isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to={location.state?.from ?? "/"} replace />
  );
};
