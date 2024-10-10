import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const StaffLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">Staff Dashboard</h2>
        </div>
        <nav className="mt-4">
          <Link to="/staff/auctions" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            Auctions
          </Link>
          <Link to="/staff/send-notifications" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            Send Notifications
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;