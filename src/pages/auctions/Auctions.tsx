import React from "react";
import { motion } from "framer-motion";
import { AuctionCart } from "./AuctionCart";
import AuctionList from "~/components/shared/AuctionList";
import { fetchAuctions } from "~/apis/auction.apis";

const AuctionsComponent: React.FC = () => {
  const fetchAuctionsDataCallback = React.useCallback(
    (page: number, itemsPerPage: number) => {
      return fetchAuctions(page, itemsPerPage);
    },
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AuctionList
          fetchAuctionsData={fetchAuctionsDataCallback}
          cartComponent={AuctionCart}
          emptyMessage="No auctions found"
        />
      </motion.div>
    </motion.div>
  );
};

const Auctions = React.memo(AuctionsComponent);
export default Auctions;
