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
    <div className="flex flex-col items-center bg-red">
      <img
        src="/breeders-transparent.png"
        alt="Breeders"
        className="mb-4 mt-5 h-auto w-full max-w-[900px] rounded-b-2xl"
      />
      <div className="mb-4 mt-5 text-center">
        <p className="mb-5 text-5xl font-bold">Your Direct Connection To The</p>
        <p className="text-5xl font-bold">
          Top <span className="text-red-500">Japanese</span> Koi Breeders
        </p>
      </div>
      <div className="mb-20 flex h-20 w-5/6 items-center justify-center">
        {!isLoggedIn && (
          <FancyButton
            text="Register"
            hoverText="Join Now"
            to="/register"
            className="mr-4 mt-10 w-full max-w-[300px]"
          />
        )}
        <FancyButton
          text="View Auction"
          hoverText="Bid"
          to="/auctions"
          className="mt-10 w-full max-w-[300px]"
        />
      </div>

      {/* Image grid */}
      <div className="m-5 mb-20 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {koiBreeders.map((breeder, index) => (
          <div
            key={index}
            className="flex h-[11rem] hover:cursor-pointer w-[11rem] items-center justify-center rounded-2xl border border-gray-400 bg-gray-200 p-4 transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            onClick={() => handleBreederClick(index)}
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
  );
};

export default Home;
