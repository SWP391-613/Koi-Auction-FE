import React from "react";
import { Route, Routes } from "react-router-dom";
import VerifyKoiList from "~/pages/kois/VerifyKoiList";
import { AuctionsManagement } from "~/pages/manager/auctions/AuctionsManagement";
import SendNotifications from "~/components/shared/SendNotifications";
import StaffDetail from "~/pages/detail/staff/StaffDetail";
import DashboardLayout from "~/components/shared/DashboardLayout";

const StaffLayout: React.FC = () => {
  const navLinks = [
    { to: "/staffs/auctions", label: "Auctions" },
    { to: "/staffs/kois", label: "Kois" },
    { to: "/staffs/verify/kois", label: "Verify Koi" },
    { to: "/staffs/send-notifications", label: "Send Notifications" },
  ];

  return (
    <DashboardLayout title="Staff Dashboard" navLinks={navLinks}>
      <Routes>
        <Route path="" element={<StaffDetail />} />
        <Route path="auctions" element={<AuctionsManagement />} />
        <Route path="kois" element={<VerifyKoiList />} />
        <Route path="verify/kois" element={<VerifyKoiList />} />
        <Route path="send-notifications" element={<SendNotifications />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StaffLayout;
