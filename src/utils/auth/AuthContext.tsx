import React, { createContext, useState, useContext } from "react";
import axios from "axios";

// Change this to your API URL
const API_URL = "http://localhost:4000/api/v1";

interface AuthContextType {
  isLoggedIn: boolean;
  user: any;
  authLogin: (userData: any) => void;
  authLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const authLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("access_token", userData.token);
    console.log("Token saved:", userData.token);
  };

  const authLogout = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await axios.post(
          `${API_URL}/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in Authorization header
            },
          }
        );
        console.log("Logout successful.");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
    // Clear the user data and token
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("access_token");
    console.log("Logged out and token removed.");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, authLogin, authLogout }}>
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
