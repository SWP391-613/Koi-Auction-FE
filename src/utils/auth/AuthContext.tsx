import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Thay đổi này: thêm giao thức http:// vào trước localhost
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/verify`,
        { token }, // Gửi token trong request body
        {
          headers: { 
            'Content-Type': 'application/json'
          },
        }
      );
      
      console.log("Verify token response:", response.data);
      
      if (response.status === 200) {
        setIsLoggedIn(true);
        if (response.data && response.data.user) {
          setUser(response.data.user);
        }
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Server response:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
      handleLogout();
    }
  };

  const authLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("token", userData.token);
    console.log("Token saved:", userData.token);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, authLogin, authLogout: handleLogout }}>
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
