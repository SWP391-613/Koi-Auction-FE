import React from "react";
import AuctionList from "~/components/shared/AuctionList";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import UpcomingAuctionCart from "./UpcomingAuctionCart";
import AuctionUpcomingList from "~/components/shared/AuctionUpcomingList";
import { fetchAuctionsByStatus } from "~/apis/auction.apis";

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
