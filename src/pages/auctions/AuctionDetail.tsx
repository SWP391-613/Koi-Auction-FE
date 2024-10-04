import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchAuctionById,
  fetchAuctionKoi,
  getKoiById,
  convertTimeArrayToDate,
} from "~/utils/apiUtils"; // Assume we have this API function
import { useAuth } from "~/AuthContext";
import { KoiDetailModel } from "../kois/Kois";
import { Auction } from "./Auctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faFish,
  faRuler,
  faTicketSimple,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";

export interface AuctionKoi {
  id: number;
  auction_id: number;
  koi_id: number;
  base_price: number;
  current_bid: number;
  current_bidder_id: number | null;
  is_sold: boolean;
  bid_method: string;
  bid_step: number;
}

interface KoiWithAuctionKoiData extends KoiDetailModel {
  auctionKoiData: AuctionKoi;
}

const AuctionDetail: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [koiWithAuctionKoiData, setKoiWithAuctionKoiData] = useState<KoiWithAuctionKoiData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuction = async () => {
      const auctionData = await fetchAuctionById(Number(id));
      setAuction(auctionData);

      if (auctionData) {
        const auctionKoiData = await fetchAuctionKoi(auctionData.id);
        const koiDetailsPromises = auctionKoiData.map(
          (auctionKoi: AuctionKoi) => getKoiById(auctionKoi.koi_id),
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
  }, [id]);

  if (!auction) {
    return <div className="py-8 text-center">Auction not found.</div>;
  }

  return (
    <>
      <div className="mx-auto flex flex-col">
        <div
          className="m-2 flex max-h-30 flex-col items-start justify-between gap-4
        rounded-lg bg-transparent p-6 shadow-lg transition-all duration-300 ease-in-out
        hover:border-blue-500 hover:shadow-xl hover:ring-2 hover:ring-blue-300"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="mb-4 flex flex-col">
              {/* <h1 className="text-2xl font-bold text-gray-800">
            Auction #{auction.id}
          </h1> */}
              <h2 className="text-3xl font-semibold text-black">
                {auction.title}
              </h2>
            </div>

            <div className="mb-4 flex flex-col">
              <h3 className="text-sm text-gray-500">Start Time:</h3>
              <p className="text-lg font-medium text-gray-700">
                {auction.start_time}
              </p>
            </div>

            <div className="mb-4 flex flex-col">
              <h3 className="text-sm text-gray-500">End Time:</h3>
              <p className="text-lg font-medium text-gray-700">
                {auction.end_time}
              </p>
            </div>

            <div className="flex flex-row items-center">
              <span
                className={`rounded-lg px-4 py-2 text-lg font-bold
                  ${auction.status === "On-going" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
              >
                {auction.status}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 p-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {koiWithAuctionKoiData.map((combinedKoiData) => (
            <Link
              to={`/auctionkois/${auction.id}/${combinedKoiData.auctionKoiData.id}`}
              key={combinedKoiData.auctionKoiData.id}
              className="transform overflow-hidden m-5
              rounded-lg bg-white shadow-md transition-transform hover:scale-105"
            >
              <div className="relative flex items-center justify-center bg-[#4086c7]">
                <div className="h-112 w-72 md:h-112 md:w-72">
                  <div className="relative w-full h-full">
                    <img
                      src={combinedKoiData.thumbnail}
                      alt={combinedKoiData.name}
                      className="absolute h-full w-full"
                    />
                  </div>
                </div>
                <div
                  className="absolute top-2 left-2 bg-black bg-opacity-50
                text-white rounded-full p-1 text-xs flex items-center"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  {combinedKoiData.owner_id}
                </div>
                <div
                  className="absolute bottom-2 left-2
                text-white rounded-full p-1 text-xs"
                >
                  <FontAwesomeIcon icon={faTicketSimple} className="mr-1" />
                  {combinedKoiData.id}
                </div>
                <div className="absolute bottom-2 right-2 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-200 rounded-b-lg">
                <h2 className="text-xl text-black font-semibold mb-2">
                  {combinedKoiData.name}
                </h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    {combinedKoiData.status_name}
                  </span>
                  <span
                    className={`text-xl font-bold px-2 py-1 rounded-full ${combinedKoiData.auctionKoiData.current_bid
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                      }`}
                  >
                    $
                    {combinedKoiData.auctionKoiData.current_bid ||
                      combinedKoiData.auctionKoiData.base_price}
                  </span>
                </div>
                <hr className="border-t border-gray-400 my-2" />
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faFish}
                      className="mr-2 text-gray-500 hidden sm:block"
                    />
                    <label className="text-gray-500 text-xl ">Category: </label>
                    <span className="text-gray-500 text-xl">
                      {" "}
                      {combinedKoiData.category_id || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center lg:justify-end">
                    <FontAwesomeIcon
                      icon={faVenusMars}
                      className="mr-2 text-gray-500 hidden sm:block"
                    />
                    <label className="text-gray-500 text-xl ">Sex: </label>
                    <span className="text-gray-500 text-xl">
                      {" "}
                      {combinedKoiData.sex || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faRuler}
                      className="mr-2 text-gray-500 hidden sm:block"
                    />
                    <label className="text-gray-500 text-xl ">Length: </label>
                    <span className="text-gray-500 text-xl">
                      {" "}
                      {combinedKoiData.length}cm
                    </span>
                  </div>
                  <div className="flex items-center lg:justify-end">
                    <FontAwesomeIcon
                      icon={faCakeCandles}
                      className="mr-2 text-gray-500 hidden sm:block"
                    />
                    <label className="text-gray-500 text-xl ">Age: </label>
                    <span className="text-gray-500 text-xl">
                      {" "}
                      {combinedKoiData.age || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AuctionDetail;
