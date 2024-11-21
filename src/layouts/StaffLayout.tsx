import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "~/components/shared/DashboardLayout";
import StaffDetail from "~/pages/detail/staff/StaffDetail";
import VerifyKoiList from "~/pages/kois/VerifyKoiList";
import { AuctionsManagement } from "~/pages/managements/AuctionsManagement";
import OrderManagement from "~/pages/managements/OrderManagement";
import PaymentManagement from "~/pages/managements/PaymentManagement";

const StaffLayout: React.FC = () => {
  const navLinks = [
    { to: "/staffs", label: "Home" },
    { to: "/staffs/auctions", label: "Auctions" },
    { to: "/staffs/verify/kois", label: "Verify Koi" },
    { to: "/staffs/orders", label: "Orders" },
    { to: "/staffs/payments", label: "Payments" },
  ];

  return (
    <DashboardLayout title="Staff Dashboard" navLinks={navLinks}>
      <Routes>
        <Route path="" element={<StaffDetail />} />
        <Route path="auctions" element={<AuctionsManagement />} />
        <Route path="verify/kois" element={<VerifyKoiList />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StaffLayout;
