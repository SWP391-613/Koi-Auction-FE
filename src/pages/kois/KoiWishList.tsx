import { faStar, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import KoiDetails from "~/components/auctiondetail/KoiDetails";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { useAuth } from "~/contexts/AuthContext";
import { KoiDetailModel } from "~/types/kois.type";
import { KoisResponse } from "~/types/paginated.types";
import { getCookie } from "~/utils/cookieUtils";
import { koiBreeders } from "~/utils/data/koibreeders";
import { getCategoryName } from "~/utils/dataConverter";

const KoiWishList: React.FC = () => {
  const userId = getCookie("user_id");
  const accessToken = getCookie("access_token");
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [totalKoi, setTotalKoi] = useState(0); // State to hold total koi count
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true); // To track if more pages are available
  const itemsPerPage = 16; // Number of koi per page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };

  const handleView = (id: number) => {
    navigate(`/kois/${id}`);
  };

  // if(isLoading){
  //   return (
  //     <LoadingComponent/>
  //   )
  // }

  const fetchKoiData = useCallback(async () => {
    if (!accessToken) {
      setError("No access token available");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get<KoisResponse>(
        `${DYNAMIC_API_URL}/breeders/kois/status`,
        {
          params: {
            breeder_id: userId,
            status: "UNVERIFIED",
            page: currentPage - 1,
            limit: itemsPerPage,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = response.data; // Access the data property of the response

      if (data) {
        setKois(data.item);
        setTotalKoi(data.total_item);
        setHasMorePages(data.total_page > currentPage);
      }
    } catch (error) {
      console.error("Cannot fetch Koi data:", error);
      setError("Failed to fetch your verify Koi data");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, currentPage, itemsPerPage]);

  useEffect(() => {
    if (isLoggedIn && userId && accessToken) {
      fetchKoiData();
    }
  }, [isLoggedIn, userId, accessToken, fetchKoiData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page); // Update the current page when pagination changes
  };

  return (
    <div>
      {kois.length > 0 && userId ? (
        <div className="ml-16 mr-16 mb-16">
          <Typography variant="h4" className="text-center">
            Your Kois is waiting to Verified
          </Typography>
          <Typography
            variant="body1"
            className="text-center text-gray-500"
            sx={{ marginTop: "15px" }}
          >
            *Note: Please wait until your koi is verified by our team. We will
            send result email back, thanks for your patience. From Koi Auction
            Team.
          </Typography>
          <Typography variant="body2" className="text-left">
            Showing 1 - {kois.length} of {totalKoi} results.
          </Typography>
          <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {kois.map((koi: KoiDetailModel) => (
              <div
                key={koi.id}
                className="transform overflow-hidden m-1 md:m-5 rounded-[1.5rem] bg-white shadow-md transition-transform hover:scale-102"
              >
                <div className="flex justify-end bg-gray-200"></div>
                <div className="flex flex-col">
                  <div className="relative flex md:justify-center bg-gradient-to-r from-[#1365b4] to-[#1584cb] duration-300 ease-in-out">
                    <Link
                      to={`/kois/${koi.id}`}
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
                    <div className="absolute top-3 left-3 bg-opacity-50 text-white rounded-full p-3 text-lg flex items-center">
                      {koiBreeders.find(
                        (breeder) => breeder.id === koi.owner_id,
                      ) && (
                        <img
                          src={
                            koiBreeders.find(
                              (breeder) => breeder.id === koi.owner_id,
                            )?.avatar_url
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
                        year_born={koi.year_born}
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 sm:left-auto sm:right-2 text-white rounded-full p-1 text-md font-bold">
                      {[...Array(5)].map((_, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={faStar}
                          className="mr-1"
                        />
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
                        year_born={koi.year_born}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-[30rem]">
          <Typography
            variant="h3"
            sx={{
              color: "error.main",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Koi's Unverified Not Available
          </Typography>
        </div>
      )}
    </div>
  );
};

export default KoiWishList;
