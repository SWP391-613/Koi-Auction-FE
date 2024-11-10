import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserData } from '~/hooks/useUserData';

const DetailNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserData();

  const getNavLinks = () => {
    if (!user) return [];
    
    const basePath = `/${user.role_name}s`;
    const links = {
      member: [
        { label: 'Profile', path: `${basePath}/${user.id}` },
        { label: 'Orders', path: `${basePath}/orders` },
        { label: 'Payments', path: `${basePath}/payments` },
      ],
      breeder: [
        { label: 'Your Koi', path: basePath },
        { label: 'Add Koi', path: `${basePath}/add-koi` },
        { label: 'Register Auction', path: `${basePath}/auctions/register` },
        { label: 'Wishlist', path: `${basePath}/wishlist` },
        { label: 'Payments', path: `${basePath}/payments` },
      ],
      staff: [
        { label: 'Dashboard', path: basePath },
        { label: 'Auctions', path: `${basePath}/auctions` },
        { label: 'Verify Kois', path: `${basePath}/verify/kois` },
        { label: 'Orders', path: `${basePath}/orders` },
        { label: 'Payments', path: `${basePath}/payments` },
        { label: 'Notifications', path: `${basePath}/send-notifications` },
      ],
      manager: [
        { label: 'Dashboard', path: basePath },
        { label: 'Auctions', path: `${basePath}/auctions` },
        { label: 'Verify Kois', path: `${basePath}/verify/kois` },
        { label: 'Orders', path: `${basePath}/orders` },
        { label: 'Payments', path: `${basePath}/payments` },
        { label: 'Notifications', path: `${basePath}/send-notifications` },
      ],
    };

    return links[user.role_name as keyof typeof links] || [];
  };

  const shouldShowNavbar = location.pathname.includes('/users') || 
                          location.pathname.includes('/breeders') ||
                          location.pathname.includes('/staffs') ||
                          location.pathname.includes('/managers');

  if (!shouldShowNavbar) return null;

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center space-x-8">
          {getNavLinks().map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-4 text-sm font-medium ${
                location.pathname === link.path
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DetailNavbar;