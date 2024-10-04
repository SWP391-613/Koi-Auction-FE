import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import { Role } from "~/dtos/login.dto";

interface RoleBasedRouteProps {
  allowedRoles: Role[];
  redirectPath?: string;
}

export function routeUserToEachPage(roleName: string): string {
  let route;
  if (roleName === "ROLE_MANAGER") {
    route = "/manager";
  } else if (roleName === "ROLE_STAFF") {
    route = "/staff";
  } else if (roleName === "ROLE_BREEDER") {
    route = "/breeder";
  } else if (roleName === "ROLE_MEMBER") {
    route = "/";
  } else {
    route = "/";
  }
  return route;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  redirectPath = "/login",
}) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn || !user) {
    return <Navigate to={redirectPath} replace />;
  }

  debugger;
  console.log("User roles:", user.roles);
  debugger;
  console.log("Allowed roles:", allowedRoles);

  const hasAllowedRole = user.roles?.some((role) =>
    allowedRoles.includes(role),
  );

  if (!hasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
