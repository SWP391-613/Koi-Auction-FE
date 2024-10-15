import React from "react";
import { Route, Routes } from "react-router-dom";
import BreederDetail from "~/pages/detail/breeder/BreederDetail";
import KoiEditDetail from "~/pages/kois/KoiEditDetail";
import VNPayReturn from "~/pages/payments/VNPayReturn";
import DashboardLayout from "~/components/shared/DashboardLayout";

const BreederLayout: React.FC = () => {
  const navLinks = [{ to: "", label: "Your Koi List" }];

  return (
    <DashboardLayout title="Breeder Dashboard" navLinks={navLinks}>
      <Routes>
        <Route path="" element={<BreederDetail />} />
        <Route path="payments/vnpay-payment-return" element={<VNPayReturn />} />
        <Route path="kois/:id/edit" element={<KoiEditDetail />} />
      </Routes>
    </DashboardLayout>
  );
};

export default BreederLayout;
