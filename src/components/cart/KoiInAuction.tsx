import React from "react";
import { useState, useEffect } from "react";
import { fetchAuctions, fetchKoiInAuction } from "~/utils/apiUtils";

export interface KoiInAuction {
  id: number;
  title: string;
  start_time: Date;
  end_time: Date;
  status: string;
}

const KoisInAuction: React.FC = () => {
  const [auctions, setAuctions] = useState<KoiInAuction[]>([]);
  const page = 0;

  useEffect(() => {
    const loadAuctions = async () => {
      const fetchedAuctions = await fetchKoiInAuction(1);
      setAuctions(fetchedAuctions);
    };

    loadAuctions();
  }, [page]);

  return <div>{/* <AuctionCart items={auctions} /> */}</div>;
};

export default KoisInAuction;
