import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getAuctionStatus } from "~/utils/dateTimeUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowRight,
  faMoneyCheckDollar,
} from "@fortawesome/free-solid-svg-icons";
import { AuctionModel } from "~/types/auctions.type";

interface UpcomingAuctionCartProps {
  items: AuctionModel[];
}

const UpcomingAuctionCart: React.FC<UpcomingAuctionCartProps> = ({ items }) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null); // Track the hovered item

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(); // This will format the date according to the user's locale
  };

  return (
    <div className="koi-container grid grid-cols-1 gap-3 p-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
      {items.map((auction) => (
        <Link
          to={`/auctions/register/${auction.id}`}
          key={auction.id}
          className="auction-card transform overflow-hidden rounded-[2.5rem] p-2 bg-transparent hover:bg-green-200 transition duration-300 ease-in-out"
          onMouseEnter={() => setHoveredItem(auction.id)} // Set hovered item on mouse enter
          onMouseLeave={() => setHoveredItem(null)} // Reset on mouse leave
        >
          <div className="flex justify-start items-center ml-3">
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="text-black text-3xl mr-5 hidden sm:block"
            />
            <div className="">
              <div className="info">
                <h2 className="text-black text-2xl font-semibold mt-3">
                  {auction.title}
                </h2>
              </div>
              <div className="details text-sm text-gray-600">
                {/* Conditionally render start time or status based on hover */}
                {hoveredItem === auction.id ? (
                  <div className="flex flex-col lg:flex-row lg:space-x-4">
                    <p className="flex justify-between">
                      <span className="text-md text-black glow-text">
                        {formatDate(auction.start_time)}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-md text-black glow-text">
                        {formatDate(auction.end_time)}
                      </span>
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl text-black glow-text">
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
UpcomingAuctionCart.propTypes = {
  items: PropTypes.array.isRequired,
};

export default UpcomingAuctionCart;
