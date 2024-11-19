import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

interface UserProfileProps {
  isLoggedIn: boolean;
  user: any;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  isLoggedIn,
  user,
}) => {
  const navigate = useNavigate();
  const { authLogout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMyAccountUrl = (user: any) => {
    if (!user) return "/auth";
    switch (user.role_name) {
      case "breeder":
        return "/breeders";
      case "staff":
        return "/staffs";
      case "manager":
        return "/managers";
      case "member":
        return "/members";
      default:
        return "/";
    }
  };

  const handleLogout = async () => {
    await authLogout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center space-x-3" ref={dropdownRef}>
      <div className="relative">
        {!isLoggedIn ? (
          <button
            onClick={() => navigate("/auth")}
            className="relative flex overflow-hidden items-center text-sm font-medium bg-[#CF0A0A] text-white shadow hover:bg-red/90 h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out"
          >
            <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 438.549 438.549"
              >
                <path d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z" />
              </svg>
              <span className="ml-1 text-white">BID NOW</span>
            </div>
            <div className="ml-2 flex items-center gap-1 text-sm md:flex">
              <svg
                className="w-4 h-4 text-white transition-all duration-300 group-hover:text-yellow-300"
                data-slot="icon"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={user?.avatar_url}
                alt="User avatar"
                className=" group-hover:opacity-50 w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{`${user?.first_name} ${user?.last_name}`}</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    navigate(getMyAccountUrl(user));
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  My Account
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
