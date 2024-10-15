import React from "react";
import AuctionCard from "~/components/shared/AuctionCard";
import { AuctionModel } from "~/types/auctions.type";
import { getAuctionStatusV2 } from "~/utils/dateTimeUtils";

interface UpcomingAuctionCartProps {
  items: AuctionModel[];
}

const UpcomingAuctionCart: React.FC<UpcomingAuctionCartProps> = ({ items }) => {
  return (
    <div className="koi-container grid grid-cols-1 gap-3 p-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
      {items.map((auction) => (
        <AuctionCard
          key={auction.id}
          auction={auction}
          link={`/auctions/register/${auction.id}`}
          hoverBgColor="bg-green-200"
          getStatus={getAuctionStatusV2}
        />
      ))}
    </div>
  );
};

export default UpcomingAuctionCart;
