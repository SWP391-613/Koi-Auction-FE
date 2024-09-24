import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faHouse, faQuestion } from "@fortawesome/free-solid-svg-icons";
import NavigateButton from "../shared/NavigateButton.jsx";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-gray-50 dark:bg-gray-800 py-4 px-8 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-col md:flex-row">
        <button
          onClick={() => navigate("/")}
          className="bg-[#F9FAFB] hover:bg-[#F9FAFB] mb-4 md:mb-0"
        >
          <img
            src="/koi-svgrepo-com.svg"
            alt="Koi Auction Logo"
            className="w-12"
          />
        </button>
        <nav className="flex flex-col md:flex-row gap-4 md:gap-10 mb-4 md:mb-0 w-full md:w-auto">
          <NavigateButton
            text="Home"
            to="/"
            icon={<FontAwesomeIcon icon={faHouse} />}
            className="text-xl bg-blue-300 hover:bg-blue-400 dark:hover:bg-gray-700 transition-colors duration-300"
          />
          <NavigateButton
            text="Auctions"
            to="/auctions"
            icon={<FontAwesomeIcon icon={faFire} />}
            className="bg-[#F9FAFB] text-xl font-bold text-black dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-xl transition-colors duration-300"
          />
          <NavigateButton
            text="About"
            to="/about"
            icon={<FontAwesomeIcon icon={faQuestion} />}
            className="bg-[#F9FAFB] text-xl font-bold text-black dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-xl transition-colors duration-300"
          />
        </nav>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {isLoggedIn ? (
            <>
              <Avatar
                alt={user.name}
                src={user.avatar}
                className="w-10 h-10 border-2 border-blue-500 transition-transform duration-300 hover:scale-110"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className=" text-xl text-blue-600 bg-[#F9FAFB] hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-xl bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
              >
                Register
              </button>
            </div>
          )}
          <label className="theme-switch relative inline-block w-[5em] h-10">
            <input
              type="checkbox"
              className="opacity-0 w-0 h-0"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider round absolute cursor-pointer inset-0 bg-blue-400 dark:bg-gray-700 transition-all duration-500 rounded-full overflow-hidden">
              <span className="absolute w-[3.375em] h-[3.375em] bg-white/10 rounded-full -left-2 -top-2 transition-all duration-300"></span>
              <span className="absolute w-[2.125em] h-[2.125em] bg-yellow-400 dark:bg-gray-300 rounded-full left-1 top-1 transition-all duration-500 flex items-center justify-center">
                <span className="dark:block hidden w-full h-full rounded-full relative overflow-hidden">
                  <span className="absolute w-3 h-3 bg-gray-500 rounded-full top-3 left-1"></span>
                  <span className="absolute w-1.5 h-1.5 bg-gray-500 rounded-full top-[15px] left-[22px]"></span>
                  <span className="absolute w-1 h-1 bg-gray-500 rounded-full top-1 left-[13px]"></span>
                </span>
              </span>
            </span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;
