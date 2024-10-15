import React from "react";
import { fetchAuctions } from "~/utils/apiUtils";
import AuctionCart from "./AuctionCart";
import AuctionList from "~/components/shared/AuctionList";

const Auctions: React.FC = () => {
  return (
    <AuctionList
      fetchAuctionsData={(page, itemsPerPage) =>
        fetchAuctions(page, itemsPerPage)
      } // Pass the fetch function for this auction
      cartComponent={AuctionCart} // Specific cart component
      emptyMessage="No auctions found" // Custom empty message
    />
  );
};

export default Auctions;
