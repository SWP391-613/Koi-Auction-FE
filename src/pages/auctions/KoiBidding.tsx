import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Bid } from "~/components/BiddingHistory";
import { KoiInfoGridComponent } from "~/components/koibiddingdetail/KoiInfoGridComponent";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { ERROR_MESSAGE } from "~/constants/errorMessages";
import { SUCCESS_MESSAGE } from "~/constants/successMessage";
import { WEB_SOCKET_MESSAGE } from "~/constants/webSocketMessages";
import { useUserData } from "~/contexts/useUserData";
import {
  fetchAuctionById,
  fetchAuctionKoiDetails,
  getKoiById,
  placeBid,
} from "~/utils/apiUtils";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToAuctionUpdates,
} from "~/utils/websocket";
import Sold from "../../assets/Sold.png";
import BiddingHistory from "../../components/BiddingHistory";
import NavigateButton from "../../components/shared/NavigateButton";
import { KoiDetailModel } from "~/types/kois.type";
import { AuctionModel } from "~/types/auctions.type";
import { AuctionKoi } from "~/types/auctionkois.type";

// Define the BidRequest interface
export type BidRequest = {
  auction_koi_id: number; // The ID of the auction koi
  bid_amount: number; // The amount of the bid
  bidder_id: number;
};

