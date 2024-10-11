import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import { getCookie } from "~/utils/cookieUtils";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
}) => {
  const { isLoggedIn } = useAuth();
  const token = getCookie("access_token");

  if (!isLoggedIn && !token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
