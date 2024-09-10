import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import ThemeSwitch from "../themeSwitch/ThemeSwitch";
import { useContext } from "react";
import { ThemeContext } from "../../page/theme/ThemeContext";

function Header() {
  const currentPath = window.location.pathname;
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <header className={`header-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="logo">AUCTIONKOI</div>
      <nav className="nav">
        <Link
          to="/"
          className={`nav-link ${currentPath === "/" ? "active" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M12 2L2 9v11h20V9l-10-7zm0 15c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
          <span>Home</span>
        </Link>
        <Link
          to="/auctions"
          className={`nav-link ${
            currentPath.startsWith("/auctions") ? "active" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM11 7h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
          </svg>
          <span>Auctions</span>
        </Link>
        <Link
          to="/about"
          className={`nav-link ${currentPath === "/about" ? "active" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <span>About</span>
        </Link>
      </nav>
      <div className="auth-buttons">
        <Link to="/login" className="auth-button login-button">
          Login
        </Link>
        <Link to="/register" className="auth-button register-button">
          Register
        </Link>
        <ThemeSwitch />
      </div>
    </header>
  );
}

export default Header;
