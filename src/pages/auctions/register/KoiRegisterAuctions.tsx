import React from "react";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { fetchAuctionsByStatus } from "~/utils/apiUtils";
import UpcomingAuctionCart from "./UpcomingAuctionCart";
import AuctionList from "~/components/shared/AuctionList";

const KoiRegisterAuctions: React.FC = () => {
  return (
    <AuctionList
      fetchAuctionsData={(page, itemsPerPage) =>
        fetchAuctionsByStatus(page, itemsPerPage, AUCTION_STATUS.UPCOMING)
      } // Fetch auctions with specific status
      cartComponent={UpcomingAuctionCart} // Custom cart component for upcoming auctions
      emptyMessage="No upcoming auctions found" // Custom empty message
    />
  );
};

export default KoiRegisterAuctions;
