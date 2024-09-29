import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getKoiById,
  fetchAuctionKoiDetails,
  fetchBiddingHistory,
  placeBid,
} from "~/utils/apiUtils";
import { useAuth } from "~/AuthContext";
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

interface KoiDetailItemProps {
  icon: IconDefinition;
  label: string;
  value: string | number;
  fontSize?: string;
  bgColor?: string;
  textColor?: string;
}

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
  const { isLoggedIn } = useAuth();
  const [koi, setKoi] = useState<KoiDetailModel | null>(null);
  const [auctionKoi, setAuctionKoi] = useState<AuctionKoiResponse | null>(null);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState<string>("");

  useEffect(() => {
    const loadKoiAndBids = async () => {
      try {
        const [koiDetails, auctionKoiDetails, bidHistoryData] =
          await Promise.all([
            getKoiById(Number(koiId)),
            fetchAuctionKoiDetails(Number(auctionId), Number(koiId)),
            fetchBiddingHistory(Number(koiId)), // Assuming koiId is the same as auctionKoiId
          ]);

        setKoi(koiDetails);
        setAuctionKoi(auctionKoiDetails);
        setBidHistory(bidHistoryData);
      } catch (error) {
        console.error("Error loading koi and bids:", error);
      }
    };

    loadKoiAndBids();
  }, [auctionId, koiId]);

  const handleBid = async () => {
    if (!isLoggedIn) {
      alert("Please log in to place a bid.");
      return;
    }

    try {
      await placeBid(Number(auctionId), Number(koiId), Number(bidAmount));
      // Refresh auction details and bid history after placing a bid
      const [updatedAuctionKoi, updatedHistory] = await Promise.all([
        fetchAuctionKoiDetails(Number(auctionId), Number(koiId)),
        fetchBidHistory(Number(auctionId), Number(koiId)),
      ]);
      setAuctionKoi(updatedAuctionKoi);
      setBidHistory(updatedHistory);
      setBidAmount("");
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Please try again.");
    }
  };

  if (!koi || !auctionKoi) {
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

          {!auctionKoi.is_sold && (
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
                onClick={handleBid}
                className="mt-2 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Place Bid
              </button>
            </div>
          )}

          <div className="rounded-2xl bg-gray-300 p-4">
            <h3 className="mb-2 text-xl font-semibold">Bid History</h3>
            <div className="max-h-full overflow-y-auto">
              <BiddingHistory auctionKoiId={auctionKoi.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KoiBidding;
