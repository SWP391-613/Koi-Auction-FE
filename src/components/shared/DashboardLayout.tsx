import React, { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";

interface NavLink {
  to: string;
  label: string;
}

interface DashboardLayoutProps {
  title: string;
  navLinks: NavLink[];
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  navLinks,
  children,
}) => {
  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-3rem bg-[#686D76] shadow-md text-white">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
        </div>
        <nav className="mt-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-2 px-4 text-gray-700 hover:bg-[#F1F1F1] text-white hover:text-black font-semibold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-[#EEEEEE] overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
