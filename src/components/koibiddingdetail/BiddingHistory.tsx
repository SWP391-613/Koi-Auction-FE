import React, { useEffect, useState } from "react";
import { ERROR_MESSAGE } from "~/constants/message";
import { Bid, BiddingHistoryProps } from "~/types/bids.type";
import { fetchBidHistory } from "~/utils/apiUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import { formatDate } from "~/utils/dateTimeUtils";
import LoadingComponent from "../shared/LoadingComponent";

const BiddingHistory: React.FC<BiddingHistoryProps> = ({
  auctionKoiId,
  latestBid,
}) => {
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBiddingHistory = async () => {
      try {
        const history = await fetchBidHistory(auctionKoiId);
        setBidHistory(history.sort((a, b) => b.bid_amount - a.bid_amount));
        setLoading(false);
      } catch (err) {
        setError(ERROR_MESSAGE.FAILED_TO_FETCH_BIDDING_HISTORY);
        setLoading(false);
      }
    };

    loadBiddingHistory();
  }, [auctionKoiId]);

  useEffect(() => {
    if (latestBid) {
      setBidHistory((prevHistory) => {
        const updatedHistory = [
          latestBid,
          ...prevHistory.filter((bid) => bid.bid_time !== latestBid.bid_time),
        ];
        return updatedHistory.sort((a, b) => b.bid_amount - a.bid_amount);
      });
    }
  }, [latestBid]);

  if (loading) return <LoadingComponent />;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bidding-history">
      {bidHistory.length === 0 ? (
        <p className="text-gray-500">No bids yet</p>
      ) : (
        <div className="space-y-4">
          {bidHistory.map((bid, index) => (
            <div
              key={`${bid.bidder_id}-${bid.bid_amount}-${bid.bid_time}`}
              className={`rounded-lg p-4 shadow-md ${index === 0 ? "bg-green-400" : "bg-gray-200"}`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-2xl font-bold ${index === 0 ? "text-white" : "text-gray-800"}`}
                >
                  {formatCurrency(bid.bid_amount)}
                </span>
                <span className="text-gray-600">{bid.bidder_name}</span>
              </div>
              <div
                className={`${index === 0 ? "text-white" : "text-gray-600"}`}
              >
                {formatDate(bid.bid_time)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BiddingHistory;
