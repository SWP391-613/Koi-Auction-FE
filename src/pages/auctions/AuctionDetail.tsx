import {
  faArrowCircleRight,
  faCakeCandles,
  faClock,
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
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useAuth } from "~/contexts/AuthContext";
import { KoiWithAuctionKoiData } from "~/types/auctionkois.type";
import { AuctionModel } from "~/types/auctions.type";
import {
  fetchAuctionById,
  fetchAuctionKoi,
  getKoiById,
} from "~/utils/apiUtils"; // Assume we have this API function
import { formatCurrency } from "~/utils/currencyUtils";
import { displayKoiStatus } from "~/utils/dataConverter";
import { getAuctionStatusV2 } from "~/utils/dateTimeUtils";
import { format, isPast, parse } from "date-fns"; // Make sure to install date-fns if you haven't already

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
    return <div className="py-8 text-center">No auction data available.</div>;
  }

  return (
    <>
      <div className="flex flex-col p-5">
        <div className="pl-28 pr-28 flex flex-col sm:flex-row items-center justify-between">
          <div className="">
            <h1 className="text-2xl mb-5 font-semibold text-black">
              {auction.title}
            </h1>

            <div className=" mt-5">
              <span className="text-xl text-black glow-text">
                {getAuctionStatusV2(
                  auction.start_time.toString(),
                  auction.end_time.toString(),
                )}
              </span>
            </div>
          </div>
          {/* <SearchBar placeholder="Type to search..." debounceTime={500} /> */}
        </div>

        <div className="pl-28 pr-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  {combinedKoiData.category_id}
                </div>
                {/* <div
                  className="absolute top-3 right-3
                text-white rounded-full p-1 text-md font-bold"
                >
                  {combinedKoiData.auctionKoiData.bid_method
                    ? convertBidMethodToReadable(
                        combinedKoiData.auctionKoiData.bid_method,
                      )
                    : "Buy Now"}
                </div> */}
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
              <div className="pl-4 pr-4 py-2 bg-gray-300">
                <h2 className="text-xl mt-1 mb-1 text-black font-semibold">
                  {combinedKoiData.name}
                </h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-black w-1/2 flex gap-3 justify-start items-center">
                    {combinedKoiData.auctionKoiData.is_sold ? (
                      <>
                        <FontAwesomeIcon icon={faClock} />
                        Sold!
                      </>
                    ) : isAuctionEnded(auction.end_time.toString()) ? (
                      <>
                        <FontAwesomeIcon icon={faClock} />
                        Ended!
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faClock} />
                        Available
                      </>
                    )}
                  </span>
                  <span
                    className={`text-xl font-bold px-2 py-1 rounded-full flex gap-2 justify-center items-center ${
                      combinedKoiData.auctionKoiData.current_bid
                        ? "bg-green-500 text-white"
                        : "text-black"
                    }`}
                  >
                    <FontAwesomeIcon icon={faArrowCircleRight} className="" />
                    {combinedKoiData.auctionKoiData.bid_method === "SEALED_BID"
                      ? "Hidden"
                      : formatCurrency(
                          combinedKoiData.auctionKoiData.current_bid ||
                            combinedKoiData.auctionKoiData.base_price,
                        )}
                  </span>
                </div>
              </div>
              <div className="bg-gray-300">
                <hr className="border-t border-gray-400 " />
              </div>
              <div className="pl-4 pr-4 py-2 bg-gray-300 rounded-b-lg">
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                  <div className="flex mb-3 justify-start items-center flex-row">
                    <FontAwesomeIcon
                      icon={faEarthAsia}
                      className="mr-6 ml-4 text-[#4086c7] hidden sm:block"
                    />
                    <div className="flex flex-col">
                      <label className="text-gray-500">Category </label>
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
                        {combinedKoiData.age + "y" || "Unknown"}
                      </span>
                    </div>
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
