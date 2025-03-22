import { faArrowLeft, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAuctionById } from "~/apis/auction.apis";
import KoiInAuctionGrid from "~/components/shared/KoiInAuctionGrid";
import LoadingComponent from "~/components/shared/LoadingComponent";
import NavigateButton from "~/components/shared/NavigateButton";
import { useAuth } from "~/contexts/AuthContext";
import { AuctionKoi, KoiWithAuctionKoiData } from "~/types/auctionkois.type";
import { AuctionResponse } from "~/types/auctions.type";
import { getAuctionStatusV2 } from "~/utils/dateTimeUtils";

export type Auction = {
  id: number;
  title: string;
  start_time: Date | string;
  end_time: Date | string;
  end_time_countdown?: Date | string;
  status: string; // Using string instead of AUCTION_STATUS for simplicity
  auctioneer_id: number;
  auction_koi: AuctionKoi[];
};

const AuctionDetail: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);

  const [koiWithAuctionKoiData, setKoiWithAuctionKoiData] = useState<
    KoiWithAuctionKoiData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAuction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const auctionData = await fetchAuctionById(Number(id));
        if (auctionData) {
          setAuction(auctionData);
        } else {
          setError("Auction not found.");
        }
      } catch (err) {
        console.error("Error fetching auction details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  if (isLoading) return <LoadingComponent />;

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  if (!auction) {
    return (
      <div className="py-8 text-center text-red-500">
        No auction data available.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col p-5">
        <div className="mt-6 mb-5 md:ml-10 flex flex-col pt-3 pl-6 justify-between">
          <NavigateButton
            to={`/auctions`}
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
            text="Auctions"
            className="rounded bg-gray-200 px-5 py-3 text-lg text-black transition hover:bg-gray-200"
          />
          <Typography variant="h6">
            Name: &nbsp;
            <span className="text-xl md:text-2xl font-semibold text-black">
              {auction.title}
            </span>
          </Typography>
          <Typography variant="h6">
            Status: &nbsp;
            <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
            <span className="text-sm md:text-xl text-black glow-text">
              {getAuctionStatusV2(
                auction.start_time.toString(),
                auction.end_time.toString(),
              )}
            </span>
          </Typography>
          <Typography variant="h6">
            Start Time: &nbsp;
            <span className="text-sm md:text-xl text-black">
              {auction.start_time.toString()}
            </span>
          </Typography>
          <Typography variant="h6">
            End Time: &nbsp;
            <span className="text-sm md:text-xl text-black">
              {auction.end_time.toString()}
            </span>
          </Typography>
        </div>
        <KoiInAuctionGrid auction={auction} />
      </div>
    </>
  );
};

export default AuctionDetail;
