import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTag, faStar } from "@fortawesome/free-solid-svg-icons";
import { getCategoryName } from "~/utils/dataConverter";
import KoiDetails from "../auctiondetail/KoiDetails";
import { KoiInAuctionDetailModel, KoiDetailModel } from "~/types/kois.type";
import ScrollToTop from "react-scroll-to-top";
import { koiBreeders } from "~/utils/data/koibreeders";

type BaseKoiProps<T> = {
  kois: T[];
  renderActions?: (koi: T) => ReactNode;
  buttonEffect?: (koi: T) => ReactNode;
  handleView?: (id: number) => void;
  handleEdit?: (id: number) => void;
  handleDelete?: (id: number) => void;
};

interface KoiSearchGridProps<T extends KoiDetailModel> extends BaseKoiProps<T> {
  getLinkUrl?: (koi: T) => string; // Made optional
}

const KoiSearchGrid = <T extends KoiDetailModel>({
  kois,
  renderActions,
  getLinkUrl,
  buttonEffect,
}: KoiSearchGridProps<T>) => {
  return (
    <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {kois.map((koi: T) => (
        <div
          key={koi.id}
          className="transform overflow-hidden m-1 md:m-5 rounded-[1.5rem] bg-white shadow-md transition-transform hover:scale-102"
        >
          <div className="flex flex-col">
            <div className="relative flex md:justify-center bg-gradient-to-r from-[#1365b4] to-[#1584cb] duration-300 ease-in-out">
              {getLinkUrl ? (
                <Link
                  to={getLinkUrl(koi)}
                  className="relative flex md:justify-center bg-gradient-to-r from-[#1365b4] to-[#1584cb] duration-300 ease-in-out"
                >
                  <div className="h-[17rem] w-[50%] md:h-[28rem] md:w-[23rem] flex justify-center">
                    <div className="absolute w-[30%] h-[60%] top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 md:w-[60%] md:h-[90%] md:top-1/2 md:left-1/2">
                      <img
                        src={koi.thumbnail}
                        alt={koi.name}
                        className="h-full w-full drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.2)] duration-500 hover:drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.35)] opacity-100"
                      />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="relative flex md:justify-center bg-gradient-to-r from-[#1365b4] to-[#1584cb] duration-300 ease-in-out">
                  <div className="h-[17rem] w-[50%] md:h-[28rem] md:w-[23rem] flex justify-center">
                    <div className="absolute w-[30%] h-[60%] top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 md:w-[60%] md:h-[90%] md:top-1/2 md:left-1/2">
                      <img
                        src={koi.thumbnail}
                        alt={koi.name}
                        className="h-full w-full drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.2)] duration-500 hover:drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.35)] opacity-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute top-3 left-3 bg-opacity-50 text-white p-3 text-lg flex items-center">
                {koiBreeders.find((breeder) => breeder.id === koi.owner_id) && (
                  <img
                    src={
                      koiBreeders.find((breeder) => breeder.id === koi.owner_id)
                        ?.avatar_url
                    }
                    alt="Breeder Avatar"
                    className="w-[25%]"
                  />
                )}
              </div>
              <div className="absolute bottom-9 left-2 md:bottom-2 md:left-3 text-white rounded-full p-1 text-md font-bold">
                <FontAwesomeIcon icon={faTag} className="mr-1" />
                {koi.id}
              </div>
              <div className="sm:hidden bg-gray-300 rounded-xl m-3 p-2 text-md font-bold w-1/2">
                <KoiDetails
                  category={getCategoryName(koi.category_id)}
                  sex={koi.sex}
                  length={koi.length}
                  age={koi.age}
                />
              </div>
              <div className="absolute bottom-2 left-2 sm:left-auto sm:right-2 text-white rounded-full p-1 text-md font-bold">
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon key={index} icon={faStar} className="mr-1" />
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-300 sm:flex sm:flex-col">
              <h2 className="text-xl mt-1 mb-1 text-black font-semibold">
                {koi.name}
              </h2>
              <div className="hidden sm:flex flex-col sm:flex-row">
                <hr className="w-full border-t border-gray-400 my-2" />
              </div>
              <div className="hidden sm:block">
                <KoiDetails
                  category={koi.category_id.toString()}
                  sex={koi.sex}
                  length={koi.length}
                  age={koi.age}
                />
              </div>
              {renderActions && renderActions(koi)}
              {/* Render buttonEffect with koi.id */}
              {buttonEffect && buttonEffect(koi)}
            </div>
          </div>
        </div>
      ))}
      <ScrollToTop smooth />
    </div>
  );
};

export default KoiSearchGrid;
