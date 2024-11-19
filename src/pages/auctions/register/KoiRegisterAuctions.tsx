import React from "react";
import { fetchAuctionsByStatus } from "~/apis/auction.apis";
import AuctionUpcomingList from "~/components/shared/AuctionUpcomingList";
import { AUCTION_STATUS } from "~/constants/status";
import UpcomingAuctionCart from "./UpcomingAuctionCart";

const KoiRegisterAuctions: React.FC = () => {
  return (
    <AuctionUpcomingList
      fetchAuctionsData={(page, itemsPerPage) =>
        fetchAuctionsByStatus(page, itemsPerPage, AUCTION_STATUS.UPCOMING)
      } // Fetch auctions with specific status
      cartComponent={UpcomingAuctionCart} // Custom cart component for upcoming auctions
      emptyMessage="No upcoming auctions found" // Custom empty message
    />
  );
};

export default KoiRegisterAuctions;
