import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "~/components/shared/DashboardLayout";
import UserOrder from "~/pages/detail/member/UserOrder";
import UserOrderDetail from "~/pages/detail/member/UserOrderDetail";
import VNPayReturn from "~/pages/payments/VNPayReturn";

const OrderLayout: React.FC = () => {
  const navLinks = [
    { to: "", label: "Orders" },
    // { to: "/payments/vnpay-payment-return", label: "VNPay" },
  ];

  return (
    <DashboardLayout title="" navLinks={navLinks}>
      <Routes>
        <Route path="" element={<UserOrder />} />
        {/* <Route path="payments/vnpay-payment-return" element={<VNPayReturn />} /> */}
        <Route path="order-detail/:orderId" element={<UserOrderDetail />} />
      </Routes>
    </DashboardLayout>
  );
};

export default OrderLayout;
