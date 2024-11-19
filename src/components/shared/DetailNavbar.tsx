import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    if (!user || user.status_name !== "VERIFIED") return [];

    const basePath = `/${user.role_name}s`;
    const links = {
      member: [
        { label: "My Profile", path: `users/${user.id}` },
        { label: "Orders", path: "users/orders" },
        { label: "Payments", path: "users/payments" },
      ],
      breeder: [
        { label: "My Profile", path: basePath },
        { label: "My Kois", path: `${basePath}/kois` },
        { label: "Add Koi", path: `${basePath}/add-koi` },
        { label: "Register to Auction", path: `${basePath}/auctions/register` },
        { label: "Pending Koi", path: `${basePath}/wishlist` },
        { label: "Payments", path: `${basePath}/payments` },
      ],
      staff: [
        { label: "My Profile", path: basePath },
        { label: "Auction Management", path: `${basePath}/auctions` },
        { label: "Verify Kois", path: `${basePath}/verify/kois` },
        { label: "Order Management", path: `${basePath}/orders` },
        { label: "Payment Management", path: `${basePath}/payments` },
        { label: "Notifications", path: `${basePath}/send-notifications` },
      ],
      manager: [
        { label: "My Profile", path: basePath },
        { label: "Auction Management", path: `${basePath}/auctions` },
        { label: "Koi Management", path: `${basePath}/kois` },
        { label: "Breeder Management", path: `${basePath}/breeders` },
        { label: "Staff Management", path: `${basePath}/staffs` },
        { label: "Member Management", path: `${basePath}/members` },
        { label: "Order Management", path: `${basePath}/orders` },
        { label: "Payment Management", path: `${basePath}/payments` },
      ],
    };

    return links[user.role_name as keyof typeof links] || [];
  };

  const shouldShowNavbar =
    location.pathname.includes("/users") ||
    location.pathname.includes("/breeders") ||
    location.pathname.includes("/staffs") ||
    location.pathname.includes("/managers");

  if (!shouldShowNavbar) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        title={isMobileNavVisible ? "Close" : "Open"}
        onClick={toggleMobileNav}
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
