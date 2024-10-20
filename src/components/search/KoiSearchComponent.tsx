import React, { useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Pagination,
} from "@mui/material";
import SearchBar from "../shared/SearchBar";
import { KoiDetailModel, useKoiSearch } from "~/hooks/useSearch";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleRight,
  faStar,
  faTag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import KoiDetails from "../auctiondetail/KoiDetails";
import { getCategoryName } from "~/utils/dataConverter";
import { formatCurrency } from "~/utils/currencyUtils";
import PaginationComponent from "../common/PaginationComponent";

interface KoiSearchComponentProps {
  onSearchStateChange: (isActive: boolean) => void;
}

const KoiSearchComponent: React.FC<KoiSearchComponentProps> = () => {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    handlePageChange,
  } = useKoiSearch(500);

  return (
    <div className="container mx-auto p-4 mt-5">
      <SearchBar
        value={query}
        onChange={setQuery}
        loading={loading}
        placeholder="Search for koi..."
      />
      {loading && <p className="mt-2">Searching...</p>}
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
      {results.length > 0 && !loading && (
        <>
          <Typography variant="body2" className="mt-3">
            Total Items: {totalItems}
          </Typography>

          <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((koi: KoiDetailModel) => (
              <Link
                to={`/kois/${koi.id}`}
                key={koi.id}
                className="transform overflow-hidden m-1 md:m-5
              rounded-[1.5rem] bg-white shadow-md transition-transform hover:scale-102"
              >
                <div className="flex flex-col">
                  <div
                    className="relative flex md:justify-center
                bg-gradient-to-r from-[#1365b4] to-[#1584cb] duration-300 ease-in-out"
                  >
                    <div className="h-[17rem] w-[50%] md:h-[28rem] md:w-[23rem] flex justify-center">
                      <div
                        className="absolute w-[30%] h-[60%] top-1/2 left-1/4
                    -translate-x-1/2 -translate-y-1/2 md:w-[60%] md:h-[90%] md:top-1/2 md:left-1/2"
                      >
                        <img
                          src={koi.thumbnail}
                          alt={koi.name}
                          className="h-full w-full
                        drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.2)]
                        duration-500
                        hover:drop-shadow-[9px_-9px_6px_rgba(0,0,0,0.35)] opacity-100 "
                        />
                      </div>
                    </div>
                    <div
                      className="absolute top-3 left-3 bg-black bg-opacity-50
                  text-white rounded-full p-3 text-lg flex items-center"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-1" />
                      {koi.owner_id}
                    </div>
                    <div
                      className="absolute bottom-9 left-2 md:bottom-2 md:left-3
                  text-white rounded-full p-1 text-md font-bold"
                    >
                      <FontAwesomeIcon icon={faTag} className="mr-1" />
                      {koi.id}
                    </div>
                    <div
                      className="sm:hidden bg-gray-300 rounded-xl m-3 p-2 text-md font-bold
                  w-1/2"
                    >
                      <KoiDetails
                        category={getCategoryName(koi.category_id)}
                        sex={koi.sex}
                        length={koi.length}
                        age={koi.age}
                      />
                    </div>
                    <div
                      className="absolute bottom-2 left-2 sm:left-auto sm:right-2
                  text-white rounded-full p-1 text-md font-bold"
                    >
                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                      <FontAwesomeIcon icon={faStar} className="mr-1" />
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {!loading && query && results.length === 0 && (
        <p className="mt-2">No results found.</p>
      )}
    </div>
  );
};

export default KoiSearchComponent;
