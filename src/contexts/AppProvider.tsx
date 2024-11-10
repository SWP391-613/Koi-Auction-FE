import React from "react";
import { createContext, useContext } from "react";

// Create a context for the app
const AppContext = createContext();

const AppProvider = ({ children }) => {
  // Define any state or functions you want to provide to the context
  const value = {
    // Example: user: { name: 'Admin' }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
