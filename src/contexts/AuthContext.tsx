import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  setCookie,
  getCookie,
  eraseCookie,
  parseRoles,
} from "~/utils/cookieUtils";
import { doLogout } from "~/utils/apiUtils";
import { UserLoginResponse } from "~/types/users.type";
import { AuthLoginData } from "~/types/auth.types";

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthLoginData | null;
  authLogin: (userData: Partial<UserLoginResponse>) => void;
  authLogout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthLoginData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("access_token");
    const roles = parseRoles(getCookie("user_roles"));
    const id = getCookie("user_id");
    const username = getCookie("username");

    if (token && roles.length > 0 && id && username) {
      setIsLoggedIn(true);
      setUser({
        token,
        roles,
        id: parseInt(id, 10),
        username,
      });
    }
  }, []);

  const authLogin = (userData: Partial<UserLoginResponse>) => {
    if (!userData.token || !userData.roles) {
      console.error("Invalid login data");
      return;
    }

    setIsLoggedIn(true);
    const authData: AuthLoginData = {
      token: userData.token,
      roles: userData.roles,
      id: userData.id || 0,
      username: userData.username || "",
    };
    setUser(authData);
    setCookie("access_token", userData.token, 1); // Set to expire in 1 day
    setCookie("user_roles", JSON.stringify(userData.roles), 1);
    if (userData.id) setCookie("user_id", userData.id.toString(), 1);
    if (userData.username) setCookie("username", userData.username, 1);
    if (userData.refresh_token)
      setCookie("refresh_token", userData.refresh_token, 7); // Set refresh token to expire in 7 days
  };

  const authLogout = async () => {
    const token = getCookie("access_token");
    if (token) {
      await doLogout(token);
    }
    setIsLoggedIn(false);
    setUser(null);
    eraseCookie("access_token");
    eraseCookie("user_roles");
    eraseCookie("user_id");
    eraseCookie("username");
    eraseCookie("refresh_token");
    navigate("/");
  };

  const getToken = () => getCookie("access_token");

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, authLogin, authLogout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
