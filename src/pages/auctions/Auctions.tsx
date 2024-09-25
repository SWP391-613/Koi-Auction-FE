import React from "react";
import { useState, useEffect } from "react";
import AuctionCart from "./AuctionCart";
import { fetchAuctions } from "~/utils/apiUtils";
import { Auction } from "./Auction.model";

const Auctions: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const page = 0;

  useEffect(() => {
    const loadAuctions = async () => {
      const fetchedAuctions = await fetchAuctions(page, 100);
      setAuctions(fetchedAuctions);
    };

    loadAuctions();
  }, [page]);

  return (
    <div>
      <AuctionCart items={auctions} />
    </div>
  );
};

export default Auctions;
