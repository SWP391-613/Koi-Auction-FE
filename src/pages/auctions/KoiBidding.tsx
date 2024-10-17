import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { Bid } from "~/components/koibiddingdetail/BiddingHistory";
import { KoiInfoGridComponent } from "~/components/koibiddingdetail/KoiInfoGridComponent";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { WEB_SOCKET_MESSAGE } from "~/constants/webSocketMessages";
import { useUserData } from "~/hooks/useUserData";
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
import BiddingHistory from "~/components/koibiddingdetail/BiddingHistory";
import NavigateButton from "../../components/shared/NavigateButton";
import { KoiDetailModel } from "~/types/kois.type";
import { AuctionModel } from "~/types/auctions.type";
import { AuctionKoi } from "~/types/auctionkois.type";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { formatCurrency } from "~/utils/currencyUtils";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "~/constants/message";

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
    () => auction?.status === AUCTION_STATUS.ONGOING,
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
          auctionKoi?.bid_method === "SEALED_BID"
            ? 0
            : auctionKoiDetails.current_bid +
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
              toast.success(SUCCESS_MESSAGE.HIGHEST_BID_RECEIVED);
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

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;
  if (!koi || !auctionKoi || !auction) return <LoadingComponent />;

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
      <div className="m-5 flex flex-col gap-4 md:flex-row">
        {/* Koi Image and Media Gallery */}
        <div className="flex flex-col items-center justify-start w-full md:w-[50%]">
          <div
            className="relative justify-center h-[25rem] w-full md:h-[40rem] md:w-[80%] rounded-xl
          bg-gradient-to-r from-[#1365b4] to-[#1584cb] duration-300 ease-in-out"
          >
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
                  className="absolute inset-0 h-full w-full rounded-xl object-contain
                          drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.2)]
                        duration-500
                        hover:drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.35)] opacity-100"
                  src={selectedMedia}
                  alt={koi.name}
                />
              )
            ) : (
              <img
                className="absolute inset-0 h-full w-full rounded-xl object-contain
                          drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.2)]
                        duration-500
                        hover:drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.35)] opacity-100"
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
          <div className="mt-4 h-30 flex space-x-2 overflow-x-auto">
            <img
              src={koi.thumbnail}
              alt="Main"
              className="w-20 cursor-pointer rounded-md object-cover"
              onClick={() => setSelectedMedia(koi.thumbnail)}
            />
            <img
              src={koi.thumbnail}
              alt="Main"
              className="w-20 cursor-pointer rounded-md object-cover"
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
              className="flex w-20 cursor-pointer items-center justify-center rounded-md bg-gray-200"
              onClick={() =>
                setSelectedMedia("https://www.youtube.com/embed/your-video-id")
              }
            ></div>
          </div>
        </div>

        {/* Koi Info and Bidding */}
        <div className="flex flex-col gap-5 w-full">
          <div className="koi-info w-full space-y-4 rounded-2xl bg-gray-200 p-2 text-lg">
            <KoiInfoGridComponent
              koi={koi}
              auctionKoi={auctionKoi}
              user={user}
            />
          </div>
          <div className="koi-info w-full space-y-4 rounded-2xl bg-gray-200 p-4 text-lg">
            {!isAuctionEnded() && !auctionKoi.is_sold ? (
              <div className="flex flex-col gap-2 rounded-2xl bg-[#F1F1F1] p-4">
                <h3 className="mb-2 text-xl font-semibold text-center">
                  Place Your Bid
                </h3>
                <TextField
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  variant="outlined" // You can change to "filled" or "standard" for different styles
                  placeholder="Enter bid amount"
                  fullWidth // Makes the input take the full width of its container
                  inputProps={{
                    style: { textAlign: "right" }, // Aligns text to the right
                  }}
                  sx={{
                    // Custom styles
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px", // Rounded corners
                      "& fieldset": {
                        borderColor: "gray", // Border color
                      },
                      "&:hover fieldset": {
                        borderColor: "green", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "green", // Border color when focused
                      },
                    },
                  }}
                />
                <button
                  onClick={handlePlaceBid}
                  className="mt-2 w-full rounded-2xl bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  Submit
                </button>
              </div>
            ) : (
              <div className="mb-4 rounded-2xl bg-gray-200">
                <h3 className="mb-2 text-xl font-semibold">Past Bids</h3>
                <p>
                  {auctionKoi.current_bid > 0 ? (
                    `This koi has been sold for ${formatCurrency(auctionKoi.current_bid)}`
                  ) : (
                    <div className="bg-gray-300 p-4 rounded-2xl">
                      <span>No bids yet</span>
                      <br />
                      <span>Be the first to bid!</span>
                    </div>
                  )}
                </p>
              </div>
            )}

            {/* Conditionally render the Bid History section */}
            {auctionKoi.current_bid > 0 && (
              <>
                <h3 className="mb-2 text-xl font-semibold">Bid History</h3>
                <div className="rounded-2xl bg-gray-300 p-4 max-h-[50rem] overflow-auto">
                  <div className="max-h-full overflow-auto">
                    <BiddingHistory
                      auctionKoiId={auctionKoi.id}
                      latestBid={latestBid}
                    />
                  </div>
                </div>
              </>
            )}
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
      <ToastContainer />
    </div>
  );
};

export default KoiBidding;
