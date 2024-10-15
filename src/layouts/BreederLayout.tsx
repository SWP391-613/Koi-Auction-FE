import React from "react";
import { Outlet, Link, Routes, Route } from "react-router-dom";
import BreederDetail from "~/pages/detail/breeder/BreederDetail";
import KoiEditDetail from "~/pages/kois/KoiEditDetail";
import VNPayReturn from "~/pages/payments/VNPayReturn";

const BreederLayout: React.FC = () => {
  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Breeder Dashboard
          </h2>
        </div>
        <nav className="mt-4">
          <Link
            to=""
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            Kois
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="" element={<BreederDetail />} />
            <Route
              path="payments/vnpay-payment-return"
              element={<VNPayReturn />}
            />
            <Route path="kois/:id/edit" element={<KoiEditDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default BreederLayout;
