import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any;
  authLogin: (userData: any) => void;
  authLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and set user data
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      // Replace with your API endpoint to verify token
      const response = await axios.get('http://your-api-url/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.valid) {
        setIsLoggedIn(true);
        setUser(response.data.user);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token');
    }
  };

  const authLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('token', userData.token);
  };

  const authLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
