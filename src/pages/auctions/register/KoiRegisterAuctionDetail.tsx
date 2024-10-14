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
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AUCTION_STATUS } from "~/constants/auctionStatus";
import { useAuth } from "~/contexts/AuthContext";
import { AuctionKoi, KoiWithAuctionKoiData } from "~/types/auctionkois.type";
import { AuctionModel } from "~/types/auctions.type";
import {
  fetchAuctionById,
  fetchAuctionKoi,
  getKoiById,
} from "~/utils/apiUtils"; // Assume we have this API function
import { formatCurrency } from "~/utils/currencyUtils";
import { convertBidMethodToReadable } from "~/utils/dataConverter";
import { getAuctionStatusV2 } from "~/utils/dateTimeUtils";
import BreederKoiManagement from "./BreederKoiManagement";

const KoiRegisterAuctionDetail: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<AuctionModel | null>(null);
  const [koiWithAuctionKoiData, setKoiWithAuctionKoiData] = useState<
    KoiWithAuctionKoiData[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuction = async () => {
      const auctionData = await fetchAuctionById(Number(id));
      setAuction(auctionData);

      if (auctionData) {
        const auctionKoiData = await fetchAuctionKoi(auctionData.id!);
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

  const handleAddKoiToAuction = () => {
    alert(`Add Koi id to auction ${auction.id}`);
  };

  return (
    <>
      <div className="flex flex-col mt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between pl-6 ml-5 mt-5">
          <div className="">
            <div className="mb-4 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-black">
                {auction.title}
              </h2>
            </div>
            <div className="">
              <span
                className={`rounded-lg px-4 py-2 text-lg font-bold
                  ${auction.status === AUCTION_STATUS.ONGOING ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
              >
                {auction.status}
              </span>
            </div>
            <div className=" mt-5">
              <span className="text-xl text-black glow-text">
                {getAuctionStatusV2(auction.start_time, auction.end_time)}
              </span>
            </div>
          </div>
          {/* <SearchBar placeholder="Type to search..." debounceTime={500} /> */}
        </div>

        <div className="ml-20 mr-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {koiWithAuctionKoiData.map((combinedKoiData) => (
            <Link
              to={`/auctionkois/${auction.id}/${combinedKoiData.auctionKoiData.id}`}
              key={combinedKoiData.auctionKoiData.id}
              className="transform overflow-hidden m-5
              rounded-[2rem] bg-white shadow-md transition-transform hover:scale-102"
            >
              <div className="relative flex items-center justify-center bg-[#4086c7] hover:bg-[#418dd4] transition-colors duration-300 ease-in-out">
                <div className="h-112 w-76 md:h-112 md:w-72">
                  <div className="relative w-full h-full">
                    <img
                      src={combinedKoiData.thumbnail}
                      alt={combinedKoiData.name}
                      className="absolute h-full w-full"
                    />
                  </div>
                </div>
                <div
                  className="absolute top-3 left-3 bg-black bg-opacity-50
                text-white rounded-full p-3 text-lg flex items-center"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  {combinedKoiData.owner_id}
                </div>
                <div
                  className="absolute bottom-2 left-3
                text-white rounded-full p-1 text-md font-bold"
                >
                  <FontAwesomeIcon icon={faTag} className="mr-1" />
                  {combinedKoiData.id}
                </div>
                <div
                  className="absolute top-3 right-3
                text-white rounded-full p-1 text-md font-bold"
                >
                  {combinedKoiData.auctionKoiData.bid_method
                    ? convertBidMethodToReadable(
                        combinedKoiData.auctionKoiData.bid_method,
                      )
                    : "Buy Now"}
                </div>
                <div
                  className="absolute bottom-3 right-3
                text-white rounded-full p-1 text-md font-bold"
                >
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                </div>
              </div>
              <div className="pl-4 pr-4 py-2 bg-gray-200">
                <h2 className="text-xl text-black font-semibold">
                  {combinedKoiData.name}
                </h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    {combinedKoiData.status_name}
                  </span>
                  <span
                    className={`text-xl font-bold px-2 py-1 rounded-full ${
                      combinedKoiData.auctionKoiData.current_bid
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {formatCurrency(
                      combinedKoiData.auctionKoiData.current_bid ||
                        combinedKoiData.auctionKoiData.base_price,
                    )}
                  </span>
                </div>
              </div>
              <div className="bg-gray-200">
                <hr className="border-t border-gray-400 " />
              </div>
              <div className="pl-4 pr-4 py-2 bg-gray-200 rounded-b-lg">
                <div className="flex flex-col">
                  <div className="flex mb-3 justify-start items-center flex-row">
                    <FontAwesomeIcon
                      icon={faEarthAsia}
                      className="mr-6 ml-4 text-[#4086c7] hidden sm:block"
                    />
                    <div className="flex flex-col">
                      <label className="text-gray-500 temd-xl ">
                        Category{" "}
                      </label>
                      <span className="text-black text-xl">
                        {" "}
                        {combinedKoiData.category_id || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div className="flex mb-3 justify-start items-center flex-row">
                    <FontAwesomeIcon
                      icon={faVenusMars}
                      className="mr-6 ml-4 text-[#4086c7] hidden sm:block"
                    />
                    <div className="flex flex-col">
                      <label className="text-gray-500 text-md ">Sex</label>
                      <span className="text-black text-xl">
                        {" "}
                        {combinedKoiData.sex || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div className="flex mb-3 justify-start items-center flex-row">
                    <FontAwesomeIcon
                      icon={faRuler}
                      className="mr-6 ml-4 text-[#4086c7] hidden sm:block"
                    />
                    <div className="flex flex-col">
                      <label className="text-gray-500 text-md ">Length</label>
                      <span className="text-black text-xl">
                        {" "}
                        {combinedKoiData.length}cm
                      </span>
                    </div>
                  </div>
                  <div className="flex mb-3 justify-start items-center flex-row">
                    <FontAwesomeIcon
                      icon={faCakeCandles}
                      className="mr-6 ml-4 text-[#4086c7] hidden sm:block"
                    />
                    <div className="flex flex-col">
                      <label className="text-gray-500 text-md ">Ages</label>
                      <span className="text-black text-xl">
                        {" "}
                        {combinedKoiData.age || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <BreederKoiManagement />
      </div>
    </>
  );
};

export default KoiRegisterAuctionDetail;
