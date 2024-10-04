import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Auction } from "./Auctions";

interface AuctionCartProps {
  items: Auction[];
}

const AuctionCart: React.FC<AuctionCartProps> = ({ items }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(); // This will format the date according to the user's locale
  };

  return (
    <div className="koi-container m-10 grid grid-cols-1 gap-4 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((auction) => (
        <Link
          to={`/auctions/${auction.id}`}
          key={auction.id}
          className="auction-card transform overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
        >
          <div className="info p-4">
            <h2 className="title text-2xl font-semibold">{auction.title}</h2>
          </div>
          <div className="details p-2 text-sm text-gray-600">
            <p className="flex justify-between">
              <span>Start time:</span>
              <span className="text-lg text-black">
                {auction.start_time}
              </span>
            </p>
            <p className="flex justify-between">
              <span>End time:</span>
              <span className="text-lg text-black">
                {auction.end_time}
              </span>
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

// Prop validation
AuctionCart.propTypes = {
  items: PropTypes.array.isRequired,
};

export default AuctionCart;
