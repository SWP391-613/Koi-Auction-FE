import React, { useEffect, useState } from "react";
import { fetchBiddingHistory } from "../utils/apiUtils";

interface BiddingHistoryProps {
  auctionKoiId: number;
}

export interface Bid {
  auctionKoiId: number;
  bidderId: number;
  bidAmount: number;
  bidTime: number[];
  bidderName: string;
}

const BiddingHistory: React.FC<BiddingHistoryProps> = ({ auctionKoiId }) => {
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBiddingHistory = async () => {
      try {
        const history = await fetchBiddingHistory(auctionKoiId);
        setBidHistory(history.sort((a, b) => b.bidAmount - a.bidAmount)); // Sort bids in descending order
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bidding history");
        setLoading(false);
      }
    };

    loadBiddingHistory();
  }, [auctionKoiId]);

  const formatDate = (dateArray: number[]): string => {
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
    ).toLocaleString();
  };

  if (loading)
    return <div className="text-center py-4">Loading bidding history...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bidding-history">
      <h3 className="text-2xl font-semibold mb-4">Past Bids</h3>
      {bidHistory.length === 0 ? (
        <p className="text-gray-500">No bids yet</p>
      ) : (
        <div className="space-y-4">
          {bidHistory.map((bid, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 shadow-md ${index === 0 ? "bg-green-400" : "bg-gray-200"}`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-2xl font-bold ${index === 0 ? "text-white" : "text-gray-800"}`}
                >
                  ${bid.bidAmount.toLocaleString()}
                </span>
              </div>
              <div
                className={`${index === 0 ? "text-white" : "text-gray-600"}`}
              >
                {formatDate(bid.bidTime)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BiddingHistory;
