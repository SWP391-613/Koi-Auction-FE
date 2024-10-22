import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuctionModel } from "~/types/auctions.type";
import { CrudButton } from "./CrudButtonComponent";

interface AuctionCardProps {
  auction: AuctionModel;
  link: string;
  getStatus: (start: string, end: string) => string;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  link,
  getStatus,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderCrudButtons = () => (
    <CrudButton width={40} ariaLabel="Japan Flag" svgPath="japan-flag.svg" />
  );

  return (
    <Link
      to={link}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`ml-3 transform overflow-hidden rounded-[2.5rem] p-2 bg-transparent transition duration-300 ease-in-out ${
          auction.status === "UPCOMING" || auction.status === "ONGOING"
            ? "hover:bg-green-100"
            : "hover:bg-red-100"
        }`}
      >
        <div className="flex justify-around items-center">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="text-black text-3xl mr-5 hidden sm:block"
            />
            <div className="flex flex-col items-start justify-start">
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
          <div>{renderCrudButtons()}</div>
        </div>
      </div>
    </Link>
  );
};

// Prop validation
AuctionCard.propTypes = {
  auction: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
  getStatus: PropTypes.func.isRequired,
};

export default AuctionCard;
