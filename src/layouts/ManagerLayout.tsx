import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "~/components/shared/DashboardLayout";
import ManagerDetail from "../pages/detail/manager/ManagerDetail";
import KoiDetail from "../pages/kois/KoiDetail";
import BreederManagement from "../pages/managements/BreederManagement";
import KoiManagement from "../pages/managements/KoiManagement";
import MemberManagement from "../pages/managements/MemberManagement";
import StaffManagement from "../pages/manager/staff/StaffManagement";
import { AuctionsManagement } from "~/pages/managements/AuctionsManagement";
import OrderManagement from "~/pages/managements/OrderManagement";
import PaymentManagement from "~/pages/managements/PaymentManagement";

const ManagerLayout: React.FC = () => {
  const navLinks = [
    { to: "", label: "My Profile" },
    { to: "auctions", label: "Auctions Management" },
    { to: "member", label: "Members Management" },
    { to: "breeder", label: "Breeders Management" },
    { to: "staff", label: "Staffs Management" },
    { to: "koi", label: "Kois Management" },
  ];

  return (
    <DashboardLayout title="Manager Dashboard" navLinks={navLinks}>
      <Routes>
        <Route path="" element={<ManagerDetail />} />
        <Route path="auctions" element={<AuctionsManagement />} />
        <Route path="koi" element={<KoiManagement />} />
        <Route path="breeder" element={<BreederManagement />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="member" element={<MemberManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="koi-detail" element={<KoiDetail />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ManagerLayout;
