import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import { useAuth } from "~/contexts/AuthContext";
import { environment } from "~/environments/environment";
import {
  KoiApiResponse,
  KoiDetailModel,
  KoisResponse,
} from "~/types/kois.type";
import { getCookie } from "~/utils/cookieUtils";
import KoiCart from "./KoiCart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { extractErrorMessage } from "~/utils/dataConverter";
import PaginationComponent from "~/components/pagination/Pagination";

const VerifyKoiList: React.FC = () => {
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

  const handleView = (id: number) => {
    navigate(`/kois/${id}`);
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:4000/api/v1/kois/status/${id}`,
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
    }
  };

  const handleDecline = async (id: number) => {
    const confirmReject = confirm("Are you sure you want to reject this koi?");
    if (!confirmReject) return;

    try {
      await axios.put(
        `http://localhost:4000/api/v1/kois/status/${id}`,
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
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const API_URL =
        import.meta.env.VITE_API_BASE_URL + environment.be.apiPrefix;
      const response = await axios.get<KoiApiResponse>(
        `${API_URL}/kois/status`,
        {
          params: {
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

  const renderCrudButtons = (koi: KoiDetailModel) => (
    <>
      <CrudButton
        onClick={() => handleView(koi.id)}
        ariaLabel="View"
        svgPath="view.svg"
      />
      <CrudButton
        onClick={() => handleApprove(koi.id)}
        ariaLabel="Approve"
        svgPath="approve.svg"
      />
      <CrudButton
        onClick={() => handleDecline(koi.id)}
        ariaLabel="No Approve"
        svgPath="notapprove.svg"
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
        <KoiCart
          items={kois}
          handleView={handleView}
          handleEdit={handleApprove}
          handleDelete={handleDecline}
          renderCrudButtons={renderCrudButtons}
        />
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

export default VerifyKoiList;
