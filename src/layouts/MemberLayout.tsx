import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "~/components/shared/DashboardLayout";
import UserDetail from "~/pages/detail/member/UserDetail";
import UserOrder from "~/pages/detail/member/UserOrder";

const MemberLayout: React.FC = () => {
  const navLinks = [
    { to: "", label: "Profile" },
    { to: "/orders", label: "My Orders" },
  ];

  return (
    <DashboardLayout title="" navLinks={navLinks}>
      <Routes>
        <Route path=":id" element={<UserDetail />} />
        <Route path="orders" element={<UserOrder />} />
      </Routes>
    </DashboardLayout>
  );
};

export default MemberLayout;
