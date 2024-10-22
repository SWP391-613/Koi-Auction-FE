import React from "react";
import { Route, Routes } from "react-router-dom";
import BreederDetail from "~/pages/detail/breeder/BreederDetail";
import KoiEditDetail from "~/pages/kois/KoiEditDetail";
import VNPayReturn from "~/pages/payments/VNPayReturn";
import DashboardLayout from "~/components/shared/DashboardLayout";
import KoiWishList from "~/pages/kois/KoiWishList";
import AddKoi from "~/pages/detail/breeder/AddKoi";

const BreederLayout: React.FC = () => {
  const navLinks = [
    { to: "", label: "Your Koi" },
    { to: "add-koi", label: "Add Koi" },
    { to: "wishlist", label: "Wishlist" },
    { to: "payments/vnpay-payment-return", label: "Payments" },
  ];

  return (
    <DashboardLayout title="Breeder Dashboard" navLinks={navLinks}>
      <Routes>
        <Route path="" element={<BreederDetail />} />
        <Route path="/add-koi" element={<AddKoi />} />
        <Route path="wishlist" element={<KoiWishList />} />
        <Route path="payments/vnpay-payment-return" element={<VNPayReturn />} />
      </Routes>
    </DashboardLayout>
  );
};

export default BreederLayout;
