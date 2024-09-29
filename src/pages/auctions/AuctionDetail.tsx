import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchAuctionById,
  fetchAuctionKoi,
  getKoiById,
} from "~/utils/apiUtils"; // Assume we have this API function
import { useAuth } from "~/AuthContext";
import { KoiDetailModel } from "../kois/Kois";
import { Auction } from "./Auctions";

export interface AuctionKoi {
  id: number;
  auction_id: number;
  koi_id: number;
  base_price: number;
  current_bid: number;
  current_bidder_id: number;
  is_sold: boolean;
  bid_method: string;
}

const AuctionDetail: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [koiData, setKoiData] = useState<KoiDetailModel[]>([]);
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const navigate = useNavigate();

  useEffect(() => {
    // if (!isLoggedIn) {
    //   navigate('/notfound');
    //   return;
    // }

    const fetchAuction = async () => {
      const auctionData = await fetchAuctionById(Number(id));
      setAuction(auctionData);

      if (auctionData) {
        const koiData = await fetchAuctionKoi(auctionData!.id);
        const koiDetailsPromise = koiData.map((koi: AuctionKoi) =>
          getKoiById(koi.id),
        );
        const koiDetails = await Promise.all(koiDetailsPromise);
        setKoiData(koiDetails);
      }
    };

    fetchAuction();
  }, [id]);

  if (!auction) {
    return <div className="py-8 text-center">Auction not found.</div>;
  }

  return (
    <>
      <div className="m-5 flex max-h-30 flex-col items-start justify-between gap-4 rounded-lg bg-transparent p-6 shadow-lg transition-all duration-300 ease-in-out hover:border-blue-500 hover:shadow-xl hover:ring-2 hover:ring-blue-300 md:flex-row">
        <div className="flex flex-1 flex-row gap-10">
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
              {new Date(auction.start_time).toLocaleString()}
            </p>
          </div>

          <div className="mb-4 flex flex-col">
            <h3 className="text-sm text-gray-500">End Time:</h3>
            <p className="text-lg font-medium text-gray-700">
              {new Date(auction.end_time).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-row items-center">
            <span
              className={`rounded-lg px-4 py-2 text-lg font-bold ${auction.status === "Live" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            >
              {auction.status}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {koiData.map((koi) => (
          <Link
            to={`/auctionkois/${auction.id}/${koi.id}`}
            key={koi.id}
            className="koi-card transform overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
          >
            <div className="relative">
              <img
                src={koi.thumbnail}
                alt={koi.name}
                className="h-48 w-full object-cover bg-[#4086c7]"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs">
                {koi.id}
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
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{koi.name}</h2>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">{koi.status_name}</span>
                <span className="text-lg font-bold">
                  ${koi.current_bid || koi.base_price}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p>Breeder: {koi.breeder}</p>
                  <p>Sex: {koi.sex}</p>
                </div>
                <div className="text-right">
                  <p>Length: {koi.length}cm</p>
                  <p>Age: {koi.age}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AuctionDetail;
