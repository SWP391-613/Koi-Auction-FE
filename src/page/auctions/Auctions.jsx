import React from "react";
import { Routes, Route } from 'react-router-dom';
import Cart from "../../components/cart/Cart";
import KoiDetail from "../../components/koiDetail/KoiDetail";

const Auctions = () => {
  return (
    <div className="auctions-page">
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/koi/:id" element={<KoiDetail />} />
      </Routes>
      <footer className="auctions-footer">
        <p>&copy; 2023 Koi Auction. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Auctions;
