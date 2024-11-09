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
import KoiRegisterAuctionDetail from "./register/KoiRegisterAuctionDetail";
import { motion, AnimatePresence } from "framer-motion";

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
  useEffect(() => {
    const fetchAuction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const auctionData = await fetchAuctionById(Number(id));
        setAuction(auctionData);

        if (auctionData) {
          const auctionKoiData = await fetchAuctionKoi(auctionData.id!);
          const koiDetailsPromises = auctionKoiData.map((auctionKoi) =>
            getKoiById(auctionKoi.koi_id),
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen"
      >
        <LoadingComponent />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center text-red-500"
      >
        {error}
      </motion.div>
    );
  }

  if (!auction) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center text-red-500"
      >
        No auction data available.
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col p-5"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <KoiRegisterAuctionDetail />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-5 flex flex-col pt-3 pl-6 justify-between"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Typography variant="h6">
              Name: &nbsp;
              <span className="text-2xl font-semibold text-black">
                {auction.title}
              </span>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Typography variant="h6">
              Status: &nbsp;
              <motion.span
                animate={{ 
                  scale: [1, 1.1, 1],
                  transition: { 
                    repeat: Infinity, 
                    duration: 2 
                  }
                }}
              >
                <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
              </motion.span>
              <span className="text-xl text-black glow-text">
                {getAuctionStatusV2(
                  auction.start_time.toString(),
                  auction.end_time.toString(),
                )}
              </span>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Typography variant="h6">
              Start Time: &nbsp;
              <span className="text-xl text-black">
                {auction.start_time.toString()}
              </span>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Typography variant="h6">
              End Time: &nbsp;
              <span className="text-xl text-black">
                {auction.end_time.toString()}
              </span>
            </Typography>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <KoiInAuctionGrid kois={koiWithAuctionKoiData} auction={auction} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuctionDetail;
