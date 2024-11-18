import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "~/components/shared/DashboardLayout";
import PaymentTransactions from "~/components/shared/PaymentTransactions";
import KoiRegisterAuctions from "~/pages/auctions/register/KoiRegisterAuctions";
import AddKoi from "~/pages/detail/breeder/AddKoi";
import BreederDetail from "~/pages/detail/breeder/BreederDetail";
import KoiOwnerSearch from "~/pages/detail/breeder/KoiOwnerSearch";
import KoiWishList from "~/pages/kois/KoiWishList";

const BreederLayout: React.FC = () => {
  const navLinks = [
    { to: "", label: "Your Koi" },
    { to: "add-koi", label: "Upload Koi" },
    { to: "auctions/register", label: "Register To Auction" },
    { to: "wishlist", label: "Wishlist" },
    { to: "payments", label: "Payment Transactions" },
  ];

  return (
    <DashboardLayout title="Breeder Dashboard" navLinks={navLinks}>
      <Routes>
        <Route path="" element={<BreederDetail />} />
        <Route path="kois" element={<KoiOwnerSearch />} />
        <Route path="/add-koi" element={<AddKoi />} />
        <Route path="auctions/register" element={<KoiRegisterAuctions />} />
        <Route path="wishlist" element={<KoiWishList />} />
        <Route path="payments" element={<PaymentTransactions />} />
      </Routes>
    </DashboardLayout>
  );
};

export default BreederLayout;
