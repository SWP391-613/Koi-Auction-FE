import React, { createContext, useContext, useState } from 'react';

interface NavbarContextType {
  isNavCollapsed: boolean;
  toggleNavCollapse: () => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const toggleNavCollapse = () => {
    setIsNavCollapsed(prev => !prev);
  };

  return (
    <NavbarContext.Provider value={{ isNavCollapsed, toggleNavCollapse }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}