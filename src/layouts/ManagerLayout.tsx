import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "~/components/shared/DashboardLayout";
import ManagerDetail from "../pages/detail/manager/ManagerDetail";
import KoiDetail from "../pages/kois/KoiDetail";
import { AuctionsManagement } from "../pages/manager/auctions/AuctionsManagement";
import BreederManagement from "../pages/manager/breeder/BreederManagement";
import KoiManagement from "../pages/manager/koi/KoiManagement";
import MemberManagement from "../pages/manager/member/MemberManagement";
import Settings from "../pages/manager/settings/Settings";
import StaffManagement from "../pages/manager/staff/StaffManagement";

const ManagerLayout: React.FC = () => {
  const navLinks = [
    { to: "", label: "My Profile" },
    { to: "auctions", label: "Auctions Management" },
    { to: "member", label: "Members Management" },
    { to: "breeder", label: "Breeders Management" },
    { to: "staff", label: "Staffs Management" },
    { to: "koi", label: "Kois Management" },
    { to: "setting", label: "Settings" },
  ];

  return (
    <DashboardLayout title="Manager Dashboard" navLinks={navLinks}>
      <Routes>
        <Route path="" element={<ManagerDetail />} />
        <Route path="auctions" element={<AuctionsManagement />} />
        <Route path="member" element={<MemberManagement />} />
        <Route path="breeder" element={<BreederManagement />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="koi" element={<KoiManagement />} />
        <Route path="koi-detail" element={<KoiDetail />} />
        <Route path="setting" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ManagerLayout;
