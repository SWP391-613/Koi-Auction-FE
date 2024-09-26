import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAuctionById } from "~/utils/apiUtils"; // Assume we have this API function
import { useAuth } from "~/AuthContext";
import { Auction } from "../Auction.model";

const AuctionDetail: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
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
    };

    fetchAuction();
  }, [id]);

  if (!auction) {
    return <div className="py-8 text-center">Auction not found.</div>;
  }

  return (
    <div className="m-20 flex max-h-96 flex-col items-start justify-between gap-4 rounded-lg border border-transparent bg-gray-200 p-6 shadow-lg transition-all duration-300 ease-in-out hover:border-blue-500 hover:shadow-xl hover:ring-2 hover:ring-blue-300 md:flex-row">
      <div className="flex flex-1 flex-col">
        <div className="mb-4 flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">
            Auction #{auction.id}
          </h1>
          <h2 className="text-xl font-semibold text-gray-600">
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

      <div className="flex flex-1 items-center justify-center">
        <img
          src="https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1-275x400.jpg"
          alt="fish"
          className="h-48 w-auto rounded-lg object-cover shadow-md"
        />
      </div>
    </div>
  );
};

export default AuctionDetail;