const KoiBidding: React.FC = () => {
  const { auctionId, auctionKoiId } = useParams<{
    auctionId: string;
    auctionKoiId: string;
  }>();
  const { user, loading, error } = useUserData();
  const [koi, setKoi] = useState<KoiDetailModel | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [auctionKoi, setAuctionKoi] = useState<AuctionKoi | null>(null);
  const [auction, setAuction] = useState<AuctionModel | null>(null);
  const [latestBid, setLatestBid] = useState<Bid | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const isAuctionOngoing = useCallback(
    () => auction?.status === AUCTION_STATUS.ACTIVE,
    [auction],
  );
  const isAuctionEnded = useCallback(
    () => !isAuctionOngoing(),
    [isAuctionOngoing],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [auctionKoiDetails, auctionDetails] = await Promise.all([
          fetchAuctionKoiDetails(Number(auctionId), Number(auctionKoiId)),
          fetchAuctionById(Number(auctionId)),
        ]);
        setAuctionKoi(auctionKoiDetails);
        setAuction(auctionDetails);
        setBidAmount(
          auctionKoiDetails.current_bid +
            auctionKoiDetails.bid_step +
            (auctionKoiDetails.current_bid === 0
              ? auctionKoiDetails.base_price
              : 0),
        );
        setKoi(await getKoiById(auctionKoiDetails.koi_id));
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load auction details. Please try again.");
      }
    };
    loadData();
  }, [auctionId, auctionKoiId]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (isAuctionOngoing() && auctionKoiId && !auctionKoi?.is_sold) {
      connectWebSocket(() => {
        setIsConnected(true);
        unsubscribe = subscribeToAuctionUpdates(
          Number(auctionKoiId),
          (bidResponse: Bid) => {
            if (auctionKoi && bidResponse.bid_amount > auctionKoi.current_bid) {
              toast.success("New highest bid received!");
            }
            setLatestBid(bidResponse);
            setAuctionKoi((prev) =>
              prev ? { ...prev, current_bid: bidResponse.bid_amount } : null,
            );
            setBidAmount(bidResponse.bid_amount + (auctionKoi?.bid_step || 0));
          },
        );
      });
    } else {
      disconnectWebSocket();
      setIsConnected(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
      disconnectWebSocket();
    };
  }, [auction, auctionKoiId, isAuctionOngoing, auctionKoi]);

  const handlePlaceBid = useCallback(async () => {
    if (!user || !auctionKoi)
      return toast.error(ERROR_MESSAGE.REQUIRED_LOGIN_TO_BID);
    try {
      await placeBid({
        auction_koi_id: auctionKoi.id,
        bid_amount: bidAmount,
        bidder_id: user.id,
      });
      toast.success(SUCCESS_MESSAGE.BID_PLACED);
      // The WebSocket will handle updating the UI
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGE.UNEXPECTED_ERROR_BID);
      }
    }
  }, [user, auctionKoi, bidAmount]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!koi || !auctionKoi || !auction) return <div>Loading...</div>;

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
        {/* Koi Image and Media Gallery */}
        <div className="w-full md:w-128">
          <div className="relative h-96 w-full rounded-xl bg-[#4086c7] sm:h-128 md:h-144 lg:h-192">
            {selectedMedia ? (
              selectedMedia.includes("youtube") ? (
                <iframe
                  className="absolute inset-0 h-full w-full rounded-xl"
                  src={selectedMedia}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img
                  className="absolute inset-0 h-full w-full rounded-xl object-contain shadow-md transition duration-300 hover:shadow-2xl hover:ring-4 hover:ring-blue-400"
                  src={selectedMedia}
                  alt={koi.name}
                />
              )
            ) : (
              <img
                className="absolute inset-0 h-full w-full rounded-xl object-contain shadow-md transition duration-300 hover:shadow-2xl hover:ring-4 hover:ring-blue-400"
                src={koi.thumbnail}
                alt={koi.name}
              />
            )}
            {auctionKoi.is_sold && (
              <div className="absolute -left-4 -top-4 z-10">
                <img
                  src={Sold}
                  alt="Sold"
                  className="h-[10rem] w-[10rem] transform rotate-[-20deg]"
                />
              </div>
            )}
          </div>

          {/* Media Gallery */}
          <div className="mt-4 flex space-x-2 overflow-x-auto">
            <img
              src={koi.thumbnail}
              alt="Main"
              className="h-20 w-20 cursor-pointer rounded-md object-cover"
              onClick={() => setSelectedMedia(koi.thumbnail)}
            />
            {/* {koi.additional_images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Additional ${index + 1}`}
                className="h-20 w-20 cursor-pointer rounded-md object-cover"
                onClick={() => setSelectedMedia(img)}
              />
            ))} */}
            <div
              className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md bg-gray-200"
              onClick={() =>
                setSelectedMedia("https://www.youtube.com/embed/your-video-id")
              }
            ></div>
          </div>
        </div>

        {/* Koi Info and Bidding */}
        <div className="koi-info w-full space-y-4 rounded-2xl bg-gray-200 p-4 text-lg">
          <KoiInfoGridComponent koi={koi} auctionKoi={auctionKoi} user={user} />

          {!isAuctionEnded() && !auctionKoi.is_sold ? (
            <div className="mb-4 rounded-2xl bg-gray-300 p-4">
              <h3 className="mb-2 text-xl font-semibold">Place Your Bid</h3>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
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
          ) : (
            <div className="mb-4 rounded-2xl bg-gray-300 p-4">
              <h3 className="mb-2 text-xl font-semibold">Auction Ended</h3>
              <p>This koi has been sold for {auctionKoi.current_bid}</p>
            </div>
          )}
          <h3 className="mb-2 text-xl font-semibold">Bid History</h3>
          <div className="rounded-2xl bg-gray-300 p-4 max-h-[50rem] overflow-auto">
            <div className="max-h-full overflow-auto">
              <BiddingHistory
                auctionKoiId={auctionKoi.id}
                latestBid={latestBid}
              />
            </div>
          </div>
        </div>
      </div>
      {!isAuctionEnded() && (
        <Typography
          className={`text-lg ${isConnected ? "text-green-500" : "text-red-500"}`}
        >
          {isConnected
            ? WEB_SOCKET_MESSAGE.CONNECTED
            : WEB_SOCKET_MESSAGE.DISCONNECTED}
        </Typography>
      )}
    </div>
  );
};

export default KoiBidding;
