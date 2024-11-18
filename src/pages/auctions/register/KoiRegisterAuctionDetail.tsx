import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KoiInAuctionGrid from "~/components/shared/KoiInAuctionGrid";
import { useAuth } from "~/contexts/AuthContext";
import { AuctionKoi, KoiWithAuctionKoiData } from "~/types/auctionkois.type";
import { AuctionModel } from "~/types/auctions.type";
import { getAuctionStatusColor } from "~/utils/colorUtils";
import { getCookie } from "~/utils/cookieUtils";
import { getAuctionStatusV2 } from "~/utils/dateTimeUtils";
import BreederKoiManagement from "./BreederKoiManagement";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { fetchAuctionById } from "~/apis/auction.apis";
import { fetchAuctionKoi } from "~/apis/auctionkoi.apis";
import { fetchKoiById } from "~/apis/koi.apis";

const KoiRegisterAuctionDetail: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<AuctionModel | null>(null);
  const [koiWithAuctionKoiData, setKoiWithAuctionKoiData] = useState<
    KoiWithAuctionKoiData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = getCookie("access_token");

  useEffect(() => {
    if (!token) return;

    const fetchAuction = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const auctionData = await fetchAuctionById(Number(id));
        if (auctionData) {
          setAuction(auctionData);

          if (auctionData) {
            const auctionKoiData = await fetchAuctionKoi(auctionData.id!);
            if (auctionKoiData) {
              const koiDetailsPromises = auctionKoiData.map(
                (auctionKoi: AuctionKoi) => fetchKoiById(auctionKoi.koi_id),
              );
              const koiDetails = await Promise.all(koiDetailsPromises);

              const combined = koiDetails.map((koiDetail, index) => ({
                ...koiDetail,
                auctionKoiData: auctionKoiData[index],
              }));

              setKoiWithAuctionKoiData(combined);
            }
          }
        } else {
          setError("No Upcoming Auction Found.");
        }
      } catch (err) {
        setError("Error fetching auction data.");
      } finally {
        setLoading(false); // Set loading to false once the fetch is done
      }
    };

    fetchAuction();
  }, [id, token]);

  if (loading) {
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
