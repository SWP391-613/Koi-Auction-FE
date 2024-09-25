import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faHouse, faQuestion } from "@fortawesome/free-solid-svg-icons";
import NavigateButton from "../shared/NavigateButton.tsx";

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
    <header className="bg-gray-50 px-8 py-4 shadow-md transition-all duration-300 dark:bg-gray-800">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between md:flex-row">
        <button
          onClick={() => navigate("/")}
          className="mb-4 bg-[#F9FAFB] hover:bg-[#F9FAFB] md:mb-0"
        >
          <img
            src="/koi-svgrepo-com.svg"
            alt="Koi Auction Logo"
            className="w-12"
          />
        </button>
        <nav className="mb-4 flex w-full flex-col gap-4 md:mb-0 md:w-auto md:flex-row md:gap-10">
          <NavigateButton
            text="Home"
            to="/"
            icon={<FontAwesomeIcon icon={faHouse} />}
            className="bg-blue-300 text-xl transition-colors duration-300 hover:bg-blue-400 dark:hover:bg-gray-700"
          />
          <NavigateButton
            text="Auctions"
            to="/auctions"
            icon={<FontAwesomeIcon icon={faFire} />}
            className="rounded-xl bg-[#F9FAFB] px-4 py-2 text-xl font-bold text-gray-900 transition-colors duration-300 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
          />
          <NavigateButton
            text="KoiS"
            to="/kois"
            icon={<FontAwesomeIcon icon={faFire} />}
            className="rounded-xl bg-[#F9FAFB] px-4 py-2 text-xl font-bold text-gray-900 transition-colors duration-300 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
          />
          <NavigateButton
            text="About"
            to="/about"
            icon={<FontAwesomeIcon icon={faQuestion} />}
            className="rounded-xl bg-[#F9FAFB] px-4 py-2 text-xl font-bold text-gray-900 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          />
        </nav>
        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
          {isLoggedIn ? (
            <>
              <Avatar
                alt={user.name}
                src={user.avatar}
                className="h-10 w-10 border-2 border-blue-500 transition-transform duration-300 hover:scale-110"
              />
              <button
                className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-600"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl bg-[#F9FAFB] px-4 py-2 text-xl font-semibold text-blue-600 transition-colors duration-300 hover:bg-blue-500 hover:text-white"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-xl bg-red-500 px-4 py-2 text-xl font-semibold text-white transition-colors duration-300 hover:bg-red-600"
              >
                Register
              </button>
            </div>
          )}
          <label className="theme-switch relative inline-block h-10 w-[5em]">
            <input
              type="checkbox"
              className="h-0 w-0 opacity-0"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider round absolute inset-0 cursor-pointer overflow-hidden rounded-full bg-blue-400 transition-all duration-500 dark:bg-gray-700">
              <span className="absolute -left-2 -top-2 h-[3.375em] w-[3.375em] rounded-full bg-white/10 transition-all duration-300"></span>
              <span className="absolute left-1 top-1 flex h-[2.125em] w-[2.125em] items-center justify-center rounded-full bg-yellow-400 transition-all duration-500 dark:bg-gray-300">
                <span className="relative hidden h-full w-full overflow-hidden rounded-full dark:block">
                  <span className="absolute left-1 top-3 h-3 w-3 rounded-full bg-gray-500"></span>
                  <span className="absolute left-[22px] top-[15px] h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                  <span className="absolute left-[13px] top-1 h-1 w-1 rounded-full bg-gray-500"></span>
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
