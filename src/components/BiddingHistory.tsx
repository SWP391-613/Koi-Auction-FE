import React, { useEffect, useState } from "react";
import { fetchBidHistory } from "../utils/apiUtils";
import { connectWebSocket } from "../utils/websocket";

interface BiddingHistoryProps {
  auctionKoiId: number;
  isAuctionOngoing: boolean;
  isConnected: boolean;
}

export interface Bid {
  auction_koi_id: number;
  bidder_id: number;
  bid_amount: number;
  bid_time: string;
  bidder_name: string;
}

const BiddingHistory: React.FC<BiddingHistoryProps> = ({ auctionKoiId, isAuctionOngoing, isConnected }) => {
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
        setError("Failed to fetch bidding history");
        setLoading(false);
      }
    };

    loadBiddingHistory();
  }, [auctionKoiId]);

  useEffect(() => {
    let client: WebSocket | null = null;

    if (isAuctionOngoing && isConnected) {
      client = connectWebSocket();

      client.onmessage = (event) => {
        try {
          const newBid = JSON.parse(event.data);
          if (newBid.auction_koi_id === auctionKoiId) {
            setBidHistory(prevHistory => {
              const updatedHistory = [newBid, ...prevHistory];
              return updatedHistory.sort((a, b) => b.bid_amount - a.bid_amount);
            });
          }
        } catch (err) {
          console.error("Error processing WebSocket message:", err);
        }
      };
    }

    return () => {
      if (client) {
        client = null;
      }
    };
  }, [isAuctionOngoing, isConnected, auctionKoiId]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (loading)
    return <div className="text-center py-4">Loading bidding history...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bidding-history">
      <h3 className="text-2xl font-semibold mb-4">Past Bids</h3>
      {isAuctionOngoing && (
        <p className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          {isConnected ? 'Connected to live updates' : 'Not connected to live updates'}
        </p>
      )}
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
                  ${bid.bid_amount.toLocaleString()}
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
