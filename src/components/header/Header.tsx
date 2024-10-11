import React, { useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "../../contexts/useUserData";
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
  faScrewdriver,
  faLock,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames"; // Install this package for easier class management

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
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  button,
  isActive,
  onClick,
}) => {
  const baseClasses =
    "flex items-center rounded-full font-bold px-4 py-2 hover:text-white transition duration-300 ease-in-out";
  const activeClasses = "bg-[#4f92d1] text-white hover:text-white";
  const inactiveClasses =
    "text-gray-600 bg-gray-200 hover:bg-[#4f92d1] hover:text-white";

  if (button.to) {
    return (
      <Link
        to={button.to}
        className={classNames(
          baseClasses,
          isActive ? activeClasses : inactiveClasses,
        )}
        onClick={onClick}
      >
        {button.icon}
        <span className="ml-2">{button.text}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={button.onClick}
      className={classNames(baseClasses, inactiveClasses)}
    >
      {button.icon}
      <span className="ml-2">{button.text}</span>
    </button>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, authLogout } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, loading, error } = useUserData();

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
      // Uncomment if needed
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

    if (isLoggedIn && user) {
      const role = user.role_name; // Assuming the first role is the primary role
      switch (role) {
        case "manager":
          baseButtons.push({
            text: "Manager",
            to: "/managers",
            icon: <FontAwesomeIcon icon={faLock} />,
          });
          break;
        case "staff":
          baseButtons.push({
            text: "Staff",
            to: "/staffs",
            icon: <FontAwesomeIcon icon={faScrewdriver} />,
          });
          break;
        case "breeder":
          baseButtons.push({
            text: "Breeder",
            to: "/breeders",
            icon: <FontAwesomeIcon icon={faFish} />,
          });
          break;
        case "member":
          baseButtons.push({
            text: "Orders",
            to: "/orders",
            icon: <FontAwesomeIcon icon={faCartShopping} />,
          });
          break;
        // Add more cases for other roles if needed
      }
    }

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
          text: "My Account",
          to: getMyAccountUrl(),
          icon: <FontAwesomeIcon icon={faUser} />,
        },
        {
          text: "Log Out",
          onClick: () => {
            authLogout();
            navigate("/");
          },
          icon: <FontAwesomeIcon icon={faSignOutAlt} />,
        },
      ];
    } else {
      return [
        {
          text: "Sign up",
          to: "/register",
        },
        {
          text: "Login",
          to: "/login",
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
    <header className="bg-gray-200 px-4 py-2 shadow-md transition-all duration-300 box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo and Title */}
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-6">
          {navButtons.map((button, index) => (
            <HeaderButton
              key={index}
              button={button}
              isActive={button.to ? isActive(button.to) : false}
            />
          ))}
        </nav>

        {/* Desktop Account Buttons */}
        <div className="hidden md:flex md:gap-6">
          {accountButtons.map((button, index) => (
            <HeaderButton
              key={index}
              button={button}
              isActive={false}
              onClick={() => {
                if (button.onClick) {
                  button.onClick();
                }
                closeNav();
              }}
            />
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden bg-gray-200 rounded-2xl p-2"
          onClick={toggleNav}
          aria-label="Toggle navigation menu"
        >
          <FontAwesomeIcon
            icon={isNavOpen ? faTimes : faBars}
            className="h-6 w-6 text-gray-600"
          />
        </button>
      </div>

      {/* Mobile Slide-Out Menu */}
      <div
        className={classNames(
          "fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden",
          { "translate-x-0": isNavOpen, "translate-x-full": !isNavOpen },
        )}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={closeNav}
            aria-label="Close navigation menu"
            className="bg-gray-200 rounded-2xl p-2"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold mb-4">Navigation</h2>
          {navButtons.map((button, index) => (
            <HeaderButton
              key={index}
              button={button}
              isActive={button.to ? isActive(button.to) : false}
              onClick={closeNav}
            />
          ))}
          <h2 className="text-lg font-semibold mt-6 mb-4">Account</h2>
          {accountButtons.map((button, index) => (
            <HeaderButton
              key={index}
              button={button}
              isActive={false}
              onClick={closeNav}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
