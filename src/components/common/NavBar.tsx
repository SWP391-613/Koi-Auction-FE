import {
  faBook,
  faChevronLeft,
  faChevronRight,
  faFire,
  faHouse,
  faQuestion,
  faTimes,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DescriptionIcon from "@mui/icons-material/Description";
import SecurityIcon from "@mui/icons-material/Security";
import Tooltip from "@mui/material/Tooltip";
import classNames from "classnames"; // Install this package for easier class management
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTING_PATH } from "~/constants/endPoints";
import { NAVBAR_LABEL } from "~/constants/label";
import { useAuth } from "../../contexts/AuthContext";
import { useNavbar } from "../../contexts/NavbarContext";
import { useUserData } from "../../hooks/useUserData";

// Define interfaces for navigation and account buttons
interface NavButton {
  text: string;
  to?: string;
  onClick?: () => void;
  icon?: JSX.Element;
}

interface HeaderButtonProps {
  button: NavButton;
  isActive: boolean;
  onClick?: () => void;
  isCollapsed: boolean;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  button,
  isActive,
  onClick,
  isCollapsed,
}) => {
  const baseClasses =
    "flex items-center rounded-full font-bold px-4 py-2 hover:text-white transition duration-300 ease-in-out";
  const activeClasses = "bg-[#4f92d1] text-white hover:text-white";
  const inactiveClasses = "text-gray-400 hover:bg-[#4f92d1] hover:text-white";

  const buttonContent = (
    <>
      {button.icon}
      {!isCollapsed && <span className="ml-2">{button.text}</span>}
    </>
  );

  if (button.to) {
    return (
      <Tooltip title={isCollapsed ? button.text : ""} placement="right">
        <Link
          to={button.to}
          className={classNames(
            baseClasses,
            isActive ? activeClasses : inactiveClasses,
          )}
          onClick={onClick}
        >
          {buttonContent}
        </Link>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={isCollapsed ? button.text : ""} placement="right">
      <button
        onClick={button.onClick}
        className={classNames(baseClasses, inactiveClasses)}
      >
        {buttonContent}
      </button>
    </Tooltip>
  );
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, authLogout } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useUserData();
  const {
    isNavCollapsed,
    isMobileNavVisible,
    toggleNavCollapse,
    toggleMobileNav,
  } = useNavbar();
  const isMobile = useIsMobile();

  // Define navigation and account buttons
  const navButtons: NavButton[] = useMemo(() => {
    const baseButtons = [
      {
        text: NAVBAR_LABEL.HOME,
        to: ROUTING_PATH.ROOT,
        icon: <FontAwesomeIcon icon={faHouse} />,
      },
      {
        text: NAVBAR_LABEL.AUCTIONS,
        to: ROUTING_PATH.AUCTIONS,
        icon: <FontAwesomeIcon icon={faFire} />,
      },
      {
        text: NAVBAR_LABEL.BLOGS,
        to: ROUTING_PATH.BLOG,
        icon: <FontAwesomeIcon icon={faBook} />,
      },
      {
        text: NAVBAR_LABEL.ABOUT,
        to: ROUTING_PATH.ABOUT,
        icon: <FontAwesomeIcon icon={faQuestion} />,
      },
    ];

    return baseButtons;
  }, [isLoggedIn, user]);

  const accountButtons: NavButton[] = useMemo(() => {
    if (isLoggedIn && user) {
      return [
        {
          text: "Privacy Policy",
          to: "/privacy",
          icon: <SecurityIcon />,
        },
        {
          text: "Terms and Conditions",
          to: "/terms",
          icon: <DescriptionIcon />,
        },
      ];
    } else {
      return [
        {
          text: "Login",
          to: isMobile ? "/login" : "/auth",
          icon: <FontAwesomeIcon icon={faUser} />,
        },
      ];
    }
  }, [isLoggedIn, user, isMobile]);

  // Determine if a path is active
  const isActive = (path: string) => location.pathname === path;

  // Toggle navigation menu
  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const closeNav = () => setIsNavOpen(false);

  return (
    <>
      {/* Mobile Toggle Button - Bottom Center */}
      <div className="md:hidden fixed top-2 left-2 z-[60]">
        <button
          title={isMobileNavVisible ? "Close" : "Open"}
          onClick={toggleMobileNav}
          className="opacity-30 hover:opacity-100
            bg-[#1E2640] text-white p-2 rounded-lg shadow-lg
            transition-opacity duration-300"
        >
          <FontAwesomeIcon icon={isMobileNavVisible ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Navbar - Add flex column and min-height */}
      <nav
        className={`fixed transition-all duration-300 bg-[#1E2640] text-white
          md:left-0 md:top-0 md:h-full
          ${isNavCollapsed ? "md:w-20" : "md:w-60"}

          /* Mobile Styles */
          left-0 bottom-0 w-full h-[60px] md:h-full
          ${isMobileNavVisible ? "translate-y-0" : "translate-y-full"}
          md:translate-y-0
          z-[55]
          /* Add these classes */
          flex flex-col min-h-0`}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex p-4 justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center text-xl font-bold ${isNavCollapsed ? "justify-center" : ""}`}
          >
            <img
              src="/favicon.svg"
              alt="Koi Auction Logo"
              className="w-8 mr-2"
            />
            {!isNavCollapsed && <span>KoiAuction</span>}
          </button>
          <button
            onClick={toggleNavCollapse}
            className="text-white hover:text-gray-300 transition-colors duration-200"
            title={isNavCollapsed ? "Show more" : "Hide"}
          >
            <FontAwesomeIcon
              icon={isNavCollapsed ? faChevronRight : faChevronLeft}
            />
          </button>
        </div>

        {/* Navigation Content - Update classes for proper flex behavior */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Mobile View - Centered Icons with App Logo */}
          <div className="md:hidden flex justify-center items-center h-full">
            <div className="flex justify-around items-center w-full max-w-md px-4">
              {/* First 2 nav buttons */}
              {navButtons.slice(0, 2).map((button, index) => (
                <Link
                  key={index}
                  to={button.to || ""}
                  className="text-white flex flex-col items-center w-14"
                  onClick={() => isMobileNavVisible && toggleMobileNav()}
                >
                  <div className="text-lg mb-1">{button.icon}</div>
                  <span className="text-[10px] text-center whitespace-nowrap">
                    {button.text}
                  </span>
                </Link>
              ))}

              {/* App Logo in Center */}
              <Link
                to="/"
                className="text-white flex flex-col items-center w-14"
              >
                <div className="text-xl mb-1">
                  <img
                    src="/favicon.svg"
                    alt="Koi Auction Logo"
                    className="w-7 h-7"
                  />
                </div>
                <span className="text-[10px] text-center whitespace-nowrap">
                  Koi Auction
                </span>
              </Link>

              {/* Next nav button and account button */}
              <Link
                to={navButtons[2].to || ""}
                className="text-white flex flex-col items-center w-14"
                onClick={() => isMobileNavVisible && toggleMobileNav()}
              >
                <div className="text-lg mb-1">{navButtons[2].icon}</div>
                <span className="text-[10px] text-center whitespace-nowrap">
                  {navButtons[2].text}
                </span>
              </Link>

              {/* Account Button */}
              <Link
                to={accountButtons[0].to || ""}
                className="text-white flex flex-col items-center w-14"
                onClick={() => isMobileNavVisible && toggleMobileNav()}
              >
                <div className="text-lg mb-1">{accountButtons[0].icon}</div>
                <span className="text-[10px] text-center whitespace-nowrap">
                  {accountButtons[0].text}
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop View - Add overflow handling */}
          <div className="hidden md:block flex-1 overflow-y-auto">
            <ul className="space-y-2 px-4">
              {navButtons.map((button, index) => (
                <li key={index}>
                  <HeaderButton
                    button={button}
                    isActive={button.to ? isActive(button.to) : false}
                    isCollapsed={isNavCollapsed}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Account Buttons Section - Remove mt-auto */}
          <div className="border-t-4 border-gray-700/50 p-4 shrink-0">
            {accountButtons.map((button, index) => (
              <HeaderButton
                key={index}
                button={button}
                isActive={false}
                isCollapsed={isNavCollapsed}
                onClick={() => {
                  if (button.onClick) {
                    button.onClick();
                  }
                }}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
