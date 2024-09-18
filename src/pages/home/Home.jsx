import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <img
        src={"https://auctionkoi.com/images/breeders-transparent.png"}
        alt="Breeders"
        className="mt-5 mb-4 w-3/6 rounded-b-2xl"
      />
      <div className="text-center mt-5 mb-4">
        <p className="text-5xl font-bold mb-2">
          Your Direct Connection To The
        </p>
        <p className="text-5xl font-bold">
          Top <span className="text-red-500">Japanese</span> Koi Breeders
        </p>
      </div>
      <div className="mb-20 flex w-3/6 h-20">
        <button
          className="w-full bg-red-500 text-white font-semibold mt-10 py-2 px-4 rounded-2xl mr-4"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
        <button
          className="w-full bg-blue-500 text-white font-semibold mt-10 py-2 px-4 rounded-2xl"
          onClick={() => navigate("/auctions")}
        >
          View Auction
        </button>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-7 gap-4 mb-20">
        {Array.from({ length: 14 }).map((_, index) => (
          <img
            key={index}
            src={"https://auctionkoi.com/images/nnd-logo.png"}
            alt="NND logo"
            className="w-20 h-auto"
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
