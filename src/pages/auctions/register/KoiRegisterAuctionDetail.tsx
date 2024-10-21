import {
  faCakeCandles,
  faEarthAsia,
  faRuler,
  faStar,
  faTag,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import { AuctionKoi, KoiWithAuctionKoiData } from "~/types/auctionkois.type";
import { AuctionModel } from "~/types/auctions.type";
import {
  fetchAuctionById,
  fetchAuctionKoi,
  getKoiById,
} from "~/utils/apiUtils"; // Assume we have this API function
import { getAuctionStatusColor } from "~/utils/colorUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import { convertDataToReadable } from "~/utils/dataConverter";
import { getAuctionStatusV2 } from "~/utils/dateTimeUtils";
import BreederKoiManagement from "./BreederKoiManagement";
import { getCookie } from "~/utils/cookieUtils";
import KoiInAuctionGrid from "~/components/shared/KoiInAuctionGrid";

const KoiRegisterAuctionDetail: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<AuctionModel | null>(null);
  const [koiWithAuctionKoiData, setKoiWithAuctionKoiData] = useState<
    KoiWithAuctionKoiData[]
  >([]);
  const navigate = useNavigate();
  const token = getCookie("access_token");

  useEffect(() => {
    if (!token) return;

    const fetchAuction = async () => {
      const auctionData = await fetchAuctionById(Number(id));
      setAuction(auctionData);

      if (auctionData) {
        const auctionKoiData = await fetchAuctionKoi(auctionData.id!);
        const koiDetailsPromises = auctionKoiData.map(
          (auctionKoi: AuctionKoi) => getKoiById(auctionKoi.koi_id, token),
        );
        const koiDetails = await Promise.all(koiDetailsPromises);

        const combined = koiDetails.map((koiDetail, index) => ({
          ...koiDetail,
          auctionKoiData: auctionKoiData[index],
        }));

        setKoiWithAuctionKoiData(combined);
      }
    };
    fetchAuction();
  }, [id, token]);

  if (!auction) {
    return (
      <div className="py-8 text-center text-red-500">
        No Upcoming Auction Found.
      </div>
    );
  }

  if (!token) navigate("/login");

  const handleAddKoiToAuction = () => {
    alert(`Add Koi id to auction ${auction.id}`);
  };

  return (
    <>
      <div className="flex flex-col mt-2">
        <div className="flex flex-col sm:flex-col items-start pl-6 ml-5 mt-5">
          <div className="mb-4">
            <span className="text-xl text-black">Auction Name: </span>
            <h2 className="text-2xl font-semibold text-black">
              {auction.title}
            </h2>
          </div>
          <div className="">
            <span
              className={`rounded-lg px-4 py-2 text-lg font-bold ${getAuctionStatusColor(auction.status)}`}
            >
              {auction.status}
            </span>
          </div>
          <div className="mt-5">
            <label className="text-xl text-black">Start Time: </label>
            <span className="text-xl text-black glow-text">
              {auction.start_time.toString()}
            </span>
          </div>
          <div className="mt-5">
            <label className="text-xl text-black">End Time: </label>
            <span className="text-xl text-black glow-text">
              {auction.end_time.toString()}
            </span>
          </div>
          <div className=" mt-5">
            <span className="text-xl text-black glow-text">
              {getAuctionStatusV2(
                auction.start_time.toString(),
                auction.end_time.toString(),
              )}
            </span>
          </div>
        </div>
        <KoiInAuctionGrid kois={koiWithAuctionKoiData} auction={auction} />
        <BreederKoiManagement auction_id={auction.id} />
      </div>
    </>
  );
};

export default KoiRegisterAuctionDetail;
