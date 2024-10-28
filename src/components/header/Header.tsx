import React from "react";
import { useNavbar } from "../../contexts/NavbarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faSun } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { isNavCollapsed } = useNavbar();
  const { user } = useAuth();

  return (
    <header
      className={`
        fixed top-0
        ${isNavCollapsed ? "left-20" : "left-64"} 
        right-0
        h-16 
        bg-white 
        shadow-sm
        z-10 
        transition-all 
        duration-300
      `}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search auctions, koi, or breeders..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-6">
          {/* Theme Toggle */}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FontAwesomeIcon icon={faSun} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FontAwesomeIcon icon={faBell} className="text-gray-600" />
              <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
          </div>

          {/* Cart */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                5
              </span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-sm">
              <div className="font-medium text-gray-700">
                {user?.name || "John Doe"}
              </div>
              <div className="text-gray-500 text-xs">Premium Member</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
