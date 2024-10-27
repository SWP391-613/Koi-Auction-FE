import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import FancyButton from "../../components/shared/FancyButton";
import { koiBreeders } from "../../utils/data/koibreeders";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleBreederClick = (breederId: number) => {
    navigate(`/breeder/${breederId}/info`);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-900/90 z-0" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Image container */}
        <div className="w-full max-w-[900px] flex justify-center mb-4 mt-5">
          <img
            src="/breeders-transparent.png"
            alt="Breeders"
            className="h-auto w-full rounded-b-2xl"
          />
        </div>

        <div className="mb-4 mt-5 text-center text-white">
          <p className="mb-5 text-5xl font-bold">Your Direct Connection To The</p>
          <p className="text-5xl font-bold">
            Top <span className="text-orange-500">Japanese</span> Koi Breeders
          </p>
        </div>

        <div className="mb-20 flex h-20 w-5/6 items-center justify-center mx-auto">
          {!isLoggedIn && (
            <FancyButton
              text="Join Now"
              hoverText="JoinNow"
              to="/register"
              className="mr-4 mt-10 w-full max-w-[300px]"
            />
          )}
          <FancyButton
            text="View Auction"
            hoverText="Bid Now"
            to="/auctions"
            className="mt-10 w-full max-w-[300px]"
          />
        </div>

        {/* Partner Breeders */}
        <div className="text-center text-white mb-10">
          <h2 className="text-3xl font-bold">Our Partner Breeders</h2>
        </div>

        {/* Image grid */}
        <div className="m-5 mb-20 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {koiBreeders.map((breeder) => (
            <div
              key={breeder.id}
              className="flex h-[11rem] hover:cursor-pointer w-[11rem] items-center justify-center rounded-2xl border border-gray-400 bg-gray-200 p-4 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              onClick={() => handleBreederClick(breeder.id)}
            >
              <img
                src={breeder.avatar_url}
                alt={`${breeder.name} logo`}
                className="h-auto w-20"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
