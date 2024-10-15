import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import VerifyKoiList from "../pages/kois/VerifyKoiList";
import { AuctionsManagement } from "../pages/manager/auctions/AuctionsManagement";
import SendNotifications from "../components/shared/SendNotifications";
import StaffDetail from "../pages/detail/staff/StaffDetail";

const StaffLayout: React.FC = () => {
  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Staff Dashboard
          </h2>
        </div>
        <nav className="mt-4">
          <Link
            to="/staffs/auctions"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Auctions
          </Link>
          <Link
            to="/staffs/kois"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Kois
          </Link>
          <Link
            to="/staffs/verify/kois"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Verify Koi
          </Link>
          <Link
            to="/staffs/send-notifications"
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Send Notifications
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="" element={<StaffDetail />} />
            <Route path="auctions" element={<AuctionsManagement />} />
            <Route path="kois" element={<VerifyKoiList />} />
            <Route path="verify/kois" element={<VerifyKoiList />} />
            <Route path="send-notifications" element={<SendNotifications />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;
