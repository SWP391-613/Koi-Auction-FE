import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getKoiById,
  fetchAuctionKoiDetails,
  fetchBidHistory,
  fetchAuctionById,
} from "~/utils/apiUtils";
import { useAuth } from "~/utils/auth/AuthContext";
import { KoiDetailModel } from "../kois/Kois";
import { Bid } from "~/components/BiddingHistory";
import BiddingHistory from "../../components/BiddingHistory";
import NavigateButton from "../../components/shared/NavigateButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFish,
  faRuler,
  faCalendarDays,
  faVenusMars,
  faDollarSign,
  faGavel,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { placeBid, subscribeToAuction } from "~/utils/websocket";
import { connectWebSocket, disconnectWebSocket } from "~/utils/websocket";
import { Auction } from "./Auctions";

// Define the AuctionKoiResponse interface
export interface AuctionKoiResponse {
  id: number; // The ID of the auction koi
  auction_id: number; // The ID of the auction
  koi_id: number; // The ID of the koi
  base_price: number; // The base price of the koi
  current_bid: number; // The current bid amount
  current_bidder_id: number | null; // The ID of the current bidder, or null if no bidder
  is_sold: boolean; // Whether the koi is sold
  bid_method: string; // The method of bidding used
}

// Define the KoiDetail UI component
interface KoiDetailItemProps {
  icon: IconDefinition;
  label: string;
  value: string | number;
  fontSize?: string;
  bgColor?: string;
  textColor?: string;
}

// Define the BidRequest interface
export interface BidRequest {
  auction_koi_id: number; // The ID of the auction koi
  bidder_id: number; // The ID of the bidder
  bid_amount: number; // The amount of the bid
  bid_time: Date; // The time the bid was placed
  bidder_name: string; // The name of the bidder
}

// Define the BidResponse interface
export interface BidResponse {
  success: boolean;
  message: string;
  currentBid: number;
  currentBidderId: number;
  bidTime: Date;
  bidderName: string;
}

// Define the AuctionKoiResponse interface, the data type for the auction koi details
export interface AuctionKoiResponse {
  id: number;
  auction_id: number;
  koi_id: number;
  base_price: number;
  current_bid: number;
  current_bidder_id: number | null;
  is_sold: boolean;
  bid_method: string;
}

// Define the KoiDetailItem component, the UI for the koi details
const KoiDetailItem: React.FC<KoiDetailItemProps> = ({
  icon,
  label,
  value,
  fontSize = "text-2xl",
  bgColor = "bg-gray-100",
  textColor = "text-black",
}) => {
  return (
    <div
      className={`${bgColor} m-2 grid grid-cols-2 rounded-3xl border border-gray-300 p-3`}
    >
      <div className="flex items-center">
        <FontAwesomeIcon icon={icon as IconDefinition} color="#d66b56" />
        <p className={`ml-2 text-lg`}>{label}</p>
      </div>
      <p className={`${fontSize} text-end ${textColor}`}>{value}</p>
    </div>
  );
};

