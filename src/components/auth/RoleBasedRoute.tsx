import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import { Role } from "~/types/roles.type";
import { getCookie, parseRoles } from "~/utils/cookieUtils";

interface RoleBasedRouteProps {
  allowedRoles: Role[];
  redirectPath?: string;
}

export function routeUserToEachPage(roleName: Role): string {
  switch (roleName) {
    case "ROLE_MANAGER": return "/managers";
    case "ROLE_STAFF": return "/staffs";
    case "ROLE_BREEDER": return "/breeders";
    case "ROLE_MEMBER":
    default: return "/";
  }
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  redirectPath = "/login",
}) => {
  const { isLoggedIn, user } = useAuth();
  const token = getCookie("access_token");
  const storedRoles = getCookie("user_roles");

  if (!isLoggedIn || !token) {
    return <Navigate to={redirectPath} replace />;
  }

  const roles = user?.roles || parseRoles(storedRoles) as Role[];

  console.log("User roles:", roles);
  console.log("Allowed roles:", allowedRoles);

  const hasAllowedRole = roles.some((role: Role) =>
    allowedRoles.includes(role)
  );
  console.log("Has allowed role:", hasAllowedRole);

  if (!hasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;