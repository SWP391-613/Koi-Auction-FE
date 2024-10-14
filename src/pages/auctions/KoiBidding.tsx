import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { useUserData } from "~/contexts/useUserData";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { ERROR_MESSAGE } from "~/constants/errorMessages";
import { SUCCESS_MESSAGE } from "~/constants/successMessage";
import { WEB_SOCKET_MESSAGE } from "~/constants/webSocketMessages";
import { KoiDetailModel } from "~/types/kois.type";
import { AuctionModel } from "~/types/auctions.type";
import { AuctionKoi } from "~/types/auctionkois.type";
import { Bid } from "~/components/BiddingHistory";

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
import { formatCurrency } from "~/utils/currencyUtils";

import { KoiInfoGridComponent } from "~/components/koibiddingdetail/KoiInfoGridComponent";
import BiddingHistory from "~/components/BiddingHistory";
import NavigateButton from "~/components/shared/NavigateButton";
import Loading from "~/components/loading/Loading";

import Sold from "~/assets/Sold.png";
import { BidRequest } from "~/types/bid.types";
import MediaGallery from "~/components/bidding/MediaGalleryComponent";
import BiddingSection from "~/components/bidding/BiddingSectionComponent";

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
          handleBidUpdate,
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

  const handleBidUpdate = (bidResponse: Bid) => {
    if (auctionKoi && bidResponse.bid_amount > auctionKoi.current_bid) {
      toast.success("New highest bid received!");
    }
    setLatestBid(bidResponse);
    setAuctionKoi((prev) =>
      prev ? { ...prev, current_bid: bidResponse.bid_amount } : null,
    );
    setBidAmount(bidResponse.bid_amount + (auctionKoi?.bid_step || 0));
  };

  const handlePlaceBid = useCallback(async () => {
    if (!user || !auctionKoi)
      return toast.error(ERROR_MESSAGE.REQUIRED_LOGIN_TO_BID);
    try {
      await placeBid({
        auction_koi_id: auctionKoi.id,
        bid_amount: bidAmount,
        bidder_id: user.id,
      } as BidRequest);
      toast.success(SUCCESS_MESSAGE.BID_PLACED);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGE.UNEXPECTED_ERROR_BID);
      }
    }
  }, [user, auctionKoi, bidAmount]);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!koi || !auctionKoi || !auction) return <Loading />;

  return (
    <div className="container mx-auto">
      <NavigateButton
        to={`/auctions/${auctionId}`}
        icon={<FontAwesomeIcon icon={faArrowLeft} />}
        text="Back to Auction"
        className="ml-10 mt-6 rounded bg-gray-200 px-5 py-3 text-lg text-black transition hover:bg-gray-200"
      />
      <div className="m-5 flex flex-col gap-4 sm:flex-col md:flex-row">
        <div className="flex flex-col items-start justify-start w-[45%]">
          <MediaGallery
            koi={koi}
            auctionKoi={auctionKoi}
            selectedMedia={selectedMedia}
            setSelectedMedia={setSelectedMedia}
          />
        </div>
        <div className="flex flex-col gap-5">
          <KoiInfoGridComponent koi={koi} auctionKoi={auctionKoi} user={user} />
          <BiddingSection
            isAuctionEnded={isAuctionEnded()}
            auctionKoi={auctionKoi}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            handlePlaceBid={handlePlaceBid}
            latestBid={latestBid}
          />
        </div>
      </div>
      {!isAuctionEnded() && (
        <Typography
          className={`text-lg ${
            isConnected ? "text-green-500" : "text-red-500"
          }`}
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
