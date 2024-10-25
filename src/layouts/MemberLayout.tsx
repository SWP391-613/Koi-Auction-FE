import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "~/components/shared/DashboardLayout";
import UserDetail from "~/pages/detail/member/UserDetail";
import UserOrder from "~/pages/detail/member/UserOrder";
import PaymentTransactions from "~/components/shared/PaymentTransactions";

const MemberLayout: React.FC = () => {
  const navLinks = [
    { to: "", label: "Profile" },
    { to: "/orders", label: "My Orders" },
    { to: "/payments", label: "Payment Transactions" },
  ];

  return (
    <DashboardLayout title="" navLinks={navLinks}>
      <Routes>
        <Route path=":id" element={<UserDetail />} />
        <Route path="orders" element={<UserOrder />} />
        <Route path="payments" element={<PaymentTransactions />} />
      </Routes>
    </DashboardLayout>
  );
};

export default MemberLayout;
