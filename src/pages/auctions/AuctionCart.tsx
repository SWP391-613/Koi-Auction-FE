import React from "react";
import ScrollToTop from "react-scroll-to-top";
import AuctionCard from "~/components/shared/AuctionCard";
import { AuctionModel } from "~/types/auctions.type";
import { getAuctionStatus } from "~/utils/dateTimeUtils";

interface AuctionCartProps {
  items: AuctionModel[];
}

const AuctionCart: React.FC<AuctionCartProps> = ({ items }) => {
  return (
    <div className="koi-container grid grid-cols-1 gap-3 p-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
      {items.map((auction) => (
        <AuctionCard
          key={auction.id}
          auction={auction}
          link={`/auctions/${auction.id}`}
          hoverBgColor="bg-red-100"
          getStatus={getAuctionStatus}
        />
      ))}
      <ScrollToTop smooth />
    </div>
  );
};

export default AuctionCart;
