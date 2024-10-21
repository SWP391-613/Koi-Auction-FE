import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import { isPast, parse } from "date-fns"; // Make sure to install date-fns if you haven't already
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KoiInAuctionGrid from "~/components/shared/KoiInAuctionGrid";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useAuth } from "~/contexts/AuthContext";
import { KoiWithAuctionKoiData } from "~/types/auctionkois.type";
import { AuctionModel } from "~/types/auctions.type";
import {
  fetchAuctionById,
  fetchAuctionKoi,
  getKoiById,
} from "~/utils/apiUtils"; // Assume we have this API function
import { getUserCookieToken } from "~/utils/auth.utils";
import { getAuctionStatusV2 } from "~/utils/dateTimeUtils";

const AuctionDetail: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<AuctionModel | null>(null);
  const [koiWithAuctionKoiData, setKoiWithAuctionKoiData] = useState<
    KoiWithAuctionKoiData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const token = getUserCookieToken();
  useEffect(() => {
    if (!token) return;

    const fetchAuction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const auctionData = await fetchAuctionById(Number(id));
        setAuction(auctionData);

        if (auctionData) {
          const auctionKoiData = await fetchAuctionKoi(auctionData.id!);
          const koiDetailsPromises = auctionKoiData.map((auctionKoi) =>
            getKoiById(auctionKoi.koi_id, token),
          );
          const koiDetails = await Promise.all(koiDetailsPromises);

          const combined = koiDetails.map((koiDetail, index) => ({
            ...koiDetail,
            auctionKoiData: auctionKoiData[index],
          }));

          setKoiWithAuctionKoiData(combined);
        } else {
          setError("Auction not found.");
        }
      } catch (err) {
        console.error("Error fetching auction details:", err);
        setError("Failed to load auction details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  const isAuctionEnded = (endDate: string) => {
    console.log("endDate", endDate);
    const parsedDate = parse(endDate, "MMM d, yyyy 'at' h:mm a", new Date());
    return isPast(parsedDate);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </div>
    );
  }

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
        <div className="flex flex-col sm:flex-row md:px-28 justify-between">
          <div className="mb-5">
            <Typography variant="h6">
              Name: &nbsp;
              <span className="text-2xl font-semibold text-black">
                {auction.title}
              </span>
            </Typography>

            <Typography variant="h6">
              Status: &nbsp;
              <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
              <span className="text-xl text-black glow-text">
                {getAuctionStatusV2(
                  auction.start_time.toString(),
                  auction.end_time.toString(),
                )}
              </span>
            </Typography>
          </div>
        </div>
        <KoiInAuctionGrid kois={koiWithAuctionKoiData} auction={auction} />
      </div>
    </>
  );
};

export default AuctionDetail;
