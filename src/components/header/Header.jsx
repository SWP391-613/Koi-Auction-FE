import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faHouse, faQuestion } from "@fortawesome/free-solid-svg-icons";
import NavigateButton from "../shared/NavigateButton.tsx";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  // Button data for navigation
  const navButtons = [
    {
      text: "Home",
      to: "/",
      icon: <FontAwesomeIcon icon={faHouse} />,
      className:
        "bg-blue-300 text-xl transition-colors duration-300 hover:bg-blue-400",
    },
    {
      text: "Auctions",
      to: "/auctions",
      icon: <FontAwesomeIcon icon={faFire} />,
      className:
        "rounded-xl bg-[#F9FAFB] px-4 py-2 text-xl font-bold text-gray-900 transition-colors duration-300 hover:bg-gray-200",
    },
    {
      text: "KoiS",
      to: "/kois",
      icon: <FontAwesomeIcon icon={faFire} />,
      className:
        "rounded-xl bg-[#F9FAFB] px-4 py-2 text-xl font-bold text-gray-900 transition-colors duration-300 hover:bg-gray-200",
    },
    {
      text: "About",
      to: "/about",
      icon: <FontAwesomeIcon icon={faQuestion} />,
      className:
        "rounded-xl bg-[#F9FAFB] px-4 py-2 text-xl font-bold text-gray-900 transition-colors duration-300 hover:bg-gray-200",
    },
  ];

  return (
    <header className="bg-gray-50 px-8 py-4 shadow-md transition-all duration-300">
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
          {navButtons.map((button, index) => (
            <NavigateButton
              key={index}
              text={button.text}
              to={button.to}
              icon={button.icon}
              className={button.className}
            />
          ))}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
