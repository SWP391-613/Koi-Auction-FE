import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTING_PATH } from "~/constants/endPoints";
import { TOP_NAVBAR_LABEL } from "~/constants/label";
import { USER_STATUS } from "~/constants/status";
import { useUserData } from "~/hooks/useUserData";
import { useNavbar } from "~/contexts/NavbarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const DetailNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserData();
  const { isMobileNavVisible, toggleMobileNav } = useNavbar();

  const getNavLinks = () => {
    if (!user || user.status_name !== USER_STATUS.VERIFIED) return [];

    const basePath = `/${user.role_name}s`;
    const links = {
      member: [
        { label: TOP_NAVBAR_LABEL.MY_PROFILE, path: basePath },
        { label: TOP_NAVBAR_LABEL.ORDERS, path: `${basePath}/orders` },
        { label: TOP_NAVBAR_LABEL.PAYMENTS, path: `${basePath}/payments` },
      ],
      breeder: [
        { label: TOP_NAVBAR_LABEL.MY_PROFILE, path: basePath },
        { label: TOP_NAVBAR_LABEL.MY_KOI, path: `${basePath}/kois` },
        { label: TOP_NAVBAR_LABEL.ADD_KOI, path: `${basePath}/add-koi` },
        {
          label: TOP_NAVBAR_LABEL.REGISTER_TO_AUCTION,
          path: `${basePath}/auctions/register`,
        },
        { label: TOP_NAVBAR_LABEL.PENDING_KOI, path: `${basePath}/wishlist` },
        { label: TOP_NAVBAR_LABEL.PAYMENTS, path: `${basePath}/payments` },
      ],
      staff: [
        { label: TOP_NAVBAR_LABEL.MY_PROFILE, path: basePath },
        {
          label: TOP_NAVBAR_LABEL.AUCTION_MANAGEMENT,
          path: `${basePath}/auctions`,
        },
        { label: TOP_NAVBAR_LABEL.VERIFY_KOI, path: `${basePath}/verify/kois` },
        {
          label: TOP_NAVBAR_LABEL.ORDER_MANAGEMENT,
          path: `${basePath}/orders`,
        },
        {
          label: TOP_NAVBAR_LABEL.PAYMENT_MANAGEMENT,
          path: `${basePath}/payments`,
        },
        // {
        //   label: TOP_NAVBAR_LABEL.NOTIFICATIONS,
        //   path: `${basePath}/send-notifications`,
        // },
      ],
      manager: [
        { label: TOP_NAVBAR_LABEL.MY_PROFILE, path: basePath },
        {
          label: TOP_NAVBAR_LABEL.AUCTION_MANAGEMENT,
          path: `${basePath}/auctions`,
        },
        { label: TOP_NAVBAR_LABEL.KOI_MANAGEMENT, path: `${basePath}/kois` },
        {
          label: TOP_NAVBAR_LABEL.BREEDER_MANAGEMENT,
          path: `${basePath}/breeders`,
        },
        {
          label: TOP_NAVBAR_LABEL.STAFF_MANAGEMENT,
          path: `${basePath}/staffs`,
        },
        {
          label: TOP_NAVBAR_LABEL.MEMBER_MANAGEMENT,
          path: `${basePath}/members`,
        },
        {
          label: TOP_NAVBAR_LABEL.ORDER_MANAGEMENT,
          path: `${basePath}/orders`,
        },
        {
          label: TOP_NAVBAR_LABEL.PAYMENT_MANAGEMENT,
          path: `${basePath}/payments`,
        },
      ],
    };

    return links[user.role_name as keyof typeof links] || [];
  };

  const shouldShowNavbar =
    location.pathname.includes(ROUTING_PATH.MEMBERS) ||
    location.pathname.includes(ROUTING_PATH.BREEDERS) ||
    location.pathname.includes(ROUTING_PATH.STAFFS) ||
    location.pathname.includes(ROUTING_PATH.MANAGERS);

  if (!shouldShowNavbar) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        title={isMobileNavVisible ? "Close" : "Open"}
        onClick={(e) => {
          e.preventDefault(); // Prevent default behavior
          toggleMobileNav();
        }}
        className="md:hidden fixed top-2 right-2 z-50 bg-white p-2 rounded-lg shadow-md"
      >
        <FontAwesomeIcon icon={isMobileNavVisible ? faTimes : faBars} />
      </button>

      <nav
        className={`bg-white shadow-md mb-6
        md:translate-y-0 transition-transform duration-300
        ${isMobileNavVisible ? "translate-y-0" : "-translate-y-full md:translate-y-0"}
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center md:space-x-8 space-y-2 md:space-y-0">
            {getNavLinks().map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  if (window.innerWidth < 768) {
                    toggleMobileNav(); // Close nav after clicking on mobile
                  }
                }}
                className={`px-3 py-4 text-sm font-medium ${
                  location.pathname === link.path
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default DetailNavbar;
