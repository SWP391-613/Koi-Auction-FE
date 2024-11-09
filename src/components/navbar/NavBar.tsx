import React, { useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "../../hooks/useUserData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SecurityIcon from "@mui/icons-material/Security";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  faBars,
  faTimes,
  faFire,
  faHouse,
  faQuestion,
  faUser,
  faSignOutAlt,
  faFish,
  faScrewdriver,
  faLock,
  faCartShopping,
  faBook,
  faChevronLeft,
  faChevronRight,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames"; // Install this package for easier class management
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import { useNavbar } from "../../contexts/NavbarContext";

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

const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  navButtons: NavButton[];
  accountButtons: NavButton[];
  isActive: (path: string) => boolean; // Added this line
}> = ({ isOpen, onClose, navButtons, accountButtons, isActive }) => {
  // Added isActive here
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-lg md:hidden overflow-y-auto"
        >
          <div className="flex flex-col h-full bg-gray-100">
            <div className="flex justify-end p-4">
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="h-6 w-6 text-gray-600"
                />
              </button>
            </div>
            <div className="px-4 py-2 flex-grow bg-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                Navigation
              </h2>
              <nav>
                <ul className="space-y-4">
                  {navButtons.map((button, index) => (
                    <li key={index}>
                      <Link
                        to={button.to ?? ""}
                        className={`flex items-center p-3 rounded-lg ${
                          button.to && isActive(button.to)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        } transition-colors duration-150`}
                        onClick={onClose}
                      >
                        {button.icon} &nbsp;
                        <span className="text-lg">{button.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-800 border-b pb-2">
                Account
              </h2>
              <nav>
                <ul className="space-y-4">
                  {accountButtons.map((button, index) => (
                    <li key={index}>
                      <Link
                        to={button.to ?? ""}
                        className={`flex items-center p-3 rounded-lg ${
                          button.to && isActive(button.to)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        } transition-colors duration-150`}
                        onClick={onClose}
                      >
                        {button.icon} &nbsp;
                        <span className="text-lg">{button.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, authLogout } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useUserData();
  const { isNavCollapsed, toggleNavCollapse } = useNavbar(); // Sử dụng context

  // Define navigation and account buttons
  const navButtons: NavButton[] = useMemo(() => {
    const baseButtons = [
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
      {
        text: "Kois",
        to: "/kois",
        icon: <FontAwesomeIcon icon={faFish} />,
      },
      {
        text: "Blogs",
        to: "/blog",
        icon: <FontAwesomeIcon icon={faBook} />,
      },
      {
        text: "About",
        to: "/about",
        icon: <FontAwesomeIcon icon={faQuestion} />,
      },
    ];

    return baseButtons;
  }, [isLoggedIn, user]);

  const accountButtons: NavButton[] = useMemo(() => {
    if (isLoggedIn && user) {
      const getMyAccountUrl = () => {
        switch (user.role_name) {
          case "breeder":
            return "/breeders";
          case "staff":
            return "/staffs"; //notice the s at the end
          case "manager":
            return "/managers";
          default:
            return `/users/${user.id}`;
        }
      };

      return [
        {
          // do like switch case
          text: "Privacy Policy",
          to: getMyAccountUrl(),
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
          to: "/auth",
          icon: <FontAwesomeIcon icon={faUser} />,
        },
      ];
    }
  }, [isLoggedIn, user, authLogout, navigate]);

  // Determine if a path is active
  const isActive = (path: string) => location.pathname === path;

  // Toggle navigation menu
  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const closeNav = () => setIsNavOpen(false);

  return (
    <nav
      className={`fixed left-0 top-0 flex h-full ${isNavCollapsed ? "w-20" : "w-60"} flex-col bg-[#1E2640] text-white transition-all duration-300`}
    >
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className={`flex items-center text-xl font-bold ${isNavCollapsed ? "justify-center" : ""}`}
        >
          <img src="/favicon.svg" alt="Koi Auction Logo" className="w-8 mr-2" />
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

      <div className="flex-grow overflow-y-auto">
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

      <div className="border-t-4 border-gray-700/50 mt-auto p-4">
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
    </nav>
  );
};

export default Header;
