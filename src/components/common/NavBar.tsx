import {
  faBook,
  faChevronLeft,
  faChevronRight,
  faFire,
  faHouse,
  faQuestion,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DescriptionIcon from "@mui/icons-material/Description";
import SecurityIcon from "@mui/icons-material/Security";
import Tooltip from "@mui/material/Tooltip";
import classNames from "classnames"; // Install this package for easier class management
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
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
          // do like switch case
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
