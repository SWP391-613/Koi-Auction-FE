import { faMoneyBill, faStar, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import { fetchBreedersData } from "~/apis/users/breeder.apis";
import { KoiInAuctionDetailModel } from "~/types/kois.type";
import { BreedersResponse } from "~/types/paginated.types";
import { convertDataToReadable, getCategoryName } from "~/utils/dataConverter";
import KoiDetails from "../auctiondetail/KoiDetails";
import axios from "axios";
import { DYNAMIC_API_URL } from "~/constants/endPoints";

type BaseKoiProps<T> = {
  kois: T[];
  renderActions?: (koi: T) => ReactNode;
  buttonEffect?: (koi: T) => ReactNode;
  handleView?: (id: number) => void;
  handleEdit?: (id: number) => void;
  handleDelete?: (id: number) => void;
};

interface KoiSearchGridProps<T extends KoiInAuctionDetailModel>
  extends BaseKoiProps<T> {
  getLinkUrl?: (koi: T) => string; // Made optional
}

const KoiSearchGrid = <T extends KoiInAuctionDetailModel>({
  kois,
  renderActions,
  getLinkUrl,
  buttonEffect,
}: KoiSearchGridProps<T>) => {
  const [koiBreeders, setKoiBreeders] = useState<BreedersResponse>({
    total_page: 0,
    total_item: 0,
    item: [],
  });
  useEffect(() => {
    const fetchAllBreeders = async () => {
      try {
        const response = await axios.get(`${DYNAMIC_API_URL}/breeders`, {
          params: {
            page: 0,
            limit: 20,
          },
        });
        setKoiBreeders(response.data || []);
      } catch (error) {
        console.error("Error fetching breeders:", error);
      }
    };
    fetchAllBreeders();
  }, []);

  return (
    <div className="mx-auto grid grid-cols-1 min-[500px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {kois.map((koi: T, index) => (
        <motion.div
          key={koi.id + index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.1, // Each card appears with a slight delay
            ease: "easeOut",
          }}
          className="transform overflow-hidden m-1 mb-3 md:m-5 rounded-[1.5rem]  bg-white shadow-md transition-all hover:scale-102"
        >
          <div className="flex justify-end bg-gray-200">
            {renderActions && renderActions(koi)}
          </div>
          <motion.div
            className="flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative flex md:justify-center bg-gradient-to-r from-[#1365b4] to-[#1584cb] duration-300 ease-in-out">
              {getLinkUrl && (
                <Link
                  to={getLinkUrl(koi)}
                  className="relative flex w-1/2 md:w-full md:justify-center"
                >
                  <motion.div
                    className="h-[17rem] w-full md:h-[28rem] md:w-[23rem] flex justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4">
                      <motion.img
                        src={koi.thumbnail}
                        alt={koi.name}
                        className="h-full w-full object-contain drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.2)] duration-500 hover:drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.35)] opacity-100"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                </Link>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-2 left-2 bg-opacity-50 text-white p-2 text-lg flex items-center z-10"
              >
                {Array.isArray(koiBreeders.item) &&
                  koiBreeders.item.find(
                    (breeder) => breeder.id === koi.owner_id,
                  ) && (
                    <img
                      src={
                        koiBreeders.item.find(
                          (breeder) => breeder.id === koi.owner_id,
                        )?.avatar_url
                      }
                      alt="Breeder Avatar"
                      className="w-12 h-12 md:w-1/2 md:h-1/2 object-contain"
                    />
                  )}
              </motion.div>

              {koi.bid_method && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="hidden sm:flex absolute top-3 right-3 bg-black bg-opacity-20 backdrop-blur-sm text-white rounded-full px-4 py-2 text-sm font-medium flex items-center shadow-lg border border-white/30"
                >
                  <div className="flex gap-2 justify-center items-center">
                    {convertDataToReadable(koi.bid_method)}
                    <FontAwesomeIcon
                      key={index}
                      icon={faMoneyBill}
                      className="mr-1"
                    />
                  </div>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-9 left-2 md:bottom-2 md:left-3 text-white rounded-full p-1 text-md font-bold"
              >
                <FontAwesomeIcon icon={faTag} className="mr-1" />
                {koi.id}
              </motion.div>

              <div className="sm:hidden bg-gray-300 rounded-xl m-3 p-2 text-md font-bold absolute right-0 top-0">
                <KoiDetails
                  category={getCategoryName(koi.category_id)}
                  sex={convertDataToReadable(koi.sex)}
                  length={koi.length}
                  year_born={koi.year_born}
                />
              </div>
              <div className="absolute bottom-2 left-2 sm:left-auto sm:right-2 text-white rounded-full p-1 text-md font-bold">
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon key={index} icon={faStar} className="mr-1" />
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-gray-300 sm:flex sm:flex-col"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl mt-1 mb-1 text-black font-semibold">
                  {koi.name}
                </h2>
                {koi.bid_method && (
                  <div className="sm:hidden flex gap-2 justify-center items-center text-black bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium flex items-center shadow-lg border border-white/30">
                    {convertDataToReadable(koi.bid_method)}
                    <FontAwesomeIcon
                      key={index}
                      icon={faMoneyBill}
                      className="mr-1 text-green-700"
                    />
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col sm:flex-row">
                <hr className="w-full border-t border-gray-400 my-2" />
              </div>
              <div className="hidden sm:block">
                <KoiDetails
                  category={getCategoryName(koi.category_id)}
                  sex={convertDataToReadable(koi.sex)}
                  length={koi.length}
                  year_born={koi.year_born}
                />
              </div>
              {/* Render buttonEffect with koi.id */}
              {buttonEffect && buttonEffect(koi)}
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
      <ScrollToTop smooth />
    </div>
  );
};

export default KoiSearchGrid;
