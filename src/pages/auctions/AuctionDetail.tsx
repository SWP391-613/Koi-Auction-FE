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
import { displayKoiStatus, getCategoryName } from "~/utils/dataConverter";
import { getAuctionStatusV2 } from "~/utils/dateTimeUtils";
import { format, isPast, parse } from "date-fns"; // Make sure to install date-fns if you haven't already
import KoiDetails from "~/components/auctiondetail/KoiDetails";

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
            <h1 className="text-2xl font-semibold text-black">
              {auction.title}
            </h1>

            <div className="">
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

        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {koiWithAuctionKoiData.map((combinedKoiData) => (
            <Link
              to={`/auctionkois/${auction.id}/${combinedKoiData.auctionKoiData.id}`}
              key={combinedKoiData.auctionKoiData.id}
              className="transform overflow-hidden m-1 md:m-5
              rounded-[1.5rem] bg-white shadow-md transition-transform hover:scale-102"
            >
              <div className="flex flex-col">
                <div
                  className="relative flex md:justify-center
                bg-gradient-to-r from-[#1365b4] to-[#1584cb] duration-300 ease-in-out"
                >
                  <div className="h-[17rem] w-[50%] md:h-[28rem] md:w-[23rem] flex justify-center">
                    <div
                      className="absolute w-[30%] h-[60%] top-1/2 left-1/4
                    -translate-x-1/2 -translate-y-1/2 md:w-[60%] md:h-[90%] md:top-1/2 md:left-1/2"
                    >
                      <img
                        src={combinedKoiData.thumbnail}
                        alt={combinedKoiData.name}
                        className="h-full w-full
                        drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.2)]
                        duration-500
                        hover:drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.35)] opacity-100 "
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
                    className="absolute bottom-9 left-2 md:bottom-2 md:left-3
                  text-white rounded-full p-1 text-md font-bold"
                  >
                    <FontAwesomeIcon icon={faTag} className="mr-1" />
                    {combinedKoiData.auctionKoiData.id}
                  </div>
                  <div
                    className="sm:hidden bg-gray-300 rounded-xl m-3 p-2 text-md font-bold
                  w-1/2"
                  >
                    <KoiDetails
                      category={getCategoryName(combinedKoiData.category_id)}
                      sex={combinedKoiData.sex}
                      length={combinedKoiData.length}
                      age={combinedKoiData.age}
                    />
                  </div>
                  <div
                    className="absolute bottom-2 left-2 sm:left-auto sm:right-2
                  text-white rounded-full p-1 text-md font-bold"
                  >
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                  </div>
                </div>
                <div className="p-4 bg-gray-300 sm:flex sm:flex-col">
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
                      {combinedKoiData.auctionKoiData.bid_method ===
                      "SEALED_BID"
                        ? "Hidden"
                        : formatCurrency(
                            combinedKoiData.auctionKoiData.current_bid ||
                              combinedKoiData.auctionKoiData.base_price,
                          )}
                    </span>
                  </div>
                  <div className="hidden sm:flex flex-col sm:flex-row">
                    <hr className="w-full border-t border-gray-400 my-2" />
                  </div>
                  <div className="hidden sm:block">
                    <KoiDetails
                      category={combinedKoiData.category_id.toString()}
                      sex={combinedKoiData.sex}
                      length={combinedKoiData.length}
                      age={combinedKoiData.age}
                    />
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
