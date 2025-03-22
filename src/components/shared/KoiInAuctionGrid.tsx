import { faMoneyBill, faStar, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBreedersData } from "~/apis/users/breeder.apis";
import { Auction } from "~/pages/auctions/AuctionDetail";
import { Breeder } from "~/types/users.type";
import { convertDataToReadable, getCategoryName } from "~/utils/dataConverter";
import KoiDetails from "../auctiondetail/KoiDetails";
import useBreeders from "~/hooks/useBreeders";
import LoadingComponent from "./LoadingComponent";

interface KoiInAuctionGridProps {
  auction: Auction;
}

const KoiInAuctionGrid: React.FC<KoiInAuctionGridProps> = ({ auction }) => {
  const { data: koiBreeders, isLoading, error } = useBreeders();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div>Error fetching breeders</div>;
  }

  return (
    <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {auction.auction_koi.map((auctionKoi) => (
        <Link
          to={`/auctionkois/${auction.id}/${auctionKoi.id}`}
          key={auctionKoi.id}
          className="transform overflow-hidden m-1 mb-3 md:m-5 rounded-[1.5rem] bg-white shadow-md transition-all hover:scale-102"
        >
          <div className="flex flex-col">
            <div className="relative flex md:justify-center bg-gradient-to-r from-[#1365b4] to-[#1584cb] duration-300 ease-in-out ">
              <div className="h-[17rem] w-full md:h-[28rem] md:w-[23rem] flex justify-center">
                <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-3/4 sm:-translate-x-1/2 -translate-y-1/2 p-4">
                  <img
                    src={auctionKoi.koi.thumbnail}
                    alt={auctionKoi.koi.name}
                    className="h-full w-full object-contain drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.2)] duration-500 hover:drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.35)] opacity-100"
                  />
                </div>
              </div>
              <div className="absolute top-2 left-2 bg-opacity-50 text-white p-2 text-lg flex items-center z-10">
                {koiBreeders &&
                  koiBreeders.find(
                    (breeder) =>
                      breeder.user_response.id === auctionKoi.koi.owner_id,
                  ) && (
                    <img
                      src={
                        koiBreeders.find(
                          (breeder) =>
                            breeder.user_response.id ===
                            auctionKoi.koi.owner_id,
                        )?.user_response.avatar_url
                      }
                      alt="Breeder Avatar"
                      className="w-12 h-12 md:w-1/2 md:h-1/2 object-contain"
                    />
                  )}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden sm:flex absolute top-3 right-3 bg-black bg-opacity-20 backdrop-blur-sm text-white rounded-full px-4 py-2 text-sm font-medium flex items-center shadow-lg border border-white/30"
              >
                <div className="flex gap-2 justify-center items-center">
                  {convertDataToReadable(auctionKoi.bid_method)}
                  <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />
                </div>
              </motion.div>

              <div className="absolute bottom-9 left-2 md:bottom-2 md:left-3 text-white rounded-full p-1 text-md font-bold">
                <FontAwesomeIcon icon={faTag} className="mr-1" />
                {auctionKoi.id}
              </div>
              <div className="sm:hidden bg-gray-300 rounded-xl m-3 p-2 text-md font-bold absolute right-0 top-0">
                <KoiDetails
                  category={getCategoryName(auctionKoi.koi.category_id)}
                  sex={convertDataToReadable(auctionKoi.koi.sex)}
                  length={auctionKoi.koi.length}
                  year_born={auctionKoi.koi.year_born}
                />
              </div>
              <div className="absolute bottom-2 left-2 sm:left-auto sm:right-2 text-white rounded-full p-1 text-md font-bold">
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon key={index} icon={faStar} className="mr-1" />
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-300 sm:flex sm:flex-col">
              <div className="flex justify-between items-center">
                <h2 className="text-xl mt-1 mb-1 text-black font-semibold">
                  {auctionKoi.koi.name}
                </h2>
                <div className="sm:hidden flex gap-2 justify-center items-center text-black bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium flex items-center shadow-lg border border-white/30">
                  {convertDataToReadable(auctionKoi.bid_method)}
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    className="mr-1 text-green-700"
                  />
                </div>
              </div>
              <div className="hidden sm:flex flex-col sm:flex-row">
                <hr className="w-full border-t border-gray-400 my-2" />
              </div>
              <div className="hidden sm:block">
                <KoiDetails
                  category={getCategoryName(auctionKoi.koi.category_id)}
                  sex={convertDataToReadable(auctionKoi.koi.sex)}
                  length={auctionKoi.koi.length}
                  year_born={auctionKoi.koi.year_born}
                />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default KoiInAuctionGrid;
