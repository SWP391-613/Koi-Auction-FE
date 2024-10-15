import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuctionModel } from "~/types/auctions.type";
import { getAuctionStatus, getAuctionStatusV2 } from "~/utils/dateTimeUtils";

interface AuctionCardProps {
  auction: AuctionModel;
  link: string;
  hoverBgColor: string;
  getStatus: (start: string, end: string) => string;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  link,
  hoverBgColor,
  getStatus,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Link
      to={link}
      className={`auction-card transform overflow-hidden rounded-[2.5rem] p-2 bg-transparent hover:${hoverBgColor} transition duration-300 ease-in-out`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-start items-center ml-3">
        <FontAwesomeIcon
          icon={faCircleArrowRight}
          className="text-black text-3xl mr-5 hidden sm:block"
        />
        <div>
          <h2 className="text-black text-2xl font-semibold mt-3">
            {auction.title}
          </h2>
          <div className="details text-sm text-gray-600">
            {hovered ? (
              <div className="flex flex-col lg:flex-row lg:space-x-4">
                <p className="text-md text-black glow-text">
                  {formatDate(auction.start_time.toString())}
                </p>
                <p className="text-md text-black glow-text">
                  {formatDate(auction.end_time.toString())}
                </p>
              </div>
            ) : (
              <span className="text-2xl text-black glow-text">
                {getStatus(
                  auction.start_time.toString(),
                  auction.end_time.toString(),
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Prop validation
AuctionCard.propTypes = {
  auction: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
  hoverBgColor: PropTypes.string.isRequired,
  getStatus: PropTypes.func.isRequired,
};

export default AuctionCard;
