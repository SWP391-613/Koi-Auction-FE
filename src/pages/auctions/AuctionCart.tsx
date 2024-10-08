import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Auction } from "./Auctions";

interface AuctionCartProps {
  items: Auction[];
}

const AuctionCart: React.FC<AuctionCartProps> = ({ items }) => {
  const getStatusBadge = (status: string) => {
    if (status.toLowerCase() === "in-house") {
      return (
        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
          🇺🇸 In-House
        </span>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto flex flex-col sm:flex-row gap-2 p-4 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {items.map((auction) => (
          <Link
            to={`/auctions/${auction.id}`}
            key={auction.id}
            className="auction-item flex flex-col justify-between rounded-[30px] bg-white p-4 hover:bg-red-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Auction #{auction.id}</h2>
            </div>
            <div className="text-sm text-gray-600">
              <p>Start: {auction.start_time}</p>
              <p>End: {auction.end_time}</p>
              <p>Status: {auction.status}</p>
            </div>
            <div className="mt-2 self-end">
              {getStatusBadge(auction.status)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Prop validation
AuctionCart.propTypes = {
  items: PropTypes.array.isRequired,
};

export default AuctionCart;
