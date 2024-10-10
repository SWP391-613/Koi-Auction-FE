import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { Role, UserLoginResponse } from "~/dtos/login.dto";
import { eraseCookie, getCookie, setCookie } from "~/utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import { doLogout } from "~/utils/apiUtils";

// Change this to your API URL
const API_URL = "http://localhost:4000/api/v1";

type AuthLoginData = Pick<UserLoginResponse, "token" | "roles">;

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthLoginData | null;
  authLogin: (userData: AuthLoginData) => void;
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
    const roles = getCookie("user_roles");

    if (token && roles) {
      setIsLoggedIn(true);
      setUser({
        token: token,
        roles: JSON.parse(roles), // Parse roles into an array
      });
    }
  }, []);

  useEffect(() => {
    console.log("User login data: " + JSON.stringify(user));
  }, [user]);

  const authLogin = (userData: AuthLoginData) => {
    setIsLoggedIn(true);
    setUser({
      token: userData.token,
      roles: userData.roles,
    });
    setCookie("access_token", userData.token, 1);
    setCookie("user_roles", JSON.stringify(userData.roles), 1);
  };

  const authLogout = async () => {
    const token = getCookie("access_token");
    if (token) {
      doLogout(token);
    }
    // Clear the user data and token
    setIsLoggedIn(false);
    setUser(null);
    eraseCookie("access_token");
    eraseCookie("user_roles");
    navigate("/");
  };

  const getToken = () => {
    return getCookie("access_token");
  };

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
