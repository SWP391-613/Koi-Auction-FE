import { Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "~/components/common/PaginationComponent";
import KoiBreederViewGrid from "~/components/search/KoiBreederViewGrid";
import KoiUnverifiedSearchComponent from "~/components/search/KoiUnverifiedSearchComponent";
import { useAuth } from "~/contexts/AuthContext";
import { environment } from "~/environments/environment";
import { KoiDetailModel } from "~/types/kois.type";
import { KoisResponse } from "~/types/paginated.types";
import { getCookie } from "~/utils/cookieUtils";

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

  const fetchKoiData = useCallback(async () => {
    if (!accessToken) {
      setError("No access token available");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const API_URL =
        import.meta.env.VITE_API_BASE_URL + environment.be.apiPrefix;
      const response = await axios.get<KoisResponse>(
        `${API_URL}/breeders/kois/status`,
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
      setError("Failed to fetch Koi data");
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
    return <div>Loading...</div>;
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
        <>
          <KoiUnverifiedSearchComponent
            onSearchStateChange={handleSearchStateChange}
          />
          <Typography variant="h3">This Kois is waiting to Verified</Typography>
          <KoiBreederViewGrid kois={kois} handleView={handleView} />
        </>
      ) : (
        <div>No Koi data available</div>
      )}
      <PaginationComponent
        totalPages={hasMorePages ? currentPage + 1 : currentPage} // Handle pagination with dynamic totalPages
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default KoiWishList;