const KoiBidding: React.FC = () => {
  const { auctionId, koiId } = useParams<{
    auctionId: string;
    koiId: string;
  }>();
  const { isLoggedIn, user } = useAuth(); // Get the user and login status from the auth context
  const [koi, setKoi] = useState<KoiDetailModel | null>(null); // State for koi details
  const [auctionKoi, setAuctionKoi] = useState<AuctionKoiResponse | null>(null); // State for auction koi details
  const [auction, setAuction] = useState<Auction | null>(null); // State for auction details
  const [bidHistory, setBidHistory] = useState<Bid[]>([]); // State for bid history
  const [bidAmount, setBidAmount] = useState<string>(""); // State for bid amount

  const isAuctionOngoing = () => {
    // Function to check if the auction is ongoing
    if (!auction) return false;
    const now = new Date();
    //time and date of auction checked later
    return auction.status === "ACTIVE";
  };

  const [isConnected, setIsConnected] = useState(false); // State for connection status

  useEffect(() => {
    const loadKoiAndBids = async () => {
      try {
        console.log(
          "Fetching data for auctionId:",
          auctionId,
          "and koiId:",
          koiId,
        );

        const [koiDetails, auctionKoiDetails, bidHistoryData, auctionDetails] =
          await Promise.all([
            getKoiById(Number(koiId)),
            fetchAuctionKoiDetails(Number(auctionId), Number(koiId)),
            fetchBidHistory(Number(koiId)),
            fetchAuctionById(Number(auctionId)),
          ]);

        console.log("Fetched auction details:", auctionDetails);

        setKoi(koiDetails);
        setAuctionKoi(auctionKoiDetails);
        setBidHistory(bidHistoryData);
        setAuction(auctionDetails);

        console.log("Updated auction state:", auctionDetails);
        // Remove this line: console.log("auction: ", auction);

        // If you need to log the updated auction state, use useEffect
      } catch (error) {
        console.error("Error loading koi and bids:", error);
      }
    };

    loadKoiAndBids();
  }, [auctionId, koiId]);

  // Add this separate useEffect to log the auction state after it updates
  useEffect(() => {
    console.log("Current auction state:", auction);
    if (isAuctionOngoing()) {
      connectWebSocket();
      setIsConnected(true);
    } else {
      disconnectWebSocket();
      setIsConnected(false);
    }
  }, [auction]);

  useEffect(() => {
    if (auctionId && isAuctionOngoing()) {
      const client = connectWebSocket();
      setIsConnected(true);

      return () => {
        disconnectWebSocket();
        setIsConnected(false);
      };
    }
  }, [auctionId, isAuctionOngoing]);

  const handlePlaceBid = () => {
    if (!isConnected || !user || !auctionKoi) {
      console.error("Cannot place bid: not connected or user not logged in");
      return;
    }

    const bidRequest: BidRequest = {
      auctionKoiId: auctionKoi.id,
      bidderId: user.id,
      bidAmount: Number(bidAmount),
      bidTime: new Date(),
      bidderName: user.username,
    };

    placeBid(bidRequest);
    setBidAmount("");
  };

  const isAuctionEnded = () => {
    if (!auction) return false;
    //time and date of auction checked later
    const now = new Date();
    return auction.status !== "ACTIVE";
  };

  if (!koi || !auctionKoi || !auction) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="ml-10 mt-6">
        <NavigateButton
          to={`/auctions/${auctionId}`}
          icon={<FontAwesomeIcon icon={faArrowLeft} />}
          text="Back to Auction"
          className="rounded bg-gray-200 px-5 py-3 text-lg text-black transition hover:bg-gray-200"
        />
      </div>
      <div className="m-5 flex flex-col gap-6 p-4 sm:flex-col md:flex-row">
        {/* Koi Image */}
        <div className="relative h-96 w-full rounded-xl bg-[#4086c7] sm:h-128 md:h-144 md:w-128 lg:h-192">
          <img
            className="absolute inset-0 h-full w-full rounded-xl object-contain shadow-md transition duration-300 hover:shadow-2xl hover:ring-4 hover:ring-blue-400"
            src={koi.thumbnail}
            alt={koi.name}
          />
        </div>
        {/* Koi Info and Bidding */}
        <div className="koi-info w-full space-y-4 rounded-2xl bg-gray-200 p-4 text-lg">
          <div className="mb-4 items-center rounded-2xl">
            <div className="grid w-full grid-cols-1 xl:grid-cols-2">
              <h2 className="col-span-1 m-4 text-4xl font-bold xl:col-span-2">
                {koi.name}
              </h2>
              <KoiDetailItem
                icon={faVenusMars}
                label="Sex"
                value={koi.sex}
                bgColor="bg-gray-300"
              />
              <KoiDetailItem
                icon={faRuler}
                label="Length"
                value={koi.length}
                bgColor="bg-gray-300"
              />
              <KoiDetailItem
                icon={faCalendarDays}
                label="Age"
                value={koi.age}
                bgColor="bg-gray-300"
              />
              <KoiDetailItem
                icon={faFish}
                label="Category ID"
                value={koi.category_id}
                bgColor="bg-gray-300"
              />
              <KoiDetailItem
                icon={faDollarSign}
                label="Base Price"
                value={auctionKoi.base_price}
                bgColor="bg-blue-200"
              />
              <KoiDetailItem
                icon={faGavel}
                label="Current Bid"
                value={auctionKoi.current_bid}
                bgColor="bg-green-200"
              />
            </div>
          </div>

          {!isAuctionEnded() && !auctionKoi.is_sold && (
            <div className="mb-4 rounded-2xl bg-gray-300 p-4">
              <h3 className="mb-2 text-xl font-semibold">Place Your Bid</h3>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="mr-2 w-full rounded border p-2"
                placeholder="Enter bid amount"
              />
              <button
                onClick={handlePlaceBid}
                className="mt-2 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Place Bid
              </button>
            </div>
          )}

          <div className="rounded-2xl bg-gray-300 p-4">
            <h3 className="mb-2 text-xl font-semibold">Bid History</h3>
            <div className="max-h-full overflow-y-auto">
              <BiddingHistory
                auctionKoiId={auctionKoi.id}
                isAuctionOngoing={!isAuctionEnded()}
                isConnected={isConnected}
              />
            </div>
          </div>
        </div>
      </div>
      {!isAuctionEnded() && (
        <div
          className={`text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}
        >
          {isConnected
            ? "Connected to live updates"
            : "Not connected to live updates"}
        </div>
      )}
    </div>
  );
};

export default KoiBidding;
