import { Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import { toast } from "react-toastify";
import PaginationComponent from "~/components/common/PaginationComponent";
import KoiBreederViewGrid from "~/components/search/KoiBreederViewGrid";
import KoiUnverifiedSearchComponent from "~/components/search/KoiUnverifiedSearchComponent";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useAuth } from "~/contexts/AuthContext";
import { environment } from "~/environments/environment";
import { KoiDetailModel } from "~/types/kois.type";
import { KoisResponse } from "~/types/paginated.types";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage } from "~/utils/dataConverter";

const VerifyKoiList: React.FC = () => {
  const userId = getCookie("user_id");
  const accessToken = getCookie("access_token");
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [totalKoi, setTotalKoi] = useState(0); // State to hold total koi count
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true); // To track if more pages are available
  const itemsPerPage = 8; // Number of koi per page
  const [loading, setLoading] = useState(true);
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

  const handleApprove = async (id: number) => {
    setLoading(true);
    try {
      await axios.put(
        `https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/kois/status/${id}`,
        {
          tracking_status: "VERIFIED",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      toast.success("Koi Approved successfully");
      // Remove the approved Koi from the list
      setKois((prevKois) => prevKois.filter((koi) => koi.id !== id));
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to approve Koi");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (id: number) => {
    const confirmReject = confirm("Are you sure you want to reject this koi?");
    if (!confirmReject) return;

    try {
      await axios.put(
        `https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/kois/status/${id}`,
        {
          tracking_status: "REJECTED",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      toast.success("Koi rejected");
      // Remove the rejected Koi from the list
      setKois((prevKois) => prevKois.filter((koi) => koi.id !== id));
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to reject Koi");
      toast.error(errorMessage);
    }
  };

  const fetchKoiData = useCallback(async () => {
    if (!accessToken) {
      setError("No access token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_BASE_URL + environment.be.apiPrefix;
      const response = await axios.get<KoisResponse>(`${API_URL}/kois/status`, {
        params: {
          status: "UNVERIFIED",
          page: currentPage - 1,
          limit: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
      setLoading(false);
    }
  }, [accessToken, currentPage, itemsPerPage]);

  useEffect(() => {
    if (isLoggedIn && userId && accessToken) {
      fetchKoiData();
    }
  }, [isLoggedIn, userId, accessToken, fetchKoiData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderCrudButtons = (koi: KoiDetailModel) => (
    <>
      <CrudButton
        onClick={() => handleView(koi.id)}
        ariaLabel="View"
        svgPath="view.svg"
        width={30}
        height={30}
      />
      <CrudButton
        onClick={() => handleApprove(koi.id)}
        ariaLabel="Approve"
        svgPath="approve.svg"
        width={30}
        height={30}
      />
      <CrudButton
        onClick={() => handleDecline(koi.id)}
        ariaLabel="No Approve"
        svgPath="notapprove.svg"
        width={30}
        height={30}
      />
    </>
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page); // Update the current page when pagination changes
  };

  return (
    <div>
      {kois.length > 0 ? (
        <KoiUnverifiedSearchComponent
          onSearchStateChange={handleSearchStateChange}
          handleEdit={handleApprove}
          handleDelete={handleDecline}
          renderActions={renderCrudButtons}
        />
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
            No Koi data available
          </Typography>
        </div>
      )}
      <ScrollToTop smooth />
    </div>
  );
};

export default VerifyKoiList;
