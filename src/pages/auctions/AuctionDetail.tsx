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
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3">
        {koiData.map(
          (koi) =>
            koi.is_display === 1 && (
              <Link
                to={`/koi/${koi.id}`}
                key={koi.id}
                className="koi-card m-2 transform overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
              >
                <div className="flex flex-row justify-between items-start rounded-lg border border-gray-300 bg-gray-200 p-4 shadow-lg transition-all duration-300 ease-in-out hover:border-blue-500 hover:shadow-xl">
                  <div>
                    <img
                      src={koi.thumbnail}
                      alt={koi.name}
                      className="h-[40rem] bg-[#4086c7] w-[30rem] rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-8">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-10">
                      {koi.name}
                    </h1>
                    <p className="text-md text-black">ID: {koi.id}</p>
                    <p className="text-md text-black">
                      Length: {koi.length} cm
                    </p>
                    <p className="text-md text-black">Sex: {koi.sex}</p>
                    <p className="text-md text-black">Age: {koi.age}</p>
                    <p className="text-md text-black">
                      Status: {koi.status_name}
                    </p>
                    <p className="text-md text-black">
                      Owner ID: {koi.owner_id}
                    </p>
                    <p className="text-md text-black">
                      Category ID: {koi.category_id}
                    </p>
                    <p className="mt-3 text-gray-600">{koi.description}</p>
                  </div>
                </div>
              </Link>
            ),
        )}
      </div>
    </>
  );
};

export default AuctionDetail;
