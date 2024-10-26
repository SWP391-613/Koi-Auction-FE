import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "~/components/shared/DashboardLayout";
import PaymentTransactions from "~/components/shared/PaymentTransactions";
import UserOrder from "~/pages/detail/member/UserOrder";
import UserOrderDetail from "~/pages/detail/member/UserOrderDetail";
import VNPayReturn from "~/pages/payments/VNPayReturn";

const PaymentLayout: React.FC = () => {
  const navLinks = [{ to: "", label: "Payments History" }];

  return (
    <DashboardLayout title="" navLinks={navLinks}>
      <Routes>
        <Route path="" element={<PaymentTransactions />} />
      </Routes>
    </DashboardLayout>
  );
};

export default PaymentLayout;
