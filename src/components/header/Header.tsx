import React, { useMemo } from "react";
import { useNavbar } from "../../contexts/NavbarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBook, faCartShopping, faFire, faFish, faHouse, faLock, faQuestion, faScrewdriver, faSearch, faSun } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useUserData } from "~/hooks/useUserData";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Header = () => {
  const { isNavCollapsed } = useNavbar();
  const { user } = useUserData();
  const { isLoggedIn, authLogout } = useAuth();
  const navigate = useNavigate();


  return (
    <header
      className={`
        fixed top-0
        ${isNavCollapsed ? "left-20" : "left-64"} 
        right-0
        h-16 
        bg-white 
        shadow-sm
        z-10 
        transition-all 
        duration-300
      `}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search auctions, koi, or breeders..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-6">
          {/* Theme Toggle */}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FontAwesomeIcon icon={faSun} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FontAwesomeIcon icon={faBell} className="text-gray-600" />
              <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
          </div>

          {/* Cart/Role Icon */}
          <div className="relative">
            <button 
              onClick={() => {
                if (isLoggedIn && user) {
                  switch (user.role_name) {
                    case "manager":
                      navigate("/managers");
                      break;
                    case "staff":
                      navigate("/staffs");
                      break;
                    case "breeder":
                      navigate("/breeders");
                      break;
                    case "member":
                      navigate("/orders");
                      break;
                  }
                } else {
                  toast.warning("Please login to access this feature!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {isLoggedIn && user ? (
                <>
                  {/* Show different icons based on role */}
                  {user.role_name === "manager" && (
                    <FontAwesomeIcon icon={faLock} className="h-6 w-6 text-gray-600" />
                  )}
                  {user.role_name === "staff" && (
                    <FontAwesomeIcon icon={faScrewdriver} className="h-6 w-6 text-gray-600" />
                  )}
                  {user.role_name === "breeder" && (
                    <FontAwesomeIcon icon={faFish} className="h-6 w-6 text-gray-600" />
                  )}
                  {user.role_name === "member" && (
                    <FontAwesomeIcon icon={faCartShopping} className="h-6 w-6 text-gray-600" />
                  )}
                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    5
                  </span>
                </>
              ) : (
                <FontAwesomeIcon icon={faCartShopping} className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/login")}
              className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
            >
              <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
              <div className="flex items-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 438.549 438.549">
                <path d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z"/>
                </svg> 
                {/* đây là icon github */}
                <span className="ml-1 text-white">BID NOW</span>
              </div>
              <div className="ml-2 flex items-center gap-1 text-sm md:flex">
                <svg
                  className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
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
                {/* <span className="inline-block tabular-nums tracking-wider font-display font-medium text-white">
                  6
                </span> */}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
