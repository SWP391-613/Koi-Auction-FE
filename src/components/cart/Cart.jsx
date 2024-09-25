import React from "react";
import { Link } from "react-router-dom";
import "./Cart.scss";
import auction_data from "../../utils/data/auction_data.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  const auctionItems = auction_data.items;

  const getRandomByColor = () => {
    return Math.random() > 0.5 ? "bg-green-500" : "bg-red-500";
  };

  if (!Array.isArray(auctionItems) || auctionItems.length === 0) {
    return <div>Không có dữ liệu Auction.</div>;
  }

  return (
    <div className="koi-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10 m-10">
      {auctionItems.map((auction) => (
        <Link
          to={`/auction/${auction.id}`}
          key={auction.id}
          className="auction-card bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
        >
          <div className="info p-4">
            <h2 className="title text-2xl font-semibold">{auction.title}</h2>
          </div>
          <div className="details p-2 text-sm text-gray-600">
            <p className="flex justify-between">
              <span>Start time:</span>
              <span className="text-lg text-black">{auction.start_time}</span>
            </p>
            <p className="flex justify-between">
              <span>End time:</span>
              <span className="text-lg text-black">{auction.end_time}</span>
            </p>
            <p className="flex justify-between">
              <span>Status:</span>
              <span className="text-lg text-black">{auction.status}</span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Cart;
