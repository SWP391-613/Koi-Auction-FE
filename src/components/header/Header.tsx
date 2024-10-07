import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faFire,
  faHouse,
  faQuestion,
  faUser,
  faSignOutAlt,
  faFish,
} from "@fortawesome/free-solid-svg-icons";
import NavigateButton from "../shared/NavigateButton";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, authLogout } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Button data for navigation
  const navButtons = [
    {
      text: "Home",
      to: "/",
      icon: <FontAwesomeIcon icon={faHouse} />,
    },
    {
      text: "Auctions",
      to: "/auctions",
      icon: <FontAwesomeIcon icon={faFire} />,
    },
    // {
    //   text: "Koi",
    //   to: "/kois",
    //   icon: <FontAwesomeIcon icon={faFish} />,
    // },
    {
      text: "About",
      to: "/about",
      icon: <FontAwesomeIcon icon={faQuestion} />,
    },
  ];

  const accountButtons = [
    {
      text: "My Account",
      to: user ? `/users/${user.id}` : "/login",
      icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
      text: "Log Out",
      onClick: authLogout,
      icon: <FontAwesomeIcon icon={faSignOutAlt} />,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-50 px-4 py-2 shadow-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <button
          onClick={() => navigate("/")}
          id="home"
          className="bg-transparent hover:bg-transparent flex items-center"
        >
          <img
            src="/koi-svgrepo-com.svg"
            alt="Koi Auction Logo"
            className="w-8"
          />
          <h1 className="ml-2 text-2xl font-bold text-red-500">Koi Auction</h1>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:gap-6">
          {navButtons.map((button, index) => (
            <NavigateButton
              key={index}
              text={button.text}
              to={button.to}
              icon={button.icon}
              className={`text-gray-600 bg-gray-100 hover:bg-[#4f92d1] hover:text-white
                ${isActive(button.to) ? "bg-[#4f92d1] text-white" : ""}`}
            />
          ))}
        </nav>
        {/* Account buttons */}
        <div className="hidden md:flex md:gap-6">
          {isLoggedIn ? (
            accountButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => {
                  button.onClick ? button.onClick() : navigate(button.to);
                }}
                className="text-gray-600 bg-gray-100 hover:bg-[#4f92d1] hover:text-white"
              >
                {button.icon}
                <span className="ml-2">{button.text}</span>
              </button>
            ))
          ) : (
            <>
              <NavigateButton
                text="Login"
                to="/login"
                className="text-gray-600 bg-gray-100 rounded-2xl ml-5 hover:bg-green-200 hover:text-white"
              />
              <NavigateButton
                text="Register"
                to="/register"
                className="text-white text-lg font-bold bg-red-500 rounded-2xl hover:bg-red-600"
              />
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden bg-gray-100 rounded-2xl"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle navigation menu"
        >
          <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile slide-out menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform
        ${isNavOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsNavOpen(false)}
            aria-label="Close navigation menu"
            className="bg-gray-100 rounded-2xl"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold mb-4">Navigation</h2>
          {navButtons.map((button, index) => (
            <NavigateButton
              key={index}
              text={button.text}
              to={button.to}
              icon={button.icon}
              className={`block w-full text-left py-2 px-4 text-gray-600 bg-gray-100 m-2
                ${isActive(button.to) ? "bg-[#4f92d1] text-white" : ""}`}
            />
          ))}
          <h2 className="text-lg font-semibold mt-6 mb-4">Account</h2>
          {isLoggedIn ? (
            accountButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsNavOpen(false);
                  button.onClick ? button.onClick() : navigate(button.to);
                }}
                className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100"
              >
                {button.icon}
                <span className="ml-2">{button.text}</span>
              </button>
            ))
          ) : (
            <>
              <button
                onClick={() => {
                  setIsNavOpen(false);
                  navigate("/login");
                }}
                className="block w-full text-center py-2 px-4 bg-gray-100 rounded-2xl
                hover:bg-green-200 text-black font-bold"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsNavOpen(false);
                  navigate("/register");
                }}
                className="block w-full text-center py-2 px-4 bg-red-500 rounded-2xl
                hover:bg-red-400 text-white font-bold mt-2"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
