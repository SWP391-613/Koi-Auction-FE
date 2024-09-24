import React from "react";
import { useNavigate } from "react-router-dom";
import { koiBreeders } from "../../utils/data/koibreeders";
import NavigateButton from "../../components/shared/NavigateButton.jsx";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <img
        src="https://auctionkoi.com/images/breeders-transparent.png"
        alt="Breeders"
        className="mt-5 mb-4 w-full max-w-[900px] h-auto rounded-b-2xl"
      />
      <div className="text-center mt-5 mb-4">
        <p className="text-5xl font-bold mb-5">Your Direct Connection To The</p>
        <p className="text-5xl font-bold">
          Top <span className="text-red-500">Japanese</span> Koi Breeders
        </p>
      </div>
      <div className="mb-20 flex w-3/6 h-20 items-center justify-center">
          <NavigateButton
            text="Register"
            to="/register"
            className="flex items-center justify-center w-full max-w-[300px] h-[4rem] bg-red-500 hover:bg-red-600 text-white text-2xl font-semibold mt-10 py-2 px-4 rounded-2xl mr-4"
          />
        <NavigateButton
          text="View Auction"
          to="/auctions"
          className="flex items-center justify-center w-full max-w-[300px] h-[4rem] bg-blue-500 text-white text-2xl font-semibold mt-10 py-2 px-4 rounded-2xl"
        />
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mb-20 m-5">
        {koiBreeders.map((breeder, index) => (
          <div
            key={index}
            className="border border-gray-400 p-4 bg-gray-200 rounded-2xl flex justify-center items-center h-[11rem] w-[11rem] transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            <img
              src={breeder.logo}
              alt={`${breeder.name} logo`}
              className="w-20 h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
