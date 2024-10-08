import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Auction } from "./Auctions";
import { getAuctionStatus } from "~/utils/dateTimeUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowRight,
  faMoneyCheckDollar,
} from "@fortawesome/free-solid-svg-icons";

interface AuctionCartProps {
  items: Auction[];
}

const AuctionCart: React.FC<AuctionCartProps> = ({ items }) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null); // Track the hovered item

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(); // This will format the date according to the user's locale
  };

  return (
    <div className="koi-container m-10 grid grid-cols-1 gap-4 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {items.map((auction) => (
        <Link
          to={`/auctions/${auction.id}`}
          key={auction.id}
          className="auction-card transform overflow-hidden rounded-2xl p-5 bg-transparent hover:bg-red-100 transition duration-300 ease-in-out"
          onMouseEnter={() => setHoveredItem(auction.id)} // Set hovered item on mouse enter
          onMouseLeave={() => setHoveredItem(null)} // Reset on mouse leave
        >
          <div className="flex justify-start items-center">
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="text-black text-3xl  mr-2"
            />
            <div>
              <div className="info p-4">
                <h2 className="title text-blue-600 text-2xl font-semibold">
                  {auction.title}
                </h2>
              </div>
              <div className="details p-2 text-sm text-gray-600">
                {/* Conditionally render start time or status based on hover */}
                {hoveredItem === auction.id ? (
                  <div className="flex flex-col lg:flex-row lg:space-x-4">
                    <p className="flex justify-between">
                      <span className="text-lg text-black glow-text">
                        {formatDate(auction.start_time)}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-lg text-black glow-text">
                        {formatDate(auction.end_time)}
                      </span>
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="text-lg text-black glow-text">
                      {getAuctionStatus(auction.start_time, auction.end_time)}
                    </span>
                  </>
                )}
              </div>
            </div>
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
